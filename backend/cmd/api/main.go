package main

import (
	"log"
	"net/http"

	"github.com/Snowdy54/project_s/backend/internal/app"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func main() {
	// 1. Подключаемся к базе данных PostgreSQL
	// Вставь свои реальные данные: пользователя, пароль и название БД
	dsn := "host=localhost port=5432 user=postgres password=admin dbname=skillmap sslmode=disable"
	db, err := sqlx.Connect("postgres", dsn)
	if err != nil {
		log.Fatalf("Ошибка подключения к БД: %v", err)
	}
	defer db.Close()

	// Проверяем, что база реально отвечает
	if err := db.Ping(); err != nil {
		log.Fatalf("База данных недоступна: %v", err)
	}

	// 2. Инициализируем роутер chi
	r := chi.NewRouter()

	// 3. Подключаем наши эндпоинты, передавая им готовое подключение к БД
	r.Get("/api/graph", app.HandleGetGraph(db))
	r.Get("/api/graph/{userID}", app.HandleGetGraph(db))
	// 3. Подключаем наши эндпоинты
	r.Get("/api/graph", app.HandleGetGraph(db))
	r.Get("/api/graph/{userID}", app.HandleGetGraph(db))

	// НОВЫЙ ЭНДПОИНТ:
	r.Post("/api/onboarding", app.HandleOnboarding(db))
	r.Use(cors.Handler(cors.Options{
		// Разрешаем запросы с любых локальных портов (где обычно крутится фронт)
		AllowedOrigins:   []string{"http://localhost:*", "http://127.0.0.1:*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Кэшируем настройки CORS на 5 минут
	}))

	// 4. Запускаем сервер на порту 8080
	log.Println("Сервер запущен на http://localhost:8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("Ошибка запуска сервера: %v", err)
	}
}
