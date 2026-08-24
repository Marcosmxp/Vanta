CREATE TABLE mfa_factors (
    factor_id TEXT PRIMARY KEY,
    player_id TEXT NOT NULL REFERENCES players(player_id) ON DELETE CASCADE,
    factor_type TEXT NOT NULL CHECK (factor_type IN ('totp', 'passkey')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'revoked')),
    secret_ciphertext BYTEA,
    secret_nonce BYTEA,
    credential_public_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    CHECK (
        (factor_type = 'totp' AND secret_ciphertext IS NOT NULL AND secret_nonce IS NOT NULL)
        OR (factor_type = 'passkey' AND credential_public_data IS NOT NULL)
    )
);
CREATE INDEX mfa_factors_player_active_idx ON mfa_factors(player_id) WHERE status = 'active';
