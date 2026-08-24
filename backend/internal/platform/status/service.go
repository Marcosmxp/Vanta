package status

import (
	"context"
	"time"

	"github.com/Marcosmxp/Vanta/backend/internal/platform/config"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type Service struct {
	pool  *pgxpool.Pool
	redis *redis.Client
	cfg   config.MaintenanceConfig
	now   func() time.Time
}

func NewService(pool *pgxpool.Pool, redisClient *redis.Client, cfg config.MaintenanceConfig) *Service {
	return &Service{pool: pool, redis: redisClient, cfg: cfg, now: func() time.Time { return time.Now().UTC() }}
}

func (s *Service) Get(ctx context.Context) ReadModel {
	now := s.now()
	if s.cfg.Enabled {
		message := s.cfg.Message
		if message == "" {
			message = "Vanta está temporariamente em manutenção. Tente novamente mais tarde."
		}
		model := ReadModel{Availability: AvailabilityMaintenance, IncidentID: s.cfg.IncidentID, Message: message, UpdatedAt: now}
		if s.cfg.RetryAfter.After(now) {
			retry := s.cfg.RetryAfter
			model.RetryAfterAt = &retry
		}
		return model
	}

	checkCtx, cancel := context.WithTimeout(ctx, 1500*time.Millisecond)
	defer cancel()
	if s.pool == nil || s.redis == nil || s.pool.Ping(checkCtx) != nil || s.redis.Ping(checkCtx).Err() != nil {
		return ReadModel{
			Availability: AvailabilityDegraded,
			Message:      "Alguns serviços Vanta estão temporariamente indisponíveis. Operações sensíveis permanecem bloqueadas.",
			UpdatedAt:    now,
		}
	}

	return ReadModel{
		Availability: AvailabilityOperational,
		Message:      "Serviços Vanta operacionais.",
		UpdatedAt:    now,
	}
}
