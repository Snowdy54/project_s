package app

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jmoiron/sqlx"
)

const (
	hhUserAgent     = "SkillMap/1.0 (dev@skillmap.ru)"
	hhErrorMessage  = "Не удалось получить ответ от hh.ru"
	hhMaxDailyTries = 3
	hhRetryDelay    = 5 * time.Minute
	hhWeeklyPeriod  = 7 * 24 * time.Hour
	hhCycleTimeout  = 30 * time.Minute
)

type hhSearchResponse struct {
	Items []struct {
		ID string `json:"id"`
	} `json:"items"`
}

type hhVacancyDetail struct {
	KeySkills []struct {
		Name string `json:"name"`
	} `json:"key_skills"`
}

type skillFreq struct {
	Name  string
	Count int
}

type roadmapSyncRow struct {
	ID            int64        `db:"id"`
	HHSearchQuery string       `db:"hh_search_query"`
	HHRetryCount  int          `db:"hh_retry_count"`
	HHUpdatedAt   sql.NullTime `db:"hh_updated_at"`
}

func doHHGet(ctx context.Context, client *http.Client, endpoint string, target any) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return err
	}
	req.Header.Set("User-Agent", hhUserAgent)
	req.Header.Set("HH-User-Agent", hhUserAgent)
	req.Header.Set("Accept", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(io.LimitReader(resp.Body, 512))
		return fmt.Errorf("hh.ru вернул статус %d: %s", resp.StatusCode, strings.TrimSpace(string(bodyBytes)))
	}

	return json.NewDecoder(resp.Body).Decode(target)
}

// fetchHHKeySkills получает первые 30 вакансий и строит частотный словарь ключевых навыков
func fetchHHKeySkills(ctx context.Context, searchQuery string) ([]skillFreq, error) {
	if strings.TrimSpace(searchQuery) == "" {
		return nil, errors.New("пустой поисковый запрос для hh.ru")
	}

	client := &http.Client{Timeout: 15 * time.Second}
	searchURL := fmt.Sprintf("https://api.hh.ru/vacancies?text=%s&per_page=30", url.QueryEscape(searchQuery))

	var searchResp hhSearchResponse
	if err := doHHGet(ctx, client, searchURL, &searchResp); err != nil {
		return nil, fmt.Errorf("ошибка поиска вакансий: %w", err)
	}

	if len(searchResp.Items) == 0 {
		return []skillFreq{}, nil
	}

	limit := len(searchResp.Items)
	if limit > 30 {
		limit = 30
	}

	// Считаем частоту без учёта регистра, сохраняя красивое отображаемое название
	counts := make(map[string]int)
	displayName := make(map[string]string)
	successDetails := 0

	for i := 0; i < limit; i++ {
		if ctx.Err() != nil {
			return nil, ctx.Err()
		}

		vacancyURL := fmt.Sprintf("https://api.hh.ru/vacancies/%s", searchResp.Items[i].ID)
		var detail hhVacancyDetail
		if err := doHHGet(ctx, client, vacancyURL, &detail); err != nil {
			log.Printf("hh.ru: не удалось получить вакансию %s: %v\n", searchResp.Items[i].ID, err)
		} else {
			successDetails++
			for _, ks := range detail.KeySkills {
				clean := strings.TrimSpace(ks.Name)
				if clean == "" {
					continue
				}
				key := strings.ToLower(clean)
				counts[key]++
				if _, exists := displayName[key]; !exists {
					displayName[key] = clean
				}
			}
		}

		// Пауза между запросами, чтобы не нарушать лимиты API hh.ru
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		case <-time.After(250 * time.Millisecond):
		}
	}

	if successDetails == 0 {
		return nil, errors.New("не удалось загрузить описания ни одной из 30 вакансий")
	}

	result := make([]skillFreq, 0, len(counts))
	for key, cnt := range counts {
		result = append(result, skillFreq{
			Name:  displayName[key],
			Count: cnt,
		})
	}

	sort.Slice(result, func(i, j int) bool {
		if result[i].Count == result[j].Count {
			return result[i].Name < result[j].Name
		}
		return result[i].Count > result[j].Count
	})

	// Оставляем топ-15 самых частых навыков для отображения на карте
	if len(result) > 15 {
		result = result[:15]
	}

	return result, nil
}

func isSameUTCDay(a, b time.Time) bool {
	y1, m1, d1 := a.UTC().Date()
	y2, m2, d2 := b.UTC().Date()
	return y1 == y2 && m1 == m2 && d1 == d2
}

