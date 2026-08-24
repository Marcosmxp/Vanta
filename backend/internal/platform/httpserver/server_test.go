package httpserver

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Marcosmxp/Vanta/backend/internal/platform/config"
)

func TestSecurityHeadersProduction(t *testing.T) {
	handler := securityHeaders(config.EnvironmentProduction, http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusNoContent)
	}))
	recorder := httptest.NewRecorder()
	handler.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/", nil))

	expected := map[string]string{
		"X-Content-Type-Options":    "nosniff",
		"Referrer-Policy":           "no-referrer",
		"Cache-Control":             "no-store",
		"Content-Security-Policy":   "default-src 'none'; frame-ancestors 'none'",
		"X-Frame-Options":           "DENY",
		"Strict-Transport-Security": "max-age=31536000; includeSubDomains",
	}
	for header, value := range expected {
		if got := recorder.Header().Get(header); got != value {
			t.Fatalf("header %s: expected %q, got %q", header, value, got)
		}
	}
}

func TestRequestIDIgnoresInboundRequestID(t *testing.T) {
	var contextID string
	handler := requestIDMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		contextID = RequestID(r.Context())
		w.WriteHeader(http.StatusNoContent)
	}))
	request := httptest.NewRequest(http.MethodGet, "/", nil)
	request.Header.Set("X-Request-ID", "attacker-controlled")
	recorder := httptest.NewRecorder()
	handler.ServeHTTP(recorder, request)

	responseID := recorder.Header().Get("X-Request-ID")
	if responseID == "" || responseID == "attacker-controlled" || !strings.HasPrefix(responseID, "req_") {
		t.Fatalf("request id must be server generated, got %q", responseID)
	}
	if contextID != responseID {
		t.Fatalf("request id context/header mismatch: context=%q header=%q", contextID, responseID)
	}
}

func TestRecoveryResponseDoesNotExposePanicPayload(t *testing.T) {
	handler := requestIDMiddleware(recoveryMiddleware(http.HandlerFunc(func(http.ResponseWriter, *http.Request) {
		panic("secret-token-that-must-not-reach-client")
	})))
	recorder := httptest.NewRecorder()
	handler.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/panic", nil))

	if recorder.Code != http.StatusInternalServerError {
		t.Fatalf("expected 500, got %d", recorder.Code)
	}
	if strings.Contains(recorder.Body.String(), "secret-token-that-must-not-reach-client") {
		t.Fatal("panic payload leaked into HTTP response")
	}
	if !strings.Contains(recorder.Body.String(), "internal_error") {
		t.Fatalf("expected sanitized error response, got %q", recorder.Body.String())
	}
}
