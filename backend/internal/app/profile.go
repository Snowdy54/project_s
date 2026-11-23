package app

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

type UserProfile struct {
	ID          int64  `db:"id" json:"id"`
	Nickname    string `db:"nickname" json:"nickname"`
	Email       string `db:"email" json:"email"`
	Phone       string `db:"phone" json:"phone"`
	GitHubURL   string `db:"github_url" json:"github_url"`
	VKURL       string `db:"vk_url" json:"vk_url"`
	TelegramURL string `db:"telegram_url" json:"telegram_url"`
	WebsiteURL  string `db:"website_url" json:"website_url"`
}

type ActivityRoadmap struct {
	ID              int64  `db:"id" json:"id"`
	Title           string `db:"title" json:"title"`
	ProgressPercent int    `db:"progress_percent" json:"progress_percent"`
}

type ProfilePageResponse struct {
	Profile          UserProfile       `json:"profile"`
	StartedRoadmaps  []ActivityRoadmap `json:"started_roadmaps"`
	FavoriteRoadmaps []ActivityRoadmap `json:"favorite_roadmaps"`
}

// HandleGetProfile — отдаёт профиль и блок «Активность» (начатые и избранные карты)
func HandleGetProfile(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := getCurrentUserID(r)

		var profile UserProfile
		err := db.Get(&profile, `
			SELECT id, nickname,
			       COALESCE(email, '') AS email,
			       COALESCE(phone, '') AS phone,
			       github_url, vk_url, telegram_url, website_url
			FROM users
			WHERE id = $1
		`, userID)
		if errors.Is(err, sql.ErrNoRows) {
			writeJSONError(w, "Пользователь не найден", http.StatusNotFound)
			return
		}
		if err != nil {
			log.Printf("Ошибка SQL (HandleGetProfile): %v\n", err)
			writeJSONError(w, "Не удалось загрузить личный кабинет.", http.StatusInternalServerError)
			return
		}

		// Начатые карты (хотя бы один узел со статусом, отличным от not_started)
		var started []ActivityRoadmap
		err = db.Select(&started, `
			SELECT
				r.id,
				r.title,
				COALESCE(
					(COUNT(DISTINCT CASE WHEN usp.status IN ('completed', 'skipped') THEN s.id END) * 100)
					/ NULLIF(COUNT(DISTINCT s.id), 0),
					0
				) AS progress_percent
			FROM roadmaps r
			LEFT JOIN skills s ON s.roadmap_id = r.id
			LEFT JOIN users_skill_progress usp ON usp.skill_id = s.id AND usp.user_id = $1
			WHERE EXISTS (
				SELECT 1 FROM users_skill_progress usp2
				JOIN skills s2 ON usp2.skill_id = s2.id
				WHERE usp2.user_id = $1 AND s2.roadmap_id = r.id AND usp2.status != 'not_started'
			)
			GROUP BY r.id, r.title
			ORDER BY r.id
		`, userID)
		if err != nil {
			log.Printf("Ошибка SQL (started_roadmaps): %v\n", err)
			writeJSONError(w, "Не удалось загрузить личный кабинет.", http.StatusInternalServerError)
			return
		}
		if started == nil {
			started = []ActivityRoadmap{}
		}

		// Избранные карты с процентом прогресса
		var favorites []ActivityRoadmap
		err = db.Select(&favorites, `
			SELECT
				r.id,
				r.title,
				COALESCE(
					(COUNT(DISTINCT CASE WHEN usp.status IN ('completed', 'skipped') THEN s.id END) * 100)
					/ NULLIF(COUNT(DISTINCT s.id), 0),
					0
				) AS progress_percent
			FROM user_favorite_roadmaps ufr
			JOIN roadmaps r ON r.id = ufr.roadmap_id
			LEFT JOIN skills s ON s.roadmap_id = r.id
			LEFT JOIN users_skill_progress usp ON usp.skill_id = s.id AND usp.user_id = $1
			WHERE ufr.user_id = $1
			GROUP BY r.id, r.title
			ORDER BY r.id
		`, userID)
		if err != nil {
			log.Printf("Ошибка SQL (favorite_roadmaps): %v\n", err)
			writeJSONError(w, "Не удалось загрузить личный кабинет.", http.StatusInternalServerError)
			return
		}
		if favorites == nil {
			favorites = []ActivityRoadmap{}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(ProfilePageResponse{
			Profile:          profile,
			StartedRoadmaps:  started,
			FavoriteRoadmaps: favorites,
		})
	}
}

