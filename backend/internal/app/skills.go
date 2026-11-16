package app

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq" // <- Импортируем драйвер сюда, чтобы использовать pq.Int64Array
)

type User struct {
	Id       int64  `db:"id"`
	Email    string `db:"email"`
	Password string `db:"password"`
	Nickname string `db:"nickname"`
}

type Skill struct {
	Id        int64  `db:"id"`
	SkillName string `db:"skill_name"`
}

type Profession struct {
	Id             int64  `db:"id"`
	ProfessionName string `db:"profession_name"`
}

type SkillDependency struct {
	SkillId          int64 `db:"skill"`
	DependingSkillId int64 `db:"depending_skill"`
}

type ProfessionSkill struct {
	SkillId      int64 `db:"skill"`
	ProfessionId int64 `db:"profession"`
}

type UserSkillProgress struct {
	UserId  int64  `db:"user"`
	SkillId int64  `db:"skill"`
	Status  string `db:"status"`
}

type GraphNode struct {
	SkillId            int64  `db:"skill_id" json:"skill_id"`
	SkillName          string `db:"skill_name" json:"skill_name"`
	AiResponceForSkill string `db:"ai_responce_for_skill" json:"ai_responce_for_skill"`
	Status             string `db:"status" json:"status"`
	// Используем pq.Int64Array вместо []int64 для правильного маппинга массива из Postgres
	SkillDependens pq.Int64Array `db:"skill_dependens" json:"skill_dependens"`
}

// GetUserGraph делает запрос в базу и собирает узлы графа
func GetUserGraph(db *sqlx.DB, userId int64) ([]GraphNode, error) {
	query := `
		SELECT
			s.id AS skill_id,
			s.name AS skill_name,
			usp.status AS status,
			COALESCE(ARRAY_AGG(sd.depends_on_skill_id) FILTER (WHERE sd.depends_on_skill_id IS NOT NULL), '{}') AS skill_dependens
		FROM skills s
		JOIN users_skill_progress usp ON s.id = usp.skill_id
		LEFT JOIN skills_dependencies sd ON s.id = sd.skill_id
		WHERE usp.user_id = $1
		GROUP BY s.id, s.name, usp.status;
	`

	var graphNodes []GraphNode

	err := db.Select(&graphNodes, query, userId)
	if err != nil {
		// Теперь реальная ошибка будет писаться в терминал
		log.Println("Ошибка SQL внутри GetUserGraph:", err)
		return nil, err
	}

	return graphNodes, nil
}

// HandleGetGraph — HTTP-хэндлер для отдачи графа на фронтенд
func HandleGetGraph(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userIDStr := chi.URLParam(r, "userID")

		var userID int64 = 1
		if userIDStr != "" {
			parsed, err := strconv.ParseInt(userIDStr, 10, 64)
			if err == nil {
				userID = parsed
			}
		}

		nodes, err := GetUserGraph(db, userID)
		if err != nil {
			http.Error(w, "Failed to fetch graph from database", http.StatusInternalServerError)
			return
		}

		if nodes == nil {
			nodes = []GraphNode{}
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		if err := json.NewEncoder(w).Encode(nodes); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}

// Структура того, что фронтенд пришлет нам в теле POST-запроса
type OnboardingRequest struct {
	UserInput string `json:"user_input"`
}

// HandleOnboarding — обрабатывает результаты стартового теста пользователя
func HandleOnboarding(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 1. Читаем JSON из тела запроса
		var req OnboardingRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Неверный формат запроса", http.StatusBadRequest)
			return
		}

		// Хардкодим пользователя для тестов
		var userID int64 = 1

		// 2. Обращение к ИИ (gRPC)
		// В реальном коде здесь будет: aiClient.ParseSkills(ctx, &proto.ParseRequest{Text: req.UserInput})
		// Пока симулируем, что ИИ проанализировал текст и решил добавить навык "PostgreSQL" (ID: 30)
		aiSuggestedSkillIDs := []int64{30}

		log.Printf("Пользователь написал: '%s'. ИИ предложил навыки: %v\n", req.UserInput, aiSuggestedSkillIDs)

		// 3. Сохраняем новые навыки в таблицу прогресса пользователя
		for _, skillID := range aiSuggestedSkillIDs {
			// Простой INSERT. В продакшене тут стоит добавить ON CONFLICT для защиты от дубликатов
			query := `INSERT INTO users_skill_progress (user_id, skill_id, status) VALUES ($1, $2, 'В процессе')`
			_, err := db.Exec(query, userID, skillID)
			if err != nil {
				log.Println("Ошибка добавления навыка в БД:", err)
				// Не прерываем цикл, пытаемся добавить остальные
			}
		}

		// 4. Отдаем успешный ответ фронтенду
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "success", "message": "Профиль успешно обновлен"}`))
	}
}
