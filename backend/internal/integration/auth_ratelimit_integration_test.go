package integration_test

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/Marcosmxp/Vanta/backend/internal/identity/auth"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/cache"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/ratelimit"
)

func TestAuthenticationRateLimitIgnoresSourcePortChanges(t *testing.T) {
	pool, protector := openSecurityRuntime(t)
	redisURL := os.Getenv("VANTA_TEST_REDIS_URL")
	if redisURL == "" {
		t.Skip("integration Redis is not configured")
	}
	redisClient, err := cache.Open(t.Context(), redisURL)
	if err != nil {
		t.Fatalf("open Redis: %v", err)
	}
	t.Cleanup(func() { _ = redisClient.Close() })

	service := auth.NewService(auth.NewPostgresStore(pool), protector, 15*time.Minute, 24*time.Hour)
	handler := auth.NewHTTPHandler(service, ratelimit.New(redisClient))
	clientIP := fmt.Sprintf("2001:db8::%x", time.Now().UnixNano()&0xffff)
	body := `{"email":"rate-limit@example.test","password":"Vanta-Invalid-Password-42!","deviceLabel":"test","platform":"test"}`

	for attempt := 1; attempt <= 11; attempt++ {
		request := httptest.NewRequest(http.MethodPost, "/v1/auth/login", strings.NewReader(body))
		request.RemoteAddr = fmt.Sprintf("[%s]:%d", clientIP, 40000+attempt)
		recorder := httptest.NewRecorder()
		handler.Login(recorder, request)

		if attempt <= 10 && recorder.Code == http.StatusTooManyRequests {
			t.Fatalf("rate limit triggered too early on attempt %d", attempt)
		}
		if attempt == 11 && recorder.Code != http.StatusTooManyRequests {
			t.Fatalf("expected 11th attempt from same IP to be rate limited despite port changes, got %d", recorder.Code)
		}
	}
}