type UpdateProfileRequest struct {
	Nickname    string `json:"nickname"`
	Email       string `json:"email"`
	Phone       string `json:"phone"`
	GitHubURL   string `json:"github_url"`
	VKURL       string `json:"vk_url"`
	TelegramURL string `json:"telegram_url"`
	WebsiteURL  string `json:"website_url"`
}

// HandleUpdateProfile — обновление контактов и ссылок профиля
func HandleUpdateProfile(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := getCurrentUserID(r)

		var req UpdateProfileRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeJSONError(w, "Неверный формат запроса", http.StatusBadRequest)
			return
		}

		req.Nickname = strings.TrimSpace(req.Nickname)
		if err := validateNickname(req.Nickname); err != nil {
			writeJSONError(w, err.Error(), http.StatusBadRequest)
			return
		}

		emailStr := strings.TrimSpace(strings.ToLower(req.Email))
		phoneStr := strings.TrimSpace(req.Phone)

		if emailStr == "" && phoneStr == "" {
			writeJSONError(w, "Должно быть заполнено как минимум одно поле: Email или Телефон", http.StatusBadRequest)
			return
		}

		var emailPtr, phonePtr *string
		if emailStr != "" {
			if !isValidEmail(emailStr) {
				writeJSONError(w, "Некорректный формат email", http.StatusBadRequest)
				return
			}
			emailPtr = &emailStr
		}
		if phoneStr != "" {
			if !isValidPhone(phoneStr) {
				writeJSONError(w, "Некорректный формат телефона", http.StatusBadRequest)
				return
			}
			phonePtr = &phoneStr
		}

		_, err := db.Exec(`
			UPDATE users
			SET nickname = $1, email = $2, phone = $3,
			    github_url = $4, vk_url = $5, telegram_url = $6, website_url = $7
			WHERE id = $8
		`, req.Nickname, emailPtr, phonePtr,
			strings.TrimSpace(req.GitHubURL),
			strings.TrimSpace(req.VKURL),
			strings.TrimSpace(req.TelegramURL),
			strings.TrimSpace(req.WebsiteURL),
			userID,
		)
		if err != nil {
			var pqErr *pq.Error
			if errors.As(err, &pqErr) && pqErr.Code == "23505" {
				writeJSONError(w, "Пользователь с таким email или телефоном уже существует", http.StatusConflict)
				return
			}
			log.Printf("Ошибка SQL (HandleUpdateProfile): %v\n", err)
			writeJSONError(w, "Не удалось сохранить изменения. Попробуйте снова.", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "success",
			"message": "Изменения успешно сохранены",
		})
	}
}

type DeleteProfileRequest struct {
	Confirmation string `json:"confirmation"`
}

// HandleDeleteProfile — удаление профиля при точном вводе слова "Удалить"
func HandleDeleteProfile(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := getCurrentUserID(r)

		var req DeleteProfileRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeJSONError(w, "Неверный ввод. Удаление аккаунта прервано.", http.StatusBadRequest)
			return
		}

		if strings.TrimSpace(req.Confirmation) != "Удалить" {
			writeJSONError(w, "Неверный ввод. Удаление аккаунта прервано.", http.StatusBadRequest)
			return
		}

		_, err := db.Exec(`DELETE FROM users WHERE id = $1`, userID)
		if err != nil {
			log.Printf("Ошибка SQL (HandleDeleteProfile): %v\n", err)
			writeJSONError(w, "Не удалось удалить профиль из-за ошибки на сервере. Попробуйте позже.", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "success",
			"message": "Профиль успешно удален",
		})
	}
}