// SyncRoadmapHHSkills обновляет навыки hh.ru для одной карты с учётом лимита 3 попытки в день
func SyncRoadmapHHSkills(ctx context.Context, db *sqlx.DB, roadmapID int64) ([]string, error) {
	var rm roadmapSyncRow
	err := db.Get(&rm, `
		SELECT id, hh_search_query, hh_retry_count, hh_updated_at
		FROM roadmaps
		WHERE id = $1
	`, roadmapID)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	todayRetries := 0
	if rm.HHUpdatedAt.Valid && isSameUTCDay(rm.HHUpdatedAt.Time, now) {
		todayRetries = rm.HHRetryCount
	}

	if todayRetries >= hhMaxDailyTries {
		return nil, errors.New("достигнут дневной лимит попыток парсинга hh.ru (3 в день)")
	}

	skills, fetchErr := fetchHHKeySkills(ctx, rm.HHSearchQuery)
	if fetchErr != nil {
		newRetries := todayRetries + 1
		_, dbErr := db.Exec(`
			UPDATE roadmaps
			SET hh_last_error = $1, hh_retry_count = $2, hh_updated_at = NOW()
			WHERE id = $3
		`, hhErrorMessage, newRetries, roadmapID)
		if dbErr != nil {
			log.Printf("Ошибка записи hh_last_error для карты %d: %v\n", roadmapID, dbErr)
		}
		return nil, fetchErr
	}

	tx, err := db.Beginx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	if _, err := tx.Exec(`DELETE FROM hh_key_skills WHERE roadmap_id = $1`, roadmapID); err != nil {
		return nil, err
	}

	names := make([]string, 0, len(skills))
	for _, s := range skills {
		_, err := tx.Exec(`
			INSERT INTO hh_key_skills (roadmap_id, skill_name, frequency)
			VALUES ($1, $2, $3)
		`, roadmapID, s.Name, s.Count)
		if err != nil {
			return nil, err
		}
		names = append(names, s.Name)
	}

	_, err = tx.Exec(`
		UPDATE roadmaps
		SET hh_last_error = NULL, hh_retry_count = 0, hh_updated_at = NOW()
		WHERE id = $1
	`, roadmapID)
	if err != nil {
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return names, nil
}

// syncAllRoadmaps обходит все направления с ретраем через 5 минут (до 3 попыток в день)
func syncAllRoadmaps(parentCtx context.Context, db *sqlx.DB) {
	ctx, cancel := context.WithTimeout(parentCtx, hhCycleTimeout)
	defer cancel()

	var roadmaps []roadmapSyncRow
	err := db.Select(&roadmaps, `
		SELECT id, hh_search_query, hh_retry_count, hh_updated_at
		FROM roadmaps
		WHERE hh_search_query != ''
		ORDER BY id
	`)
	if err != nil {
		log.Printf("hh.ru scheduler: ошибка выборки карт: %v\n", err)
		return
	}

	var failedIDs []int64
	for _, rm := range roadmaps {
		// Пропускаем уже свежие карты (обновлялись менее недели назад и без ошибок)
		if rm.HHUpdatedAt.Valid && rm.HHRetryCount == 0 && time.Since(rm.HHUpdatedAt.Time) < hhWeeklyPeriod {
			continue
		}

		names, err := SyncRoadmapHHSkills(ctx, db, rm.ID)
		if err != nil {
			log.Printf("hh.ru scheduler: ошибка парсинга карты %d (%s): %v\n", rm.ID, rm.HHSearchQuery, err)
			failedIDs = append(failedIDs, rm.ID)
		} else {
			log.Printf("hh.ru scheduler: карта %d обновлена, найдено навыков: %d\n", rm.ID, len(names))
		}
	}

	// Ретрай упавших карт через 5 минут (оставшиеся 2 попытки из 3 дневных)
	for attempt := 2; attempt <= hhMaxDailyTries && len(failedIDs) > 0; attempt++ {
		select {
		case <-ctx.Done():
			return
		case <-time.After(hhRetryDelay):
		}

		var nextFailed []int64
		for _, id := range failedIDs {
			names, err := SyncRoadmapHHSkills(ctx, db, id)
			if err != nil {
				log.Printf("hh.ru scheduler: повтор %d для карты %d не удался: %v\n", attempt, id, err)
				nextFailed = append(nextFailed, id)
			} else {
				log.Printf("hh.ru scheduler: карта %d успешно обновлена с попытки %d (%d навыков)\n", id, attempt, len(names))
			}
		}
		failedIDs = nextFailed
	}
}

// StartHHScheduler запускает фоновое еженедельное обновление навыков с hh.ru
func StartHHScheduler(ctx context.Context, db *sqlx.DB) {
	// Первичная проверка при старте, чтобы новые карты сразу получили данные
	go syncAllRoadmaps(ctx, db)

	ticker := time.NewTicker(hhWeeklyPeriod)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			syncAllRoadmaps(ctx, db)
		}
	}
}

// HandleSyncHHSkills — ручной запуск синхронизации для конкретной карты (удобно для тестов и демо)
func HandleSyncHHSkills(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		roadmapID, err := strconv.ParseInt(chi.URLParam(r, "roadmapID"), 10, 64)
		if err != nil {
			writeJSONError(w, "Неверный ID карты", http.StatusBadRequest)
			return
		}

		ctx, cancel := context.WithTimeout(r.Context(), 2*time.Minute)
		defer cancel()

		skills, err := SyncRoadmapHHSkills(ctx, db, roadmapID)
		if err != nil {
			log.Printf("Ошибка ручной синхронизации hh.ru (roadmap=%d): %v\n", roadmapID, err)
			writeJSONError(w, hhErrorMessage, http.StatusBadGateway)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]any{
			"status":        "success",
			"roadmap_id":    roadmapID,
			"hh_key_skills": skills,
		})
	}
}
