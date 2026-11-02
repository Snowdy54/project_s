# Шпаргалка по проекту (Docker + Go + React)

Справочник базовых команд и инструкций по локальному окружению, запуску сервисов, тестированию и решению типовых проблем для команды проекта SkillMap.

---

## 🐳 Docker: Управление контейнерами

Все команды выполняются из корневой директории проекта, где расположен файл `docker-compose.yml`.

* `docker compose up` — запуск всех сервисов (Go бэкенд, React фронтенд, PostgreSQL) с выводом логов в терминал.
* `docker compose up -d` — запуск всех контейнеров в фоновом (detached) режиме.
* `docker compose up --build` — принудительная пересборка образов и последующий запуск (требуется при изменении `go.mod`, `package.json` или файлов `Dockerfile`).
* `docker compose stop` — временная остановка контейнеров без потери данных.
* `docker compose down` — полная остановка и удаление запущенных контейнеров и сетей.
* `docker compose down -v` — остановка и удаление контейнеров вместе с томами данных (очищает базу данных PostgreSQL).
* `docker compose restart backend` — перезапуск только сервиса бэкенда.
* `docker compose restart frontend` — перезапуск сервера Vite.
* `docker compose ps` — вывод списка запущенных контейнеров, их статуса и проброшенных портов.
* `docker compose logs -f backend` — непрерывный просмотр логов Go-сервиса в реальном времени.

---

## 🦫 Go: Бэкенд (внутри Docker)

Команды отправляются напрямую в работающий контейнер `backend` с помощью `docker compose exec`.

* `docker compose exec backend go mod tidy` — синхронизация зависимостей: удаление неиспользуемых и подтягивание недостающих библиотек в `go.mod` и `go.sum`.
* `docker compose exec backend go get github.com/<пакет>` — установка нового внешнего пакета в окружение контейнера.
* `docker compose exec backend go test ./...` — запуск юнит-тестов бэкенда по всем пакетам.
* `docker compose exec backend go test -v ./...` — запуск тестов с подробным логированием каждого тест-кейса.
* `docker compose exec backend go run ./cmd/migrate` — запуск скрипта накатывания миграций БД (или использование CLI-утилит `goose` / `golang-migrate`).
* `docker compose exec backend go version` — вывод установленной версии компилятора Go в контейнере.

---

## ⚛️ React (TypeScript): Фронтенд (внутри Docker)

Управление клиентской частью через контейнер `frontend`.

* `docker compose exec frontend npm install <пакет>` — установка пакета (например, `@xyflow/react`, `lucide-react`, `axios`).
* `docker compose exec frontend npm run dev` — ручной запуск Vite dev-сервера.
* `docker compose exec frontend npm run type-check` — проверка типов через `tsc --noEmit` без создания артефактов сборки.
* `docker compose exec frontend npm run lint` — запуск статического анализатора ESLint.
* `docker compose exec frontend npm run build` — проверка продуктовой сборки приложения.

---

## 💻 Локальная разработка (без Docker)

Инструкция для запуска сервисов непосредственно в операционной системе (БД может работать в отдельном контейнере).

### Бэкенд (Go)
```bash
cd backend
go mod download
go run ./cmd/api
# или запуск через Air для hot-reload:
air
```

### Фронтенд (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

### Проверка тестов с контролем data race
```bash
cd backend
go test -race ./...
```

---

## 🐙 Git: Командный рабочий процесс

* `git checkout <branch_name>` — переключение на существующую ветку.
* `git checkout -b feature/<task_name>` — создание новой ветки и переход в нее.
* `git pull origin dev` — подтягивание свежих изменений из ветки разработки.
* `git add .` — добавление измененных файлов в индекс.
* `git commit -m "feat: добавить расчет дефицита навыков"` — фиксация изменений с сообщением по стандарту Conventional Commits.
* `git push -u origin <branch_name>` — публикация ветки на GitHub с привязкой отслеживания.
* `git push` — отправка последующих коммитов.

---

## 🛠️ Решение проблем (Troubleshooting)

### 1. Ошибка CORS (Cross-Origin Resource Sharing)
* **Симптом:** браузер блокирует HTTP-запросы от интерфейса (`http://localhost:5173`) к API (`http://localhost:8080`).
* **Решение:** убедитесь, что в middleware роутера Go (`chi/cors`, `gin-contrib/cors` или кастомном хэндлере) указан origin фронтенда:
  ```go
  AllowedOrigins: []string{"http://localhost:5173", "http://localhost:3000"}
  ```

### 2. Ошибка подключения к базе данных (`connection refused`)
* **Причина:** попытка подключиться к `localhost:5432` изнутри Docker-сети.
* **Решение:** 
  * Внутри Docker: параметром хоста должно выступать имя сервиса базы данных из compose-файла (например, `host=db` или `host=postgres`, порт `5432`).
  * При локальном запуске вне контейнеров: используйте `host=localhost`.

### 3. Изменения в зависимостях не подтягиваются
* **Симптом:** ошибка сборки контейнера из-за отсутствующего модуля.
* **Решение:** пересоберите образ без использования кэша Docker:
  ```bash
  docker compose build --no-cache backend
  ```

### 4. Аварийное завершение Go-контейнера (`Exited with code 0/1`)
* **Причина:** чаще всего `panic` при инициализации конфигурации или парсинге переменных среды (`.env`).
* **Решение:** проверьте логи контейнера командой `docker compose logs backend`. Убедитесь, что переданы все обязательные переменные (`DB_DSN`, `GEMINI_API_KEY`, `PORT`).

### 5. Нехватка места на диске / сбои кэша Docker
* **Решение:** очистка неиспользуемых контейнеров, сетей и временных слоев:
  ```bash
  docker system prune -f
  ```