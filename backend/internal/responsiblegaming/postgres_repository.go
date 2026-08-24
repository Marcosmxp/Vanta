package responsiblegaming

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/Marcosmxp/Vanta/backend/internal/platform/ids"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrPolicyUnavailable    = errors.New("responsible-gaming policy unavailable")
	ErrProtectionActive     = errors.New("responsible-gaming restriction already active")
	ErrIdempotencyConflict  = errors.New("idempotency key reused with different request")
	ErrLimitNotFound        = errors.New("responsible-gaming limit not found")
)

type PostgresRepository struct {
	pool *pgxpool.Pool
	now  func() time.Time
}

func NewPostgresRepository(pool *pgxpool.Pool) *PostgresRepository {
	return &PostgresRepository{pool: pool, now: func() time.Time { return time.Now().UTC() }}
}

func (r *PostgresRepository) GetSnapshot(ctx context.Context, playerID string) (Snapshot, error) {
	var country string
	var timeoutStarted, timeoutUntil, selfStarted, selfUntil *time.Time
	var timeoutOption, selfOption string
	var selfIndefinite bool
	if err := r.pool.QueryRow(ctx, `
		SELECT p.country_code,
		       rg.timeout_started_at, rg.timeout_until, rg.timeout_option_id,
		       rg.self_excluded_started_at, rg.self_excluded_until, rg.self_exclusion_option_id,
		       rg.self_excluded_indefinitely
		FROM players p
		JOIN responsible_gaming_profiles rg ON rg.player_id = p.player_id
		WHERE p.player_id = $1`, playerID,
	).Scan(&country, &timeoutStarted, &timeoutUntil, &timeoutOption, &selfStarted, &selfUntil, &selfOption, &selfIndefinite); err != nil {
		return Snapshot{}, fmt.Errorf("load responsible-gaming profile: %w", err)
	}

	now := r.now()
	snapshot := Snapshot{PlayerID: playerID, Availability: AvailabilityReady, State: ProtectionStandard}
	if selfIndefinite || (selfUntil != nil && selfUntil.After(now)) {
		snapshot.State = ProtectionSelfExcluded
		label := r.optionLabel(ctx, selfOption)
		if label == "" {
			label = "Autoexclusão ativa"
		}
		started := now
		if selfStarted != nil {
			started = *selfStarted
		}
		snapshot.SelfExclusion = &ActiveRestrictionReadModel{OptionID: fallbackOptionID(selfOption, "self-exclusion"), Label: label, StartedAt: started, EndsAt: selfUntil}
	} else if timeoutUntil != nil && timeoutUntil.After(now) {
		snapshot.State = ProtectionTimeOut
		label := r.optionLabel(ctx, timeoutOption)
		if label == "" {
			label = "Pausa temporária ativa"
		}
		started := now
		if timeoutStarted != nil {
			started = *timeoutStarted
		}
		snapshot.ActiveTimeOut = &ActiveRestrictionReadModel{OptionID: fallbackOptionID(timeoutOption, "time-out"), Label: label, StartedAt: started, EndsAt: timeoutUntil}
	}

	rows, err := r.pool.Query(ctx, `
		SELECT limit_id, limit_type, period, value_minor, value_minutes,
		       pending_value_minor, pending_value_minutes, pending_requested_at, pending_effective_at
		FROM responsible_gaming_limits
		WHERE player_id = $1
		ORDER BY limit_type, period`, playerID)
	if err != nil {
		return Snapshot{}, fmt.Errorf("load responsible-gaming limits: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var limitID, limitType, period string
		var valueMinor, pendingMinor *int64
		var valueMinutes, pendingMinutes *int
		var pendingRequestedAt, pendingEffectiveAt *time.Time
		if err := rows.Scan(&limitID, &limitType, &period, &valueMinor, &valueMinutes, &pendingMinor, &pendingMinutes, &pendingRequestedAt, &pendingEffectiveAt); err != nil {
			return Snapshot{}, fmt.Errorf("scan responsible-gaming limit: %w", err)
		}

		if limitType == "session-duration" {
			if valueMinutes == nil || *valueMinutes <= 0 {
				continue
			}
			model := &SessionLimitReadModel{Minutes: *valueMinutes}
			if pendingMinutes != nil && pendingRequestedAt != nil {
				direction := DirectionIncrease
				if *pendingMinutes <= *valueMinutes {
					direction = DirectionDecrease
				}
				model.PendingChange = &PendingSessionLimitChange{RequestedMinutes: *pendingMinutes, RequestedAt: *pendingRequestedAt, EffectiveAt: pendingEffectiveAt, Direction: direction}
			}
			snapshot.SessionLimit = model
			continue
		}

		if valueMinor == nil || *valueMinor <= 0 {
			continue
		}
		model := MoneyLimitReadModel{LimitID: limitID, Kind: MoneyLimitKind(limitType), Period: LimitPeriod(period), Currency: "EUR", AmountMinor: *valueMinor}
		if pendingMinor != nil && pendingRequestedAt != nil {
			direction := DirectionIncrease
			if *pendingMinor <= *valueMinor {
				direction = DirectionDecrease
			}
			model.PendingChange = &PendingMoneyLimitChange{RequestedAmountMinor: *pendingMinor, RequestedAt: *pendingRequestedAt, EffectiveAt: pendingEffectiveAt, Direction: direction}
		}
		snapshot.Limits = append(snapshot.Limits, model)
	}
	if err := rows.Err(); err != nil {
		return Snapshot{}, fmt.Errorf("iterate responsible-gaming limits: %w", err)
	}

	if snapshot.State == ProtectionStandard && (len(snapshot.Limits) > 0 || snapshot.SessionLimit != nil) {
		snapshot.State = ProtectionLimitsConfigured
	}

	policyRows, err := r.pool.Query(ctx, `
		SELECT option_id, option_type, label, description
		FROM responsible_gaming_policy_options
		WHERE jurisdiction = $1 AND active
		ORDER BY option_type, created_at`, country)
	if err != nil {
		return Snapshot{}, fmt.Errorf("load responsible-gaming policy options: %w", err)
	}
	defer policyRows.Close()
	for policyRows.Next() {
		var option PolicyOptionReadModel
		var optionType string
		if err := policyRows.Scan(&option.OptionID, &optionType, &option.Label, &option.Description); err != nil {
			return Snapshot{}, fmt.Errorf("scan responsible-gaming policy option: %w", err)
		}
		if optionType == "time-out" {
			snapshot.Policy.TimeOutOptions = append(snapshot.Policy.TimeOutOptions, option)
		} else {
			snapshot.Policy.SelfExclusionOptions = append(snapshot.Policy.SelfExclusionOptions, option)
		}
	}
	if err := policyRows.Err(); err != nil {
		return Snapshot{}, fmt.Errorf("iterate responsible-gaming policy options: %w", err)
	}

	if snapshot.State != ProtectionSelfExcluded {
		snapshot.Policy.CanRequestLimitChange = true
		snapshot.Policy.CanStartTimeOut = snapshot.State != ProtectionTimeOut && len(snapshot.Policy.TimeOutOptions) > 0
		snapshot.Policy.CanSelfExclude = len(snapshot.Policy.SelfExclusionOptions) > 0
	}

	if err := snapshot.Validate(); err != nil {
		return Snapshot{}, fmt.Errorf("validate responsible-gaming snapshot: %w", err)
	}
	return snapshot, nil
}

func (r *PostgresRepository) RequestMoneyLimitChange(ctx context.Context, command RequestMoneyLimitChangeCommand) error {
	if err := command.Validate(); err != nil {
		return err
	}
	tx, err := r.pool.BeginTx(ctx, pgx.TxOptions{IsoLevel: pgx.Serializable})
	if err != nil {
		return fmt.Errorf("begin limit change: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	var current int64
	var country string
	if err := tx.QueryRow(ctx, `
		SELECT l.value_minor, p.country_code
		FROM responsible_gaming_limits l
		JOIN players p ON p.player_id = l.player_id
		WHERE l.player_id = $1 AND l.limit_id = $2 AND l.limit_type <> 'session-duration'
		FOR UPDATE`, command.PlayerID, command.LimitID).Scan(&current, &country); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrLimitNotFound
		}
		return fmt.Errorf("lock responsible-gaming limit: %w", err)
	}

	requestHash := hashRequest(fmt.Sprintf("money|%s|%d", command.LimitID, command.RequestedAmountMinor))
	duplicate, err := acceptIdempotency(ctx, tx, command.PlayerID, "rg-money-limit", command.IdempotencyKey, requestHash)
	if err != nil {
		return err
	}
	if duplicate {
		return tx.Commit(ctx)
	}

	now := r.now()
	if command.RequestedAmountMinor <= current {
		_, err = tx.Exec(ctx, `
			UPDATE responsible_gaming_limits
			SET value_minor = $3,
			    pending_value_minor = NULL,
			    pending_requested_at = NULL,
			    pending_effective_at = NULL
			WHERE player_id = $1 AND limit_id = $2`, command.PlayerID, command.LimitID, command.RequestedAmountMinor)
	} else {
		var coolingOffMinutes int64
		if err = tx.QueryRow(ctx, `SELECT limit_increase_cooling_off_minutes FROM responsible_gaming_jurisdiction_policy WHERE jurisdiction = $1`, country).Scan(&coolingOffMinutes); err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return ErrPolicyUnavailable
			}
			return fmt.Errorf("load cooling-off policy: %w", err)
		}
		effectiveAt := now.Add(time.Duration(coolingOffMinutes) * time.Minute)
		_, err = tx.Exec(ctx, `
			UPDATE responsible_gaming_limits
			SET pending_value_minor = $3,
			    pending_requested_at = $4,
			    pending_effective_at = $5
			WHERE player_id = $1 AND limit_id = $2`, command.PlayerID, command.LimitID, command.RequestedAmountMinor, now, effectiveAt)
	}
	if err != nil {
		return fmt.Errorf("update responsible-gaming limit: %w", err)
	}
	return tx.Commit(ctx)
}

func (r *PostgresRepository) StartTimeOut(ctx context.Context, command StartTimeOutCommand) error {
	if err := command.Validate(); err != nil {
		return err
	}
	return r.startRestriction(ctx, command.PlayerID, command.OptionID, command.IdempotencyKey, false)
}

func (r *PostgresRepository) StartSelfExclusion(ctx context.Context, command StartSelfExclusionCommand) error {
	if err := command.Validate(); err != nil {
		return err
	}
	return r.startRestriction(ctx, command.PlayerID, command.OptionID, command.IdempotencyKey, true)
}

func (r *PostgresRepository) startRestriction(ctx context.Context, playerID, optionID, idempotencyKey string, selfExclusion bool) error {
	tx, err := r.pool.BeginTx(ctx, pgx.TxOptions{IsoLevel: pgx.Serializable})
	if err != nil {
		return fmt.Errorf("begin protection restriction: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	var country string
	var timeoutUntil, selfUntil *time.Time
	var selfIndefinite bool
	if err := tx.QueryRow(ctx, `
		SELECT p.country_code, rg.timeout_until, rg.self_excluded_until, rg.self_excluded_indefinitely
		FROM players p
		JOIN responsible_gaming_profiles rg ON rg.player_id = p.player_id
		WHERE p.player_id = $1
		FOR UPDATE OF rg`, playerID).Scan(&country, &timeoutUntil, &selfUntil, &selfIndefinite); err != nil {
		return fmt.Errorf("lock responsible-gaming profile: %w", err)
	}

	now := r.now()
	if selfIndefinite || (selfUntil != nil && selfUntil.After(now)) {
		return ErrProtectionActive
	}
	if !selfExclusion && timeoutUntil != nil && timeoutUntil.After(now) {
		return ErrProtectionActive
	}

	optionType := "time-out"
	if selfExclusion {
		optionType = "self-exclusion"
	}
	var durationMinutes *int64
	var indefinite bool
	if err := tx.QueryRow(ctx, `
		SELECT duration_minutes, indefinite
		FROM responsible_gaming_policy_options
		WHERE option_id = $1 AND jurisdiction = $2 AND option_type = $3 AND active`, optionID, country, optionType).Scan(&durationMinutes, &indefinite); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrPolicyUnavailable
		}
		return fmt.Errorf("load responsible-gaming option: %w", err)
	}

	requestHash := hashRequest(optionType + "|" + optionID)
	duplicate, err := acceptIdempotency(ctx, tx, playerID, "rg-"+optionType, idempotencyKey, requestHash)
	if err != nil {
		return err
	}
	if duplicate {
		return tx.Commit(ctx)
	}

	var endsAt *time.Time
	if durationMinutes != nil {
		value := now.Add(time.Duration(*durationMinutes) * time.Minute)
		endsAt = &value
	}
	if selfExclusion {
		_, err = tx.Exec(ctx, `
			UPDATE responsible_gaming_profiles
			SET self_excluded_started_at = $2,
			    self_excluded_until = $3,
			    self_excluded_indefinitely = $4,
			    self_exclusion_option_id = $5,
			    updated_at = NOW()
			WHERE player_id = $1`, playerID, now, endsAt, indefinite, optionID)
	} else {
		if indefinite || endsAt == nil {
			return ErrPolicyUnavailable
		}
		_, err = tx.Exec(ctx, `
			UPDATE responsible_gaming_profiles
			SET timeout_started_at = $2,
			    timeout_until = $3,
			    timeout_option_id = $4,
			    updated_at = NOW()
			WHERE player_id = $1`, playerID, now, endsAt, optionID)
	}
	if err != nil {
		return fmt.Errorf("apply responsible-gaming restriction: %w", err)
	}
	return tx.Commit(ctx)
}

