package security

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresRepository(pool *pgxpool.Pool) *PostgresRepository {
	return &PostgresRepository{pool: pool}
}

func (r *PostgresRepository) GetSnapshot(ctx context.Context, playerID, currentSessionID string) (Snapshot, error) {
	snapshot := Snapshot{
		Availability: AvailabilityReady,
		PlayerID:     playerID,
		MFAStatus:    MFAStatusDisabled,
	}

	var hasActiveMFA bool
	if err := r.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM mfa_factors WHERE player_id = $1 AND status = 'active')`, playerID).Scan(&hasActiveMFA); err != nil {
		return Snapshot{}, fmt.Errorf("load mfa state: %w", err)
	}
	if hasActiveMFA {
		snapshot.MFAStatus = MFAStatusEnabled
	}

	rows, err := r.pool.Query(ctx, `
		SELECT s.session_id,
		       s.device_label,
		       s.platform,
		       s.ip_masked,
		       p.country_code,
		       s.mfa_used,
		       s.trust,
		       s.created_at,
		       s.last_seen_at,
		       s.revoked_at IS NOT NULL AS revoked
		FROM sessions s
		JOIN players p ON p.player_id = s.player_id
		WHERE s.player_id = $1
		ORDER BY s.last_seen_at DESC
		LIMIT 50`, playerID)
	if err != nil {
		return Snapshot{}, fmt.Errorf("load sessions: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var session SessionReadModel
		var revoked bool
		if err := rows.Scan(
			&session.SessionID,
			&session.DeviceLabel,
			&session.Platform,
			&session.IPMasked,
			&session.CountryCode,
			&session.MFAUsed,
			&session.Trust,
			&session.CreatedAt,
			&session.LastSeenAt,
			&revoked,
		); err != nil {
			return Snapshot{}, fmt.Errorf("scan session: %w", err)
		}
		session.PlayerID = playerID
		session.Current = session.SessionID == currentSessionID && !revoked
		session.Status = SessionStatusActive
		if revoked {
			session.Status = SessionStatusRevoked
		}
		snapshot.Sessions = append(snapshot.Sessions, session)
	}
	if err := rows.Err(); err != nil {
		return Snapshot{}, fmt.Errorf("iterate sessions: %w", err)
	}
	if err := snapshot.Validate(); err != nil {
		return Snapshot{}, fmt.Errorf("validate security snapshot: %w", err)
	}
	return snapshot, nil
}

func (r *PostgresRepository) RevokeSession(ctx context.Context, playerID, sessionID string) (bool, error) {
	result, err := r.pool.Exec(ctx, `
		UPDATE sessions
		SET revoked_at = COALESCE(revoked_at, NOW()),
		    revoke_reason = CASE WHEN revoke_reason = '' THEN 'player-security-center' ELSE revoke_reason END
		WHERE session_id = $1 AND player_id = $2`, sessionID, playerID)
	if err != nil {
		return false, fmt.Errorf("revoke owned session: %w", err)
	}
	return result.RowsAffected() == 1, nil
}

func (r *PostgresRepository) RevokeOtherSessions(ctx context.Context, playerID, currentSessionID string) error {
	_, err := r.pool.Exec(ctx, `
		UPDATE sessions
		SET revoked_at = COALESCE(revoked_at, NOW()),
		    revoke_reason = CASE WHEN revoke_reason = '' THEN 'player-revoke-other-sessions' ELSE revoke_reason END
		WHERE player_id = $1 AND session_id <> $2 AND revoked_at IS NULL`, playerID, currentSessionID)
	if err != nil {
		return fmt.Errorf("revoke other sessions: %w", err)
	}
	return nil
}
