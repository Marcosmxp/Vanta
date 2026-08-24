package httpserver

import (
	"context"
	"log/slog"
	"net/http"
	"runtime/debug"
	"time"

	bettinghistory "github.com/Marcosmxp/Vanta/backend/internal/betting/history"
	"github.com/Marcosmxp/Vanta/backend/internal/health"
	"github.com/Marcosmxp/Vanta/backend/internal/identity/auth"
	identitysecurity "github.com/Marcosmxp/Vanta/backend/internal/identity/security"
	"github.com/Marcosmxp/Vanta/backend/internal/kyc"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/config"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/httpapi"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/ids"
	platformstatus "github.com/Marcosmxp/Vanta/backend/internal/platform/status"
	"github.com/Marcosmxp/Vanta/backend/internal/player/profile"
	"github.com/Marcosmxp/Vanta/backend/internal/responsiblegaming"
	"github.com/Marcosmxp/Vanta/backend/internal/wallet"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type Dependencies struct {
	Postgres          *pgxpool.Pool
	Redis             *redis.Client
	Auth              *auth.HTTPHandler
	Profile           *profile.HTTPHandler
	Wallet            *wallet.HTTPHandler
	Security          *identitysecurity.HTTPHandler
	ResponsibleGaming *responsiblegaming.HTTPHandler
	BetHistory        *bettinghistory.HTTPHandler
	KYC               *kyc.HTTPHandler
	PlatformStatus    *platformstatus.HTTPHandler
}

type requestContextKey string

const requestIDKey requestContextKey = "request-id"

func New(cfg config.Config, dependencies Dependencies) *http.Server {
	mux := http.NewServeMux()
	mux.Handle("GET /health", health.Handler())
	mux.Handle("GET /health/ready", health.ReadinessHandler(dependencies.Postgres, dependencies.Redis))
	mux.HandleFunc("GET /v1/platform/status", dependencies.PlatformStatus.Get)

	mux.HandleFunc("POST /v1/auth/register", dependencies.Auth.Register)
	mux.HandleFunc("POST /v1/auth/login", dependencies.Auth.Login)
	mux.HandleFunc("POST /v1/auth/refresh", dependencies.Auth.Refresh)

	protected := http.NewServeMux()
	protected.HandleFunc("POST /v1/auth/logout", dependencies.Auth.Logout)
	protected.HandleFunc("GET /v1/profile", dependencies.Profile.Get)
	protected.HandleFunc("GET /v1/kyc/status", dependencies.KYC.Get)
	protected.HandleFunc("GET /v1/wallet", dependencies.Wallet.Get)
	protected.HandleFunc("GET /v1/security", dependencies.Security.Get)
	protected.HandleFunc("DELETE /v1/security/sessions", dependencies.Security.RevokeOthers)
	protected.HandleFunc("DELETE /v1/security/sessions/{sessionID}", dependencies.Security.Revoke)
	protected.HandleFunc("GET /v1/responsible-gaming", dependencies.ResponsibleGaming.Get)
	protected.HandleFunc("POST /v1/responsible-gaming/limits/{limitID}", dependencies.ResponsibleGaming.ChangeMoneyLimit)
	protected.HandleFunc("POST /v1/responsible-gaming/session-limit", dependencies.ResponsibleGaming.ChangeSessionLimit)
	protected.HandleFunc("POST /v1/responsible-gaming/time-out", dependencies.ResponsibleGaming.StartTimeOut)
	protected.HandleFunc("POST /v1/responsible-gaming/self-exclusion", dependencies.ResponsibleGaming.StartSelfExclusion)
	protected.HandleFunc("GET /v1/bets", dependencies.BetHistory.List)
	protected.HandleFunc("GET /v1/bets/{betID}", dependencies.BetHistory.Get)
	mux.Handle("/v1/", dependencies.Auth.RequireAuthentication(protected))

	handler := requestIDMiddleware(mux)
	handler = recoveryMiddleware(handler)
	handler = accessLogMiddleware(handler)
	handler = securityHeaders(cfg.Environment, handler)

	return &http.Server{
		Addr:              ":" + cfg.APIPort,
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
		MaxHeaderBytes:    1 << 20,
	}
}

func requestIDMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requestID, err := ids.New("req")
		if err != nil {
			httpapi.WriteError(w, http.StatusInternalServerError, "request_id_unavailable", "Request could not be initialized.", "")
			return
		}
		w.Header().Set("X-Request-ID", requestID)
		ctx := context.WithValue(r.Context(), requestIDKey, requestID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func recoveryMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if recovered := recover(); recovered != nil {
				slog.Error("recovered HTTP panic", "request_id", RequestID(r.Context()), "method", r.Method, "path", r.URL.Path, "panic", recovered, "stack", string(debug.Stack()))
				httpapi.WriteError(w, http.StatusInternalServerError, "internal_error", "An internal error occurred.", RequestID(r.Context()))
			}
		}()
		next.ServeHTTP(w, r)
	})
}

type statusRecorder struct {
	http.ResponseWriter
	status int
}

func (r *statusRecorder) WriteHeader(status int) {
	r.status = status
	r.ResponseWriter.WriteHeader(status)
}

func accessLogMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		started := time.Now()
		recorder := &statusRecorder{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(recorder, r)
		slog.Info("HTTP request",
			"request_id", RequestID(r.Context()),
			"method", r.Method,
			"path", r.URL.Path,
			"status", recorder.status,
			"duration_ms", time.Since(started).Milliseconds(),
		)
	})
}

func securityHeaders(environment config.Environment, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Referrer-Policy", "no-referrer")
		w.Header().Set("Cache-Control", "no-store")
		w.Header().Set("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'")
		w.Header().Set("X-Frame-Options", "DENY")
		if environment == config.EnvironmentProduction {
			w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		}
		next.ServeHTTP(w, r)
	})
}

func RequestID(ctx context.Context) string {
	value, _ := ctx.Value(requestIDKey).(string)
	return value
}
