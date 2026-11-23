package app

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

type RoadmapCatalogItem struct {
	ID               int64          `db:"id" json:"id"`
	Title            string         `db:"title" json:"title"`
	ShortDescription string         `db:"short_description" json:"short_description"`
	IsFavorite       bool           `db:"is_favorite" json:"is_favorite"`
	Tags             pq.StringArray `db:"tags" json:"tags"`
}

type RoadmapTag struct {
	ID       int64  `db:"id" json:"id"`
	Name     string `db:"name" json:"name"`
	Category string `db:"category" json:"category"` // language, direction, basics
}

type RelatedRoadmap struct {
	ID           int64  `db:"id" json:"id"`
	Title        string `db:"title" json:"title"`
	RelationType string `db:"relation_type" json:"-"`
}

type RoadmapSkillNode struct {
	ID           int64          `db:"id" json:"id"`
	Name         string         `db:"name" json:"name"`
	Description  string         `db:"description" json:"description"`
	Difficulty   string         `db:"difficulty" json:"difficulty"` // beginner, advanced, deep
	PosX         int            `db:"pos_x" json:"pos_x"`
	PosY         int            `db:"pos_y" json:"pos_y"`
	Status       string         `db:"status" json:"status"` // not_started, in_progress, completed, skipped
	Dependencies pq.Int64Array  `db:"dependencies" json:"dependencies"`
	Tags         pq.StringArray `db:"tags" json:"tags"`
}

type RoadmapDetails struct {
	ID                 int64              `db:"id" json:"id"`
	Title              string             `db:"title" json:"title"`
	ShortDescription   string             `db:"short_description" json:"short_description"`
	RequiredSkillsDesc string             `db:"required_skills_desc" json:"required_skills_desc"`
	TypicalTasksDesc   string             `db:"typical_tasks_desc" json:"typical_tasks_desc"`
	AIImpactNotes      string             `db:"ai_impact_notes" json:"ai_impact_notes"`
	PracticeBaseURL    string             `db:"practice_base_url" json:"practice_base_url"`
	HHLastError        *string            `db:"hh_last_error" json:"hh_error"`
	HHKeySkills        []string           `json:"hh_key_skills"`
	ProgressPercent    int                `json:"progress_percent"`
	RelatedRoadmaps    []RelatedRoadmap   `json:"related_roadmaps"`
	NextStepRoadmaps   []RelatedRoadmap   `json:"next_step_roadmaps"`
	Nodes              []RoadmapSkillNode `json:"nodes"`
}

// HandleGetRoadmaps — каталог карт с независимым поиском по названию (?search=) или фильтром по тегу (?tag=)
func HandleGetRoadmaps(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := getCurrentUserID(r)
		search := strings.TrimSpace(r.URL.Query().Get("search"))
		tag := strings.TrimSpace(r.URL.Query().Get("tag"))

		baseSelect := `
			SELECT
				r.id,
				r.title,
				r.short_description,
				(ufr.roadmap_id IS NOT NULL) AS is_favorite,
				COALESCE(ARRAY_AGG(DISTINCT rt.name::text) FILTER (WHERE rt.name IS NOT NULL), '{}'::text[]) AS tags
			FROM roadmaps r
			LEFT JOIN user_favorite_roadmaps ufr ON r.id = ufr.roadmap_id AND ufr.user_id = $1
			LEFT JOIN roadmap_tag_links rtl ON r.id = rtl.roadmap_id
			LEFT JOIN roadmap_tags rt ON rtl.tag_id = rt.id
		`
		groupBy := ` GROUP BY r.id, r.title, r.short_description, ufr.roadmap_id ORDER BY r.id`

		var items []RoadmapCatalogItem
		var err error

		// По ЧТЗ фильтры независимы: если задан поиск — ищем по названию, иначе если задан тег — по тегу
		if search != "" {
			query := baseSelect + ` WHERE r.title ILIKE '%' || $2 || '%'` + groupBy
			err = db.Select(&items, query, userID, search)
		} else if tag != "" {
			query := baseSelect + `
				WHERE EXISTS (
					SELECT 1 FROM roadmap_tag_links rtl2
					JOIN roadmap_tags rt2 ON rtl2.tag_id = rt2.id
					WHERE rtl2.roadmap_id = r.id AND rt2.name = $2
				)
			` + groupBy
			err = db.Select(&items, query, userID, tag)
		} else {
			err = db.Select(&items, baseSelect+groupBy, userID)
		}

		if err != nil {
			log.Printf("Ошибка SQL (HandleGetRoadmaps): %v\n", err)
			http.Error(w, `{"error": "Не удалось загрузить список карт"}`, http.StatusInternalServerError)
			return
		}

		if items == nil {
			items = []RoadmapCatalogItem{}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(items)
	}
}

// HandleGetRoadmapTags — отдаёт список тегов для панели фильтрации в каталоге
func HandleGetRoadmapTags(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var tags []RoadmapTag
		err := db.Select(&tags, `SELECT id, name, category FROM roadmap_tags ORDER BY category, name`)
		if err != nil {
			log.Printf("Ошибка SQL (HandleGetRoadmapTags): %v\n", err)
			http.Error(w, `{"error": "Не удалось загрузить теги"}`, http.StatusInternalServerError)
			return
		}
		if tags == nil {
			tags = []RoadmapTag{}
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(tags)
	}
}

