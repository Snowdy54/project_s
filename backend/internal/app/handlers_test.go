package app

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
)

func TestValidationHelpers(t *testing.T) {
	if err := validateNickname("Александр Скиллмапов"); err != nil {
		t.Fatalf("expected valid nickname, got %v", err)
	}
	for _, bad := range []string{"", "   ", "Иван «Хакер»", "Пётр”", "»Сергей"} {
		if err := validateNickname(bad); err == nil {
			t.Fatalf("expected error for invalid nickname %q", bad)
		}
	}

	if email, phone, err := parseContact("User@MySkill.ru"); err != nil || email == nil || *email != "user@myskill.ru" || phone != nil {
		t.Fatalf("expected normalized lowercase email, got email=%v phone=%v err=%v", email, phone, err)
	}
	if email, phone, err := parseContact("+7 (999) 123-45-67"); err != nil || phone == nil || email != nil {
		t.Fatalf("expected valid phone, got email=%v phone=%v err=%v", email, phone, err)
	}
	if _, _, err := parseContact("invalid-contact"); err == nil {
		t.Fatal("expected error for invalid contact")
	}
}

func TestJWTAndMiddlewares(t *testing.T) {
	token, err := generateJWT(42)
	if err != nil || token == "" {
		t.Fatalf("failed to generate JWT: %v", err)
	}

	userID, err := parseJWT(token)
	if err != nil || userID != 42 {
		t.Fatalf("expected userID 42, got %d (err=%v)", userID, err)
	}

	if _, err := parseJWT("invalid.jwt.token"); err == nil {
		t.Fatal("expected error on invalid JWT")
	}

	// RequireAuthMiddleware rejects missing header
	reqNoAuth := httptest.NewRequest(http.MethodGet, "/api/profile", nil)
	recNoAuth := httptest.NewRecorder()
	RequireAuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		t.Fatal("next handler should not be called without auth")
	})).ServeHTTP(recNoAuth, reqNoAuth)

	if recNoAuth.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", recNoAuth.Code)
	}

	// RequireAuthMiddleware passes valid token and injects userID
	reqWithAuth := httptest.NewRequest(http.MethodGet, "/api/profile", nil)
	reqWithAuth.Header.Set("Authorization", "Bearer "+token)
	recWithAuth := httptest.NewRecorder()
	var capturedID int64
	RequireAuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		capturedID = getCurrentUserID(r)
		w.WriteHeader(http.StatusOK)
	})).ServeHTTP(recWithAuth, reqWithAuth)

	if recWithAuth.Code != http.StatusOK || capturedID != 42 {
		t.Fatalf("expected 200 and userID=42, got code=%d id=%d", recWithAuth.Code, capturedID)
	}

	// OptionalAuthMiddleware allows guest (userID=0)
	reqGuest := httptest.NewRequest(http.MethodGet, "/api/roadmaps", nil)
	recGuest := httptest.NewRecorder()
	capturedID = -1
	OptionalAuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		capturedID = getCurrentUserID(r)
		w.WriteHeader(http.StatusOK)
	})).ServeHTTP(recGuest, reqGuest)

	if recGuest.Code != http.StatusOK || capturedID != 0 {
		t.Fatalf("expected guest 200 and userID=0, got code=%d id=%d", recGuest.Code, capturedID)
	}
}

func TestHandlerInputValidationWithoutDB(t *testing.T) {
	// 1. HandleRegister: запрещённые кавычки
	body := bytes.NewBufferString(`{"nickname":"Иван «Тест»","contact":"test@myskill.ru","password":"password123"}`)
	req := httptest.NewRequest(http.MethodPost, "/api/auth/register", body)
	rec := httptest.NewRecorder()
	HandleRegister(nil)(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for invalid nickname, got %d", rec.Code)
	}

	// 2. HandleRegister: короткий пароль
	body = bytes.NewBufferString(`{"nickname":"Иван","contact":"test@myskill.ru","password":"123"}`)
	req = httptest.NewRequest(http.MethodPost, "/api/auth/register", body)
	rec = httptest.NewRecorder()
	HandleRegister(nil)(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for short password, got %d", rec.Code)
	}

	// 3. HandleLogin: пустой логин/пароль
	body = bytes.NewBufferString(`{"contact":"","password":""}`)
	req = httptest.NewRequest(http.MethodPost, "/api/auth/login", body)
	rec = httptest.NewRecorder()
	HandleLogin(nil)(rec, req)
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 for empty credentials, got %d", rec.Code)
	}

	// 4. HandleDeleteProfile: неверное слово подтверждения
	body = bytes.NewBufferString(`{"confirmation":"Ой"}`)
	req = httptest.NewRequest(http.MethodDelete, "/api/profile", body)
	rec = httptest.NewRecorder()
	HandleDeleteProfile(nil)(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for wrong confirmation, got %d", rec.Code)
	}
	var errResp map[string]string
	if err := json.Unmarshal(rec.Body.Bytes(), &errResp); err != nil || errResp["error"] == "" {
		t.Fatalf("expected JSON error body, got %q", rec.Body.String())
	}

	// 5. HandleUpdateSkillStatus: недопустимый статус и неверный ID
	r := chi.NewRouter()
	r.Put("/api/skills/{skillID}/status", HandleUpdateSkillStatus(nil))

	reqBadStatus := httptest.NewRequest(http.MethodPut, "/api/skills/1/status", bytes.NewBufferString(`{"status":"invalid_status"}`))
	recBadStatus := httptest.NewRecorder()
	r.ServeHTTP(recBadStatus, reqBadStatus)
	if recBadStatus.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for invalid skill status, got %d", recBadStatus.Code)
	}

	reqBadID := httptest.NewRequest(http.MethodPut, "/api/skills/abc/status", bytes.NewBufferString(`{"status":"completed"}`))
	recBadID := httptest.NewRecorder()
	r.ServeHTTP(recBadID, reqBadID)
	if recBadID.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for non-numeric skill ID, got %d", recBadID.Code)
	}
}