func (r *PostgresRepository) optionLabel(ctx context.Context, optionID string) string {
	if strings.TrimSpace(optionID) == "" {
		return ""
	}
	var label string
	if err := r.pool.QueryRow(ctx, `SELECT label FROM responsible_gaming_policy_options WHERE option_id = $1`, optionID).Scan(&label); err != nil {
		return ""
	}
	return label
}

func fallbackOptionID(value, fallback string) string {
	if strings.TrimSpace(value) == "" {
		return fallback
	}
	return value
}

func hashRequest(value string) string {
	digest := sha256.Sum256([]byte(value))
	return hex.EncodeToString(digest[:])
}

func acceptIdempotency(ctx context.Context, tx pgx.Tx, playerID, scope, key, requestHash string) (bool, error) {
	result, err := tx.Exec(ctx, `
		INSERT INTO idempotency_keys(player_id, scope, idempotency_key, request_hash, expires_at)
		VALUES ($1, $2, $3, $4, NOW() + INTERVAL '90 days')
		ON CONFLICT DO NOTHING`, playerID, scope, key, requestHash)
	if err != nil {
		return false, fmt.Errorf("record idempotency key: %w", err)
	}
	if result.RowsAffected() == 1 {
		return false, nil
	}
	var existingHash string
	if err := tx.QueryRow(ctx, `
		SELECT request_hash FROM idempotency_keys
		WHERE player_id = $1 AND scope = $2 AND idempotency_key = $3`, playerID, scope, key).Scan(&existingHash); err != nil {
		return false, fmt.Errorf("load idempotency key: %w", err)
	}
	if existingHash != requestHash {
		return false, ErrIdempotencyConflict
	}
	return true, nil
}

func (r *PostgresRepository) EnsureDefaultLimit(ctx context.Context, playerID string, kind MoneyLimitKind, period LimitPeriod, amountMinor int64) (string, error) {
	if amountMinor <= 0 {
		return "", fmt.Errorf("limit amount must be positive")
	}
	limitID, err := ids.New("limit")
	if err != nil {
		return "", err
	}
	_, err = r.pool.Exec(ctx, `
		INSERT INTO responsible_gaming_limits(limit_id, player_id, limit_type, period, value_minor, effective_at)
		VALUES ($1, $2, $3, $4, $5, NOW())
		ON CONFLICT (player_id, limit_type, period) DO NOTHING`, limitID, playerID, string(kind), string(period), amountMinor)
	if err != nil {
		return "", fmt.Errorf("create responsible-gaming limit: %w", err)
	}
	return limitID, nil
}
