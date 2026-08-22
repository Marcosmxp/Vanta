package httpserver

import (
	"net/http"
	"time"

	"github.com/Marcosmxp/Vanta/backend/internal/health"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/config"
)

func New(cfg config.Config) *http.Server {
	mux := http.NewServeMux()
	mux.Handle("GET /health", health.Handler())

	return &http.Server{
		Addr:              ":" + cfg.APIPort,
		Handler:           securityHeaders(mux),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
		MaxHeaderBytes:    1 << 20,
	}
}

func securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Referrer-Policy", "no-referrer")
		w.Header().Set("Cache-Control", "no-store")
		next.ServeHTTP(w, r)
	})
}
