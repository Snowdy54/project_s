package app

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jmoiron/sqlx"
)

const achievementCongratsMsg = "Поздравляем! Вы получили достижение!"

// UnlockedAchievement — формат для неблокирующего уведомления на фронтенде
type UnlockedAchievement struct {
	Message     string `json:"message"`
	Code        string `db:"code" json:"code"`
	Title       string `db:"title" json:"title"`
	Description string `db:"description" json:"description"`
	Icon        string `db:"icon" json:"icon"`
	Points      int    `db:"points" json:"points"`
	Type        string `db:"type" json:"type"` // unique | repeatable
}

// EarnedAchievementItem — карточка полученного достижения в ЛК
type EarnedAchievementItem struct {
	ID          int64  `json:"id"`
	Code        string `json:"code"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
	Points      int    `json:"points"`
	Type        string `json:"type"`
	Count       int    `json:"count"`
	TotalPoints int    `json:"total_points"`
}

// AchievementCatalogItem — карточка в общем списке достижений в ЛК
type AchievementCatalogItem struct {
	ID          int64  `db:"id" json:"id"`
	Code        string `db:"code" json:"code"`
	Title       string `db:"title" json:"title"`
	Description string `db:"description" json:"description"`
	Icon        string `db:"icon" json:"icon"`
	Points      int    `db:"points" json:"points"`
	Type        string `db:"type" json:"type"`
	EarnedCount int    `db:"earned_count" json:"earned_count"`
}

// UserAchievementsResponse — ответ для раздела «Достижения» в ЛК
type UserAchievementsResponse struct {
	TotalPoints     int                      `json:"total_points"`
	Earned          []EarnedAchievementItem  `json:"earned"`
	Unearned        []AchievementCatalogItem `json:"unearned"`
	AllAchievements []AchievementCatalogItem `json:"all_achievements"`
}

// grantAchievementWithRetry начисляет достижение с защитой от дублей и 3 попытками при ошибке БД
func grantAchievementWithRetry(db *sqlx.DB, userID int64, code, sourceKey string) (*UnlockedAchievement, error) {
	if userID <= 0 {
		return nil, nil // Гости не получают достижения
	}

	var lastErr error
	for attempt := 1; attempt <= 3; attempt++ {
		var unlocked UnlockedAchievement
		err := db.Get(&unlocked, `
			WITH ins AS (
				INSERT INTO user_achievements (user_id, achievement_id, source_key)
				SELECT $1, id, $3
				FROM achievements
				WHERE code = $2
				ON CONFLICT (user_id, achievement_id, source_key) DO NOTHING
				RETURNING achievement_id
			)
			SELECT a.code, a.title, a.description, a.icon, a.points, a.type
			FROM ins
			JOIN achievements a ON a.id = ins.achievement_id
		`, userID, code, sourceKey)

		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil // Уже получено ранее для этого источника
		}
		if err == nil {
			unlocked.Message = achievementCongratsMsg
			return &unlocked, nil
		}

		lastErr = err
		log.Printf("Ошибка начисления достижения %s (user=%d, попытка %d/3): %v\n", code, userID, attempt, err)
		time.Sleep(time.Duration(attempt) * 150 * time.Millisecond)
	}

	return nil, lastErr
}

func appendIfAwarded(db *sqlx.DB, list *[]UnlockedAchievement, userID int64, code, sourceKey string) {
	item, err := grantAchievementWithRetry(db, userID, code, sourceKey)
	if err != nil {
		log.Printf("Не удалось начислить достижение %s после ретраев: %v\n", code, err)
		return
	}
	if item != nil {
		*list = append(*list, *item)
	}
}

// CheckProgressAchievements проверяет все ачивки, связанные со статусом узлов и % прогресса карты
func CheckProgressAchievements(db *sqlx.DB, userID, roadmapID int64, startedAction bool) []UnlockedAchievement {
	unlocked := []UnlockedAchievement{}
	if userID <= 0 || roadmapID <= 0 {
		return unlocked
	}

	sourceKey := fmt.Sprintf("roadmap:%d", roadmapID)

	// 1. Многоразовое «Начало пути» — первое изменение статуса узла в новой карте
	if startedAction {
		appendIfAwarded(db, &unlocked, userID, "journey_start", sourceKey)
	}

	// 2. Считаем текущий процент прохождения карты (completed + skipped)
	var stats struct {
		Total  int `db:"total"`
		Passed int `db:"passed"`
	}
	err := db.Get(&stats, `
		SELECT
			COUNT(DISTINCT s.id)::int AS total,
			COUNT(DISTINCT CASE WHEN usp.status IN ('completed', 'skipped') THEN s.id END)::int AS passed
		FROM skills s
		LEFT JOIN users_skill_progress usp ON usp.skill_id = s.id AND usp.user_id = $1
		WHERE s.roadmap_id = $2
	`, userID, roadmapID)
	if err != nil || stats.Total == 0 {
		if err != nil {
			log.Printf("Ошибка расчёта прогресса для ачивок (roadmap=%d): %v\n", roadmapID, err)
		}
		return unlocked
	}

	// Считаем также суммарное количество пройденных этапов по всем картам пользователя
	var totalPassedAll int
	if err := db.Get(&totalPassedAll, `
		SELECT COUNT(DISTINCT skill_id)::int
		FROM users_skill_progress
		WHERE user_id = $1 AND status IN ('completed', 'skipped')
	`, userID); err != nil {
		log.Printf("Ошибка расчёта суммарных этапов для ачивок (user=%d): %v\n", userID, err)
	}

	progressPercent := (stats.Passed * 100) / stats.Total

	// 3. Порог 50% карты ИЛИ суммарные этапы (5 / 10 этапов по всем картам)
	if progressPercent >= 50 || totalPassedAll >= 5 {
		appendIfAwarded(db, &unlocked, userID, "tip_of_iceberg", "global")
	}
	if progressPercent >= 50 || totalPassedAll >= 10 {
		appendIfAwarded(db, &unlocked, userID, "halfway_there", sourceKey)
	}

	// 4. Порог 100% карты ИЛИ суммарно >= 15 / 24 этапов
	if progressPercent == 100 || totalPassedAll >= 15 {
		appendIfAwarded(db, &unlocked, userID, "first_peak", "global")
	}
	if progressPercent == 100 || totalPassedAll >= 24 {
		appendIfAwarded(db, &unlocked, userID, "mastered_skill", sourceKey)
	}

	if progressPercent == 100 {

		var directionTags []string
		err := db.Select(&directionTags, `
			SELECT LOWER(rt.name)
			FROM roadmap_tag_links rtl
			JOIN roadmap_tags rt ON rt.id = rtl.tag_id
			WHERE rtl.roadmap_id = $1
		`, roadmapID)
		if err != nil {
			log.Printf("Ошибка чтения тегов карты %d для ачивок: %v\n", roadmapID, err)
			return unlocked
		}

		for _, tag := range directionTags {
			switch tag {
			case "backend":
				appendIfAwarded(db, &unlocked, userID, "junior_backend", "global")
			case "frontend":
				appendIfAwarded(db, &unlocked, userID, "junior_frontend", "global")
			case "devops":
				appendIfAwarded(db, &unlocked, userID, "junior_devops", "global")
			}
		}

		// Комбо-ачивки проверяем по уже выданным профильным достижениям (сброс карты не мешает комбо)
		var earnedDirs []string
		err = db.Select(&earnedDirs, `
			SELECT DISTINCT a.code
			FROM user_achievements ua
			JOIN achievements a ON a.id = ua.achievement_id
			WHERE ua.user_id = $1
			  AND a.code IN ('junior_backend', 'junior_frontend', 'junior_devops')
		`, userID)
		if err == nil {
			hasDir := make(map[string]bool, len(earnedDirs))
			for _, c := range earnedDirs {
				hasDir[c] = true
			}
			if hasDir["junior_backend"] && hasDir["junior_frontend"] {
				appendIfAwarded(db, &unlocked, userID, "fullstack", "global")
			}
			if hasDir["junior_backend"] && hasDir["junior_frontend"] && hasDir["junior_devops"] {
				appendIfAwarded(db, &unlocked, userID, "jack_of_all_trades", "global")
			}
		}
	}

	return unlocked
}

// CheckFavoriteAchievements проверяет ачивку «Это мне надо» при добавлении карты в избранное
func CheckFavoriteAchievements(db *sqlx.DB, userID int64) []UnlockedAchievement {
	unlocked := []UnlockedAchievement{}
	appendIfAwarded(db, &unlocked, userID, "i_need_this", "global")
	return unlocked
}

// HandleVisitPracticeBase фиксирует переход на страницу базы практик и начисляет «Практик»
func HandleVisitPracticeBase(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		roadmapID, err := strconv.ParseInt(chi.URLParam(r, "roadmapID"), 10, 64)
		if err != nil {
			writeJSONError(w, "Неверный ID карты", http.StatusBadRequest)
			return
		}
		userID := getCurrentUserID(r)

		unlocked := []UnlockedAchievement{}
		appendIfAwarded(db, &unlocked, userID, "practitioner", "global")

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]any{
			"status":                      "success",
			"roadmap_id":                  roadmapID,
			"newly_unlocked_achievements": unlocked,
		})
	}
}

// HandleGetUserAchievements отдаёт раздел «Достижения» для Личного кабинета
func HandleGetUserAchievements(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := getCurrentUserID(r)

		var all []AchievementCatalogItem
		err := db.Select(&all, `
			SELECT
				a.id,
				a.code,
				a.title,
				a.description,
				a.icon,
				a.points,
				a.type,
				COUNT(ua.id)::int AS earned_count
			FROM achievements a
			LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = $1
			GROUP BY a.id
			ORDER BY a.id
		`, userID)
		if err != nil {
			log.Printf("Ошибка SQL (HandleGetUserAchievements): %v\n", err)
			writeJSONError(w, "Не удалось загрузить достижения.", http.StatusInternalServerError)
			return
		}
		if all == nil {
			all = []AchievementCatalogItem{}
		}

		earned := []EarnedAchievementItem{}
		unearned := []AchievementCatalogItem{}
		totalPoints := 0

		for _, item := range all {
			if item.EarnedCount > 0 {
				itemTotal := item.Points * item.EarnedCount
				totalPoints += itemTotal
				earned = append(earned, EarnedAchievementItem{
					ID:          item.ID,
					Code:        item.Code,
					Title:       item.Title,
					Description: item.Description,
					Icon:        item.Icon,
					Points:      item.Points,
					Type:        item.Type,
					Count:       item.EarnedCount,
					TotalPoints: itemTotal,
				})
			} else {
				unearned = append(unearned, item)
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(UserAchievementsResponse{
			TotalPoints:     totalPoints,
			Earned:          earned,
			Unearned:        unearned,
			AllAchievements: all,
		})
	}
}
