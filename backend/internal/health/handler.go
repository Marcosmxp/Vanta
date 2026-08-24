package health

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type response struct {
	Status string `json:"status"`
}

func Handler() http.HandlerFunc {
	return func(w http.ResponseWriter, _ *http.Request) {
		write(w, http.StatusOK, "ok")
	}
}

func ReadinessHandler(pool *pgxpool.Pool, redisClient *redis.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), 1500*time.Millisecond)
		defer cancel()

		if pool == nil || redisClient == nil || pool.Ping(ctx) != nil || redisClient.Ping(ctx).Err() != nil {
			write(w, http.StatusServiceUnavailable, "not_ready")
			return
		}
		write(w, http.StatusOK, "ready")
	}
}

func write(w http.ResponseWriter, statusCode int, status string) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(response{Status: status})
}
