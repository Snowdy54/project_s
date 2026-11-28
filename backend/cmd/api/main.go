package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/Snowdy54/project_s/backend/internal/app"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func main() {
	// 1. Подключаемся к базе данных PostgreSQL
	// Вставь свои реальные данные: пользователя, пароль и название БД
	// 1. Подключаемся к PostgreSQL (работает и в Docker, и локально)
	dsn := getEnv(
		"DATABASE_URL",
		"host=localhost port=5432 user=postgres password=admin dbname=skillmap sslmode=disable",
	)

	var db *sqlx.DB
	var err error
	for attempt := 1; attempt <= 10; attempt++ {
		db, err = sqlx.Connect("postgres", dsn)
		if err == nil {
			if pingErr := db.Ping(); pingErr == nil {
				break
			} else {
				err = pingErr
			}
		}
		log.Printf("Ожидание PostgreSQL (попытка %d/10): %v", attempt, err)
		time.Sleep(2 * time.Second)
	}
	if err != nil {
		log.Fatalf("База данных недоступна: %v", err)
	}
	defer db.Close()

	go app.StartHHScheduler(context.Background(), db)

	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost", "http://127.0.0.1", "http://localhost:*", "http://127.0.0.1:*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// 1. Авторизация (публичные)
	r.Post("/api/auth/register", app.HandleRegister(db))
	r.Post("/api/auth/login", app.HandleLogin(db))

	// 2. Публичные с опциональной авторизацией (гость видит карту, юзер — свой прогресс и закладки)
	r.Group(func(r chi.Router) {
		r.Use(app.OptionalAuthMiddleware)
		r.Get("/api/roadmaps", app.HandleGetRoadmaps(db))
		r.Get("/api/roadmaps/tags", app.HandleGetRoadmapTags(db))
		r.Get("/api/roadmaps/{roadmapID}", app.HandleGetRoadmapByID(db))
	})

	// 3. Строго для авторизованных пользователей
	r.Group(func(r chi.Router) {
		r.Use(app.RequireAuthMiddleware)
		r.Post("/api/roadmaps/{roadmapID}/favorite", app.HandleAddFavorite(db))
		r.Delete("/api/roadmaps/{roadmapID}/favorite", app.HandleRemoveFavorite(db))
		r.Put("/api/skills/{skillID}/status", app.HandleUpdateSkillStatus(db))
		r.Post("/api/onboarding", app.HandleOnboarding(db))

		r.Get("/api/profile", app.HandleGetProfile(db))
		r.Put("/api/profile", app.HandleUpdateProfile(db))
		r.Delete("/api/profile", app.HandleDeleteProfile(db))

		// Gap Analysis
		r.Get("/api/roadmaps/{roadmapID}/gap-survey", app.HandleGetGapSurvey(db))
		r.Post("/api/roadmaps/{roadmapID}/gap-survey/preview", app.HandlePreviewGapSurvey(db))
		r.Post("/api/roadmaps/{roadmapID}/gap-survey/apply", app.HandleApplyGapSurvey(db))

		r.Post("/api/roadmaps/{roadmapID}/hh-sync", app.HandleSyncHHSkills(db))
		// Система достижений
		r.Get("/api/profile/achievements", app.HandleGetUserAchievements(db))
		r.Post("/api/roadmaps/{roadmapID}/practice-visit", app.HandleVisitPracticeBase(db))
	})

	// 4. Запускаем сервер на порту 8080
	port := getEnv("PORT", "8000")
	log.Printf("Сервер запущен на http://localhost:%s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("Ошибка запуска сервера: %v", err)
	}
}
