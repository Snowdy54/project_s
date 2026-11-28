package app

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

type GapQuestion struct {
	ID           int64  `db:"id" json:"id"`
	QuestionText string `db:"question_text" json:"question_text"`
	OrderNum     int    `db:"order_num" json:"order_num"`
}

type GapSurveyResponse struct {
	RoadmapID      int64         `json:"roadmap_id"`
	TotalQuestions int           `json:"total_questions"`
	Questions      []GapQuestion `json:"questions"`
}

type GapAnswerInput struct {
	QuestionID int64  `json:"question_id"`
	Answer     string `json:"answer"` // "know", "repeat", "dont_know"
}

type GapSurveySubmitRequest struct {
	Answers []GapAnswerInput `json:"answers"`
}

type SkillStatusChange struct {
	SkillID   int64  `json:"skill_id"`
	SkillName string `json:"skill_name"`
	OldStatus string `json:"old_status"`
	NewStatus string `json:"new_status"`
}

type GapEvaluationResult struct {
	Level                     string                `json:"level"`              // Начинающий, Продвинутый, Углублённый
	ProjectedProgress         int                   `json:"projected_progress"` // Процент выполнения после применения
	KnowCount                 int                   `json:"know_count"`
	RepeatCount               int                   `json:"repeat_count"`
	DontKnowCount             int                   `json:"dont_know_count"`
	Changes                   []SkillStatusChange   `json:"changes"`
	NewlyUnlockedAchievements []UnlockedAchievement `json:"newly_unlocked_achievements"`
}

var (
	errSurveyNotFound = errors.New("Для данной карты пока отсутствует персонализация. Попробуйте ещё раз позже!")
	errInvalidAnswers = errors.New("необходимо ответить на все вопросы теста допустимыми вариантами")
)

