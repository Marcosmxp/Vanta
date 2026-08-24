package history

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresRepository(pool *pgxpool.Pool) *PostgresRepository {
	return &PostgresRepository{pool: pool}
}

func (r *PostgresRepository) List(ctx context.Context, playerID, cursor string, limit int) ([]BetSummary, string, error) {
	if limit < 1 {
		limit = 20
	}
	if limit > 50 {
		limit = 50
	}

	cursorTime := time.Now().UTC().Add(time.Hour)
	cursorBetID := "~"
	if cursor != "" {
		parsedTime, parsedID, err := decodeCursor(cursor)
		if err != nil {
			return nil, "", err
		}
		cursorTime = parsedTime
		cursorBetID = parsedID
	}

	rows, err := r.pool.Query(ctx, `
		SELECT bet_id, game, status, currency, stake_minor, payout_minor, multiplier_bps, placed_at, settled_at
		FROM bets
		WHERE player_id = $1
		  AND (placed_at, bet_id) < ($2, $3)
		ORDER BY placed_at DESC, bet_id DESC
		LIMIT $4`, playerID, cursorTime, cursorBetID, limit+1)
	if err != nil {
		return nil, "", fmt.Errorf("list bets: %w", err)
	}
	defer rows.Close()

	bets := make([]BetSummary, 0, limit+1)
	for rows.Next() {
		var bet BetSummary
		if err := rows.Scan(&bet.BetID, &bet.Game, &bet.Status, &bet.Currency, &bet.StakeMinor, &bet.PayoutMinor, &bet.MultiplierBps, &bet.PlacedAt, &bet.SettledAt); err != nil {
			return nil, "", fmt.Errorf("scan bet: %w", err)
		}
		if err := bet.Validate(); err != nil {
			return nil, "", fmt.Errorf("validate bet read model: %w", err)
		}
		bets = append(bets, bet)
	}
	if err := rows.Err(); err != nil {
		return nil, "", fmt.Errorf("iterate bets: %w", err)
	}

	nextCursor := ""
	if len(bets) > limit {
		lastVisible := bets[limit-1]
		nextCursor = encodeCursor(lastVisible.PlacedAt, lastVisible.BetID)
		bets = bets[:limit]
	}
	return bets, nextCursor, nil
}

func (r *PostgresRepository) GetPlinko(ctx context.Context, playerID, betID string) (PlinkoDetails, error) {
	var details PlinkoDetails
	err := r.pool.QueryRow(ctx, `
		SELECT bet_id, game, status, currency, stake_minor, payout_minor, multiplier_bps,
		       placed_at, settled_at, ruleset_id, ruleset_version, rows, risk, slot
		FROM bets
		WHERE player_id = $1 AND bet_id = $2 AND game = 'plinko'`, playerID, betID).Scan(
		&details.BetID,
		&details.Game,
		&details.Status,
		&details.Currency,
		&details.StakeMinor,
		&details.PayoutMinor,
		&details.MultiplierBps,
		&details.PlacedAt,
		&details.SettledAt,
		&details.RulesetID,
		&details.RulesetVersion,
		&details.Rows,
		&details.Risk,
		&details.Slot,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return PlinkoDetails{}, pgx.ErrNoRows
		}
		return PlinkoDetails{}, fmt.Errorf("load bet details: %w", err)
	}
	if err := details.Validate(); err != nil {
		return PlinkoDetails{}, fmt.Errorf("validate bet details: %w", err)
	}
	return details, nil
}

func encodeCursor(placedAt time.Time, betID string) string {
	payload := strconv.FormatInt(placedAt.UnixNano(), 10) + "|" + betID
	return base64.RawURLEncoding.EncodeToString([]byte(payload))
}

func decodeCursor(cursor string) (time.Time, string, error) {
	decoded, err := base64.RawURLEncoding.DecodeString(cursor)
	if err != nil {
		return time.Time{}, "", fmt.Errorf("invalid cursor")
	}
	timestamp, betID, ok := strings.Cut(string(decoded), "|")
	if !ok || betID == "" {
		return time.Time{}, "", fmt.Errorf("invalid cursor")
	}
	nanos, err := strconv.ParseInt(timestamp, 10, 64)
	if err != nil {
		return time.Time{}, "", fmt.Errorf("invalid cursor")
	}
	return time.Unix(0, nanos).UTC(), betID, nil
}
