package auth

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresStore struct {
	pool *pgxpool.Pool
}

func NewPostgresStore(pool *pgxpool.Pool) *PostgresStore {
	return &PostgresStore{pool: pool}
}

func (s *PostgresStore) CreateAccount(ctx context.Context, account NewAccount) error {
	tx, err := s.pool.BeginTx(ctx, pgx.TxOptions{IsoLevel: pgx.Serializable})
	if err != nil {
		return fmt.Errorf("begin account transaction: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	_, err = tx.Exec(ctx, `
		INSERT INTO players (
			player_id, email_lookup_hash, email_ciphertext, email_nonce, email_masked,
			display_name, country_code, age_verified, kyc_status, account_status
		) VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE, 'required', 'active')`,
		account.PlayerID,
		account.EmailLookupHash,
		account.EmailCiphertext,
		account.EmailNonce,
		account.EmailMasked,
		account.DisplayName,
		account.CountryCode,
	)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return ErrConflict
		}
		return fmt.Errorf("insert player: %w", err)
	}

	if _, err := tx.Exec(ctx, `INSERT INTO auth_credentials(player_id, password_hash) VALUES ($1, $2)`, account.PlayerID, account.PasswordHash); err != nil {
		return fmt.Errorf("insert credentials: %w", err)
	}
	if _, err := tx.Exec(ctx, `INSERT INTO wallets(wallet_id, player_id, currency) VALUES ($1, $2, 'EUR')`, account.WalletID, account.PlayerID); err != nil {
		return fmt.Errorf("insert wallet: %w", err)
	}
	if _, err := tx.Exec(ctx, `
		INSERT INTO ledger_accounts(account_id, wallet_id, account_kind, currency)
		VALUES ($1, $3, 'wallet_available', 'EUR'), ($2, $3, 'wallet_reserved', 'EUR')`,
		account.AvailableAccount,
		account.ReservedAccount,
		account.WalletID,
	); err != nil {
		return fmt.Errorf("insert wallet ledger accounts: %w", err)
	}
	if _, err := tx.Exec(ctx, `INSERT INTO kyc_verifications(player_id, status) VALUES ($1, 'not-started')`, account.PlayerID); err != nil {
		return fmt.Errorf("insert kyc state: %w", err)
	}
	if _, err := tx.Exec(ctx, `INSERT INTO responsible_gaming_profiles(player_id) VALUES ($1)`, account.PlayerID); err != nil {
		return fmt.Errorf("insert responsible-gaming state: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("commit account transaction: %w", err)
	}
	return nil
}

func (s *PostgresStore) FindCredentialByEmailHash(ctx context.Context, emailHash string) (Credential, error) {
	var credential Credential
	err := s.pool.QueryRow(ctx, `
		SELECT p.player_id, c.password_hash, p.account_status
		FROM players p
		JOIN auth_credentials c ON c.player_id = p.player_id
		WHERE p.email_lookup_hash = $1`, emailHash,
	).Scan(&credential.PlayerID, &credential.PasswordHash, &credential.AccountStatus)
	if err != nil {
		return Credential{}, err
	}
	return credential, nil
}

func (s *PostgresStore) CreateSession(ctx context.Context, session NewSession) error {
	_, err := s.pool.Exec(ctx, `
		INSERT INTO sessions (
			session_id, player_id, access_token_hash, access_expires_at,
			refresh_token_hash, refresh_expires_at, device_label, platform, ip_masked
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
		session.SessionID,
		session.PlayerID,
		session.AccessTokenHash,
		session.AccessExpiresAt,
		session.RefreshTokenHash,
		session.RefreshExpiresAt,
		session.DeviceLabel,
		session.Platform,
		session.IPMasked,
	)
	if err != nil {
		return fmt.Errorf("insert session: %w", err)
	}
	return nil
}

func (s *PostgresStore) GetSession(ctx context.Context, sessionID string) (Session, error) {
	var session Session
	var revokedAt *time.Time
	err := s.pool.QueryRow(ctx, `
		SELECT session_id, player_id, access_token_hash, access_expires_at,
		       refresh_token_hash, refresh_expires_at, refresh_generation,
		       device_label, platform, ip_masked, mfa_used, trust,
		       created_at, last_seen_at, revoked_at
		FROM sessions
		WHERE session_id = $1`, sessionID,
	).Scan(
		&session.SessionID,
		&session.PlayerID,
		&session.AccessTokenHash,
		&session.AccessExpiresAt,
		&session.RefreshTokenHash,
		&session.RefreshExpiresAt,
		&session.RefreshGeneration,
		&session.DeviceLabel,
		&session.Platform,
		&session.IPMasked,
		&session.MFAUsed,
		&session.Trust,
		&session.CreatedAt,
		&session.LastSeenAt,
		&revokedAt,
	)
	if err != nil {
		return Session{}, err
	}
	session.RevokedAt = revokedAt
	return session, nil
}

func (s *PostgresStore) RotateSession(ctx context.Context, rotation SessionRotation) error {
	result, err := s.pool.Exec(ctx, `
		UPDATE sessions
		SET access_token_hash = $4,
		    access_expires_at = $5,
		    refresh_token_hash = $6,
		    refresh_expires_at = $7,
		    refresh_generation = $8,
		    last_seen_at = NOW()
		WHERE session_id = $1
		  AND revoked_at IS NULL
		  AND refresh_token_hash = $2
		  AND refresh_generation = $3`,
		rotation.SessionID,
		rotation.ExpectedRefreshTokenHash,
		rotation.ExpectedGeneration,
		rotation.AccessTokenHash,
		rotation.AccessExpiresAt,
		rotation.RefreshTokenHash,
		rotation.RefreshExpiresAt,
		rotation.Generation,
	)
	if err != nil {
		return fmt.Errorf("rotate session: %w", err)
	}
	if result.RowsAffected() != 1 {
		return ErrInvalidToken
	}
	return nil
}

func (s *PostgresStore) RevokeSession(ctx context.Context, sessionID, reason string) error {
	_, err := s.pool.Exec(ctx, `
		UPDATE sessions
		SET revoked_at = COALESCE(revoked_at, NOW()), revoke_reason = CASE WHEN revoke_reason = '' THEN $2 ELSE revoke_reason END
		WHERE session_id = $1`, sessionID, reason,
	)
	if err != nil {
		return fmt.Errorf("revoke session: %w", err)
	}
	return nil
}

func (s *PostgresStore) TouchSession(ctx context.Context, sessionID string, seenAt time.Time) error {
	cutoff := seenAt.Add(-time.Minute)
	_, err := s.pool.Exec(ctx, `
		UPDATE sessions
		SET last_seen_at = $2
		WHERE session_id = $1 AND revoked_at IS NULL AND last_seen_at < $3`, sessionID, seenAt, cutoff,
	)
	if err != nil {
		return fmt.Errorf("touch session: %w", err)
	}
	return nil
}