// HandleGetGapSurvey — отдаёт вопросы опроса и их количество для выбранной карты
func HandleGetGapSurvey(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		roadmapID, err := strconv.ParseInt(chi.URLParam(r, "roadmapID"), 10, 64)
		if err != nil {
			writeJSONError(w, "Неверный ID карты", http.StatusBadRequest)
			return
		}

		var questions []GapQuestion
		err = db.Select(&questions, `
			SELECT id, question_text, order_num
			FROM gap_questions
			WHERE roadmap_id = $1
			ORDER BY order_num, id
		`, roadmapID)
		if err != nil {
			log.Printf("Ошибка SQL (HandleGetGapSurvey): %v\n", err)
			writeJSONError(w, "Не удалось загрузить опрос. Проверьте соединение", http.StatusInternalServerError)
			return
		}

		if len(questions) == 0 {
			writeJSONError(w, errSurveyNotFound.Error(), http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(GapSurveyResponse{
			RoadmapID:      roadmapID,
			TotalQuestions: len(questions),
			Questions:      questions,
		})
	}
}

// calculateGapResult считает итоги опроса и список изменений узлов без записи в БД
func calculateGapResult(db *sqlx.DB, userID, roadmapID int64, answers []GapAnswerInput) (*GapEvaluationResult, error) {
	// 1. Загружаем вопросы и их привязку к тегам
	var questionRows []struct {
		QuestionID int64         `db:"id"`
		TagIDs     pq.Int64Array `db:"tag_ids"`
	}
	err := db.Select(&questionRows, `
		SELECT
			gq.id,
			COALESCE(ARRAY_AGG(DISTINCT gqt.tag_id) FILTER (WHERE gqt.tag_id IS NOT NULL), '{}'::bigint[]) AS tag_ids
		FROM gap_questions gq
		LEFT JOIN gap_question_tags gqt ON gq.id = gqt.question_id
		WHERE gq.roadmap_id = $1
		GROUP BY gq.id
	`, roadmapID)
	if err != nil {
		return nil, err
	}
	if len(questionRows) == 0 {
		return nil, errSurveyNotFound
	}

	// 2. Валидируем ответы пользователя (пропускать вопросы нельзя)
	answerByQuestion := make(map[int64]string, len(answers))
	for _, a := range answers {
		switch a.Answer {
		case "know", "repeat", "dont_know":
			answerByQuestion[a.QuestionID] = a.Answer
		default:
			return nil, errInvalidAnswers
		}
	}

	res := &GapEvaluationResult{
		Changes:                   []SkillStatusChange{},
		NewlyUnlockedAchievements: []UnlockedAchievement{},
	}

	// Приоритет ответов на тег, если несколько вопросов ссылаются на один тег: слабый ответ перевешивает "know"
	tagAnswer := make(map[int64]string)
	for _, q := range questionRows {
		ans, ok := answerByQuestion[q.QuestionID]
		if !ok {
			return nil, errInvalidAnswers
		}

		switch ans {
		case "know":
			res.KnowCount++
		case "repeat":
			res.RepeatCount++
		case "dont_know":
			res.DontKnowCount++
		}

		for _, tagID := range q.TagIDs {
			prev, exists := tagAnswer[tagID]
			if !exists || prev == "know" {
				tagAnswer[tagID] = ans
			}
		}
	}

	// 3. Загружаем все узлы карты, их текущие статусы у пользователя и их теги
	var skillRows []struct {
		ID            int64         `db:"id"`
		Name          string        `db:"name"`
		CurrentStatus string        `db:"current_status"`
		TagIDs        pq.Int64Array `db:"tag_ids"`
	}
	err = db.Select(&skillRows, `
		SELECT
			s.id,
			s.name,
			COALESCE(usp.status, 'not_started') AS current_status,
			COALESCE(ARRAY_AGG(DISTINCT stl.tag_id) FILTER (WHERE stl.tag_id IS NOT NULL), '{}'::bigint[]) AS tag_ids
		FROM skills s
		LEFT JOIN users_skill_progress usp ON s.id = usp.skill_id AND usp.user_id = $1
		LEFT JOIN skill_tag_links stl ON s.id = stl.skill_id
		WHERE s.roadmap_id = $2
		GROUP BY s.id, s.name, usp.status
		ORDER BY s.id
	`, userID, roadmapID)
	if err != nil {
		return nil, err
	}

	// 4. Вычисляем новые статусы по правилам ЧТЗ
	passedCount := 0
	for _, s := range skillRows {
		newStatus := s.CurrentStatus
		totalTags := len(s.TagIDs)

		if totalTags > 0 {
			knowTags := 0
			weakTags := 0 // "repeat" или "dont_know"

			for _, tagID := range s.TagIDs {
				switch tagAnswer[tagID] {
				case "know":
					knowTags++
				case "repeat", "dont_know":
					weakTags++
				}
			}

			if knowTags == totalTags {
				if s.CurrentStatus != "completed" {
					newStatus = "completed"
				}
			} else if weakTags*100 > totalTags*70 {
				if s.CurrentStatus != "not_started" {
					newStatus = "not_started"
				}
			}
		}

		if newStatus != s.CurrentStatus {
			res.Changes = append(res.Changes, SkillStatusChange{
				SkillID:   s.ID,
				SkillName: s.Name,
				OldStatus: s.CurrentStatus,
				NewStatus: newStatus,
			})
		}

		if newStatus == "completed" || newStatus == "skipped" {
			passedCount++
		}
	}

	// 5. Считаем итоговый процент прогресса и уровень пользователя
	if len(skillRows) > 0 {
		res.ProjectedProgress = (passedCount * 100) / len(skillRows)
	}

	switch {
	case res.ProjectedProgress >= 80:
		res.Level = "Углублённый"
	case res.ProjectedProgress >= 45:
		res.Level = "Продвинутый"
	default:
		res.Level = "Начинающий"
	}

	return res, nil
}

// HandlePreviewGapSurvey — рассчитывает результаты опроса для экрана итогов (БД не меняется)
func HandlePreviewGapSurvey(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		roadmapID, err := strconv.ParseInt(chi.URLParam(r, "roadmapID"), 10, 64)
		if err != nil {
			writeJSONError(w, "Неверный ID карты", http.StatusBadRequest)
			return
		}
		userID := getCurrentUserID(r)

		var req GapSurveySubmitRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeJSONError(w, "Неверный формат запроса", http.StatusBadRequest)
			return
		}

		result, err := calculateGapResult(db, userID, roadmapID, req.Answers)
		if errors.Is(err, errSurveyNotFound) {
			writeJSONError(w, err.Error(), http.StatusNotFound)
			return
		}
		if errors.Is(err, errInvalidAnswers) {
			writeJSONError(w, err.Error(), http.StatusBadRequest)
			return
		}
		if err != nil {
			log.Printf("Ошибка расчёта Gap Analysis (preview): %v\n", err)
			writeJSONError(w, "Не удалось обработать результаты опроса. Попробуйте снова", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(result)
	}
}

// HandleApplyGapSurvey — применяет результаты опроса к карте в транзакции ("Принять и перейти к карте")
func HandleApplyGapSurvey(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		roadmapID, err := strconv.ParseInt(chi.URLParam(r, "roadmapID"), 10, 64)
		if err != nil {
			writeJSONError(w, "Неверный ID карты", http.StatusBadRequest)
			return
		}
		userID := getCurrentUserID(r)

		var req GapSurveySubmitRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeJSONError(w, "Неверный формат запроса", http.StatusBadRequest)
			return
		}

		result, err := calculateGapResult(db, userID, roadmapID, req.Answers)
		if errors.Is(err, errSurveyNotFound) {
			writeJSONError(w, err.Error(), http.StatusNotFound)
			return
		}
		if errors.Is(err, errInvalidAnswers) {
			writeJSONError(w, err.Error(), http.StatusBadRequest)
			return
		}
		if err != nil {
			log.Printf("Ошибка расчёта Gap Analysis (apply): %v\n", err)
			writeJSONError(w, "Не удалось сохранить результаты. Попробуйте снова", http.StatusInternalServerError)
			return
		}

		tx, err := db.Beginx()
		if err != nil {
			log.Printf("Ошибка открытия транзакции (apply): %v\n", err)
			writeJSONError(w, "Не удалось сохранить результаты. Попробуйте снова", http.StatusInternalServerError)
			return
		}
		defer tx.Rollback()

		for _, ch := range result.Changes {
			_, err = tx.Exec(`
				INSERT INTO users_skill_progress (user_id, skill_id, status, updated_at)
				VALUES ($1, $2, $3, NOW())
				ON CONFLICT (user_id, skill_id)
				DO UPDATE SET status = EXCLUDED.status, updated_at = NOW()
			`, userID, ch.SkillID, ch.NewStatus)
			if err != nil {
				log.Printf("Ошибка записи статуса в транзакции (skill_id=%d): %v\n", ch.SkillID, err)
				writeJSONError(w, "Не удалось сохранить результаты. Попробуйте снова", http.StatusInternalServerError)
				return
			}
		}

		if err := tx.Commit(); err != nil {
			log.Printf("Ошибка коммита транзакции (apply): %v\n", err)
			writeJSONError(w, "Не удалось сохранить результаты. Попробуйте снова", http.StatusInternalServerError)
			return
		}

		// Проверяем достижения, если опрос изменил статусы узлов
		if len(result.Changes) > 0 {
			hasStarted := false
			for _, ch := range result.Changes {
				if ch.NewStatus != "not_started" {
					hasStarted = true
					break
				}
			}
			result.NewlyUnlockedAchievements = CheckProgressAchievements(db, userID, roadmapID, hasStarted)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(result)
	}
}
