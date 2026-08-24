package profile

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

func (r *PostgresRepository) Get(ctx context.Context, playerID string) (Snapshot, error) {
	var snapshot Snapshot
	var ageVerified bool
	var marketingOptIn bool
	var protection string

	err := r.pool.QueryRow(ctx, `
		SELECT p.player_id,
		       p.display_name,
		       p.email_masked,
		       p.phone_masked,
		       p.country_code,
		       p.created_at,
		       p.age_verified,
		       p.kyc_status,
		       p.account_status,
		       p.language,
		       p.marketing_opt_in,
		       CASE
		         WHEN rg.self_excluded_indefinitely
		           OR rg.self_excluded_until > NOW()
		           OR rg.timeout_until > NOW() THEN 'restricted'
		         WHEN EXISTS(SELECT 1 FROM responsible_gaming_limits l WHERE l.player_id = p.player_id) THEN 'limits-configured'
		         ELSE 'standard'
		       END AS protection_status
		FROM players p
		JOIN responsible_gaming_profiles rg ON rg.player_id = p.player_id
		WHERE p.player_id = $1`, playerID,
	).Scan(
		&snapshot.Identity.PlayerID,
		&snapshot.Identity.DisplayName,
		&snapshot.Identity.EmailMasked,
		&snapshot.Identity.PhoneMasked,
		&snapshot.Identity.CountryCode,
		&snapshot.Identity.MemberSince,
		&ageVerified,
		&snapshot.Verification.KYCStatus,
		&snapshot.Verification.AccountStatus,
		&snapshot.Preferences.Language,
		&marketingOptIn,
		&protection,
	)
	if err != nil {
		return Snapshot{}, fmt.Errorf("load profile: %w", err)
	}

	snapshot.Availability = AvailabilityReady
	snapshot.Verification.AgeVerified = &ageVerified
	snapshot.Preferences.MarketingOptIn = &marketingOptIn
	snapshot.Preferences.ProtectionStatus = ProtectionStatus(protection)
	if err := snapshot.Validate(); err != nil {
		return Snapshot{}, fmt.Errorf("validate profile read model: %w", err)
	}
	return snapshot, nil
}