// HandleGetRoadmapByID — отдаёт полную информацию о карте, узлах, прогрессе и навыках hh.ru
func HandleGetRoadmapByID(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		roadmapID, err := strconv.ParseInt(chi.URLParam(r, "roadmapID"), 10, 64)
		if err != nil {
			http.Error(w, `{"error": "Неверный ID карты"}`, http.StatusBadRequest)
			return
		}
		userID := getCurrentUserID(r)

		// 1. Базовая информация о направлении
		var details RoadmapDetails
		err = db.Get(&details, `
			SELECT id, title, short_description, required_skills_desc,
			       typical_tasks_desc, ai_impact_notes, practice_base_url, hh_last_error
			FROM roadmaps
			WHERE id = $1
		`, roadmapID)
		if errors.Is(err, sql.ErrNoRows) {
			http.Error(w, `{"error": "Карта не найдена"}`, http.StatusNotFound)
			return
		}
		if err != nil {
			log.Printf("Ошибка SQL (roadmap meta): %v\n", err)
			http.Error(w, `{"error": "Не удалось загрузить карту"}`, http.StatusInternalServerError)
			return
		}

		// 2. Узлы дерева с LEFT JOIN прогресса, зависимостями и тегами
		var nodes []RoadmapSkillNode
		err = db.Select(&nodes, `
			SELECT
				s.id,
				s.name,
				s.description,
				s.difficulty,
				s.pos_x,
				s.pos_y,
				COALESCE(usp.status, 'not_started') AS status,
				COALESCE(ARRAY_AGG(DISTINCT sd.depends_on_skill_id) FILTER (WHERE sd.depends_on_skill_id IS NOT NULL), '{}'::bigint[]) AS dependencies,
				COALESCE(ARRAY_AGG(DISTINCT st.name::text) FILTER (WHERE st.name IS NOT NULL), '{}'::text[]) AS tags
			FROM skills s
			LEFT JOIN users_skill_progress usp ON s.id = usp.skill_id AND usp.user_id = $1
			LEFT JOIN skills_dependencies sd ON s.id = sd.skill_id
			LEFT JOIN skill_tag_links stl ON s.id = stl.skill_id
			LEFT JOIN skill_tags st ON stl.tag_id = st.id
			WHERE s.roadmap_id = $2
			GROUP BY s.id, s.name, s.description, s.difficulty, s.pos_x, s.pos_y, usp.status
			ORDER BY s.id
		`, userID, roadmapID)
		if err != nil {
			log.Printf("Ошибка SQL (roadmap nodes): %v\n", err)
			http.Error(w, `{"error": "Не удалось загрузить узлы карты"}`, http.StatusInternalServerError)
			return
		}
		if nodes == nil {
			nodes = []RoadmapSkillNode{}
		}
		details.Nodes = nodes

		// 3. Расчёт процента прогресса: "completed" и "skipped" считаются пройденными
		passedCount := 0
		for _, n := range nodes {
			if n.Status == "completed" || n.Status == "skipped" {
				passedCount++
			}
		}
		if len(nodes) > 0 {
			details.ProgressPercent = (passedCount * 100) / len(nodes)
		}

		// 4. Ключевые навыки с hh.ru
		var hhSkills []string
		err = db.Select(&hhSkills, `SELECT skill_name FROM hh_key_skills WHERE roadmap_id = $1 ORDER BY frequency DESC`, roadmapID)
		if err != nil {
			log.Printf("Ошибка SQL (hh_key_skills): %v\n", err)
		}
		if hhSkills == nil {
			hhSkills = []string{}
		}
		details.HHKeySkills = hhSkills

		// 5. Связанные направления и логическое продолжение
		var relations []RelatedRoadmap
		err = db.Select(&relations, `
			SELECT r.id, r.title, rr.relation_type
			FROM roadmap_relations rr
			JOIN roadmaps r ON rr.related_roadmap_id = r.id
			WHERE rr.roadmap_id = $1
		`, roadmapID)
		if err != nil {
			log.Printf("Ошибка SQL (roadmap_relations): %v\n", err)
		}
		details.RelatedRoadmaps = []RelatedRoadmap{}
		details.NextStepRoadmaps = []RelatedRoadmap{}
		for _, rel := range relations {
			if rel.RelationType == "next_step" {
				details.NextStepRoadmaps = append(details.NextStepRoadmaps, rel)
			} else {
				details.RelatedRoadmaps = append(details.RelatedRoadmaps, rel)
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(details)
	}
}

// HandleAddFavorite — добавить карту в закладки
func HandleAddFavorite(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		roadmapID, err := strconv.ParseInt(chi.URLParam(r, "roadmapID"), 10, 64)
		if err != nil {
			writeJSONError(w, "Неверный ID карты", http.StatusBadRequest)
			return
		}
		userID := getCurrentUserID(r)

		_, err = db.Exec(`
			INSERT INTO user_favorite_roadmaps (user_id, roadmap_id)
			VALUES ($1, $2)
			ON CONFLICT (user_id, roadmap_id) DO NOTHING
		`, userID, roadmapID)
		if err != nil {
			log.Printf("Ошибка SQL (HandleAddFavorite): %v\n", err)
			writeJSONError(w, "Не удалось добавить карту в закладки", http.StatusInternalServerError)
			return
		}

		unlocked := CheckFavoriteAchievements(db, userID)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]any{
			"status":                      "success",
			"newly_unlocked_achievements": unlocked,
		})
	}
}

// HandleRemoveFavorite — удалить карту из закладок
func HandleRemoveFavorite(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		roadmapID, err := strconv.ParseInt(chi.URLParam(r, "roadmapID"), 10, 64)
		if err != nil {
			http.Error(w, `{"error": "Неверный ID карты"}`, http.StatusBadRequest)
			return
		}
		userID := getCurrentUserID(r)

		_, err = db.Exec(`DELETE FROM user_favorite_roadmaps WHERE user_id = $1 AND roadmap_id = $2`, userID, roadmapID)
		if err != nil {
			log.Printf("Ошибка SQL (HandleRemoveFavorite): %v\n", err)
			http.Error(w, `{"error": "Не удалось удалить карту из закладок"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	}
}
