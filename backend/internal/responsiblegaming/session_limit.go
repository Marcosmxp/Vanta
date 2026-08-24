package responsiblegaming

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/Marcosmxp/Vanta/backend/internal/platform/ids"
	"github.com/jackc/pgx/v5"
)

func (r *PostgresRepository) RequestSessionLimitChange(ctx context.Context, command RequestSessionLimitChangeCommand) error {
	if err := command.Validate(); err != nil {
		return err
	}

	tx, err := r.pool.BeginTx(ctx, pgx.TxOptions{IsoLevel: pgx.Serializable})
	if err != nil {
		return fmt.Errorf("begin session limit change: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	var country string
	if err := tx.QueryRow(ctx, `SELECT country_code FROM players WHERE player_id = $1`, command.PlayerID).Scan(&country); err != nil {
		return fmt.Errorf("load player jurisdiction: %w", err)
	}

	var limitID string
	var currentMinutes int
	err = tx.QueryRow(ctx, `
		SELECT limit_id, value_minutes
		FROM responsible_gaming_limits
		WHERE player_id = $1 AND limit_type = 'session-duration' AND period = 'session'
		FOR UPDATE`, command.PlayerID).Scan(&limitID, &currentMinutes)
	if errors.Is(err, pgx.ErrNoRows) {
		limitID, err = ids.New("limit")
		if err != nil {
			return err
		}
		requestHash := hashRequest(fmt.Sprintf("session|%d", command.RequestedMinutes))
		duplicate, err := acceptIdempotency(ctx, tx, command.PlayerID, "rg-session-limit", command.IdempotencyKey, requestHash)
		if err != nil {
			return err
		}
		if duplicate {
			return tx.Commit(ctx)
		}
		_, err = tx.Exec(ctx, `
			INSERT INTO responsible_gaming_limits(
				limit_id, player_id, limit_type, period, value_minutes, effective_at
			) VALUES ($1, $2, 'session-duration', 'session', $3, NOW())`, limitID, command.PlayerID, command.RequestedMinutes)
		if err != nil {
			return fmt.Errorf("create session limit: %w", err)
		}
		return tx.Commit(ctx)
	}
	if err != nil {
		return fmt.Errorf("lock session limit: %w", err)
	}

	requestHash := hashRequest(fmt.Sprintf("session|%d", command.RequestedMinutes))
	duplicate, err := acceptIdempotency(ctx, tx, command.PlayerID, "rg-session-limit", command.IdempotencyKey, requestHash)
	if err != nil {
		return err
	}
	if duplicate {
		return tx.Commit(ctx)
	}

	now := r.now()
	if command.RequestedMinutes <= currentMinutes {
		_, err = tx.Exec(ctx, `
			UPDATE responsible_gaming_limits
			SET value_minutes = $2,
			    pending_value_minutes = NULL,
			    pending_requested_at = NULL,
			    pending_effective_at = NULL
			WHERE limit_id = $1`, limitID, command.RequestedMinutes)
	} else {
		var coolingOffMinutes int64
		if err = tx.QueryRow(ctx, `SELECT limit_increase_cooling_off_minutes FROM responsible_gaming_jurisdiction_policy WHERE jurisdiction = $1`, country).Scan(&coolingOffMinutes); err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return ErrPolicyUnavailable
			}
			return fmt.Errorf("load session-limit cooling-off policy: %w", err)
		}
		effectiveAt := now.Add(time.Duration(coolingOffMinutes) * time.Minute)
		_, err = tx.Exec(ctx, `
			UPDATE responsible_gaming_limits
			SET pending_value_minutes = $2,
			    pending_requested_at = $3,
			    pending_effective_at = $4
			WHERE limit_id = $1`, limitID, command.RequestedMinutes, now, effectiveAt)
	}
	if err != nil {
		return fmt.Errorf("update session limit: %w", err)
	}
	return tx.Commit(ctx)
}
