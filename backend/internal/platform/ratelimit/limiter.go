package ratelimit

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type Limiter struct {
	client *redis.Client
}

func New(client *redis.Client) *Limiter {
	return &Limiter{client: client}
}

func (l *Limiter) Allow(ctx context.Context, scope, subject string, maximum int64, window time.Duration) (bool, error) {
	if l == nil || l.client == nil {
		return false, fmt.Errorf("rate limiter unavailable")
	}
	if maximum < 1 || window <= 0 {
		return false, fmt.Errorf("invalid rate limit policy")
	}

	digest := sha256.Sum256([]byte(subject))
	key := "vanta:rate:" + scope + ":" + hex.EncodeToString(digest[:])
	count, err := l.client.Incr(ctx, key).Result()
	if err != nil {
		return false, fmt.Errorf("increment rate limit counter: %w", err)
	}
	if count == 1 {
		if err := l.client.Expire(ctx, key, window).Err(); err != nil {
			return false, fmt.Errorf("set rate limit expiration: %w", err)
		}
	}
	return count <= maximum, nil
}
