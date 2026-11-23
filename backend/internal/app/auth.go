package app

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"net/mail"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type ctxKey string

const userIDContextKey ctxKey = "userID"

var phoneRegex = regexp.MustCompile(`^\+?[0-9\s\-()]{7,20}$`)

func getJWTSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "skillmap-dev-secret-change-in-prod"
	}
	return []byte(secret)
}

type Claims struct {
	UserID int64 `json:"user_id"`
	jwt.RegisteredClaims
}

// getCurrentUserID достаёт ID авторизованного пользователя из контекста (0 для гостя)
func getCurrentUserID(r *http.Request) int64 {
	if id, ok := r.Context().Value(userIDContextKey).(int64); ok {
		return id
	}
	return 0
}

func generateJWT(userID int64) (string, error) {
	claims := Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(72 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(getJWTSecret())
}

func parseJWT(tokenStr string) (int64, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("неверный метод подписи")
		}
		return getJWTSecret(), nil
	})
	if err != nil || !token.Valid {
		return 0, errors.New("невалидный токен")
	}
	return claims.UserID, nil
}

// OptionalAuthMiddleware извлекает userID из Bearer-токена, если он передан
func OptionalAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if strings.HasPrefix(authHeader, "Bearer ") {
			tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
			if userID, err := parseJWT(tokenStr); err == nil {
				ctx := context.WithValue(r.Context(), userIDContextKey, userID)
				r = r.WithContext(ctx)
			}
		}
		next.ServeHTTP(w, r)
	})
}

// RequireAuthMiddleware блокирует неавторизованных пользователей
func RequireAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			writeJSONError(w, "Войдите в личный кабинет или зарегистрируйтесь", http.StatusUnauthorized)
			return
		}
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		userID, err := parseJWT(tokenStr)
		if err != nil {
			writeJSONError(w, "Сессия истекла. Войдите снова", http.StatusUnauthorized)
			return
		}
		ctx := context.WithValue(r.Context(), userIDContextKey, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func writeJSONError(w http.ResponseWriter, message string, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

func validateNickname(nickname string) error {
	nickname = strings.TrimSpace(nickname)
	if nickname == "" {
		return errors.New("имя не может быть пустым")
	}
	if strings.ContainsAny(nickname, "«”»") {
		return errors.New("имя не должно содержать символы «, ”, »")
	}
	return nil
}

func isValidEmail(email string) bool {
	addr, err := mail.ParseAddress(email)
	return err == nil && addr.Address == email && strings.Contains(email, ".")
}

func isValidPhone(phone string) bool {
	return phoneRegex.MatchString(phone)
}

// Разбираем поле "Email/телефон" из формы входа и регистрации
func parseContact(contact string) (email *string, phone *string, err error) {
	contact = strings.TrimSpace(contact)
	if contact == "" {
		return nil, nil, errors.New("укажите email или телефон")
	}
	if strings.Contains(contact, "@") {
		if !isValidEmail(contact) {
			return nil, nil, errors.New("некорректный формат email")
		}
		lower := strings.ToLower(contact)
		return &lower, nil, nil
	}
	if !isValidPhone(contact) {
		return nil, nil, errors.New("некорректный формат телефона")
	}
	return nil, &contact, nil
}

type RegisterRequest struct {
	Nickname string `json:"nickname"`
	Contact  string `json:"contact"` // Email или телефон
	Password string `json:"password"`
}

type LoginRequest struct {
	Contact  string `json:"contact"` // Email или телефон
	Password string `json:"password"`
}

type AuthResponse struct {
	Token    string `json:"token"`
	UserID   int64  `json:"user_id"`
	Nickname string `json:"nickname"`
}

// HandleRegister — регистрация по имени, email/телефону и паролю
func HandleRegister(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req RegisterRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeJSONError(w, "Неверный формат запроса", http.StatusBadRequest)
			return
		}

		req.Nickname = strings.TrimSpace(req.Nickname)
		if err := validateNickname(req.Nickname); err != nil {
			writeJSONError(w, "Не удалось зарегистрироваться из-за: "+err.Error(), http.StatusBadRequest)
			return
		}
		if len([]rune(req.Password)) < 6 {
			writeJSONError(w, "Не удалось зарегистрироваться из-за: минимальная длина пароля 6 символов", http.StatusBadRequest)
			return
		}

		email, phone, err := parseContact(req.Contact)
		if err != nil {
			writeJSONError(w, "Не удалось зарегистрироваться из-за: "+err.Error(), http.StatusBadRequest)
			return
		}

		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			writeJSONError(w, "Не удалось зарегистрироваться из-за проблем на сервере. Попробуйте снова.", http.StatusInternalServerError)
			return
		}

		var userID int64
		err = db.QueryRow(`
			INSERT INTO users (nickname, email, phone, password_hash)
			VALUES ($1, $2, $3, $4)
			RETURNING id
		`, req.Nickname, email, phone, string(hash)).Scan(&userID)
		if err != nil {
			var pqErr *pq.Error
			if errors.As(err, &pqErr) && pqErr.Code == "23505" {
				writeJSONError(w, "Не удалось зарегистрироваться: пользователь с таким email или телефоном уже зарегистрирован.", http.StatusConflict)
				return
			}
			log.Printf("Ошибка SQL (HandleRegister): %v\n", err)
			writeJSONError(w, "Не удалось зарегистрироваться из-за проблем на сервере. Попробуйте снова.", http.StatusInternalServerError)
			return
		}

		token, err := generateJWT(userID)
		if err != nil {
			writeJSONError(w, "Не удалось зарегистрироваться из-за проблем на сервере. Попробуйте снова.", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(AuthResponse{
			Token:    token,
			UserID:   userID,
			Nickname: req.Nickname,
		})
	}
}

// HandleLogin — вход по email/телефону и паролю
func HandleLogin(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeJSONError(w, "Неверный формат запроса", http.StatusBadRequest)
			return
		}

		contact := strings.TrimSpace(req.Contact)
		if contact == "" || req.Password == "" {
			writeJSONError(w, "Неверный логин или пароль. Попробуйте снова.", http.StatusUnauthorized)
			return
		}

		var user struct {
			ID           int64  `db:"id"`
			Nickname     string `db:"nickname"`
			PasswordHash string `db:"password_hash"`
		}

		var err error
		if strings.Contains(contact, "@") {
			err = db.Get(&user, `SELECT id, nickname, password_hash FROM users WHERE email = $1`, strings.ToLower(contact))
		} else {
			err = db.Get(&user, `SELECT id, nickname, password_hash FROM users WHERE phone = $1`, contact)
		}

		if errors.Is(err, sql.ErrNoRows) {
			writeJSONError(w, "Неверный логин или пароль. Попробуйте снова.", http.StatusUnauthorized)
			return
		}
		if err != nil {
			log.Printf("Ошибка SQL (HandleLogin): %v\n", err)
			writeJSONError(w, "Не удалось войти в личный кабинет. Попробуйте снова.", http.StatusInternalServerError)
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
			writeJSONError(w, "Неверный логин или пароль. Попробуйте снова.", http.StatusUnauthorized)
			return
		}

		token, err := generateJWT(user.ID)
		if err != nil {
			writeJSONError(w, "Не удалось войти в личный кабинет. Попробуйте снова.", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(AuthResponse{
			Token:    token,
			UserID:   user.ID,
			Nickname: user.Nickname,
		})
	}
}
