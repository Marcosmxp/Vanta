CREATE TABLE players (
    player_id TEXT PRIMARY KEY,
    email_lookup_hash CHAR(64) NOT NULL UNIQUE,
    email_ciphertext BYTEA NOT NULL,
    email_nonce BYTEA NOT NULL,
    email_masked TEXT NOT NULL,
    phone_masked TEXT NOT NULL DEFAULT '',
    display_name TEXT NOT NULL,
    country_code CHAR(2) NOT NULL,
    age_verified BOOLEAN NOT NULL DEFAULT FALSE,
    kyc_status TEXT NOT NULL DEFAULT 'required' CHECK (kyc_status IN ('verified', 'pending', 'required', 'rejected')),
    account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'restricted', 'blocked')),
    language TEXT NOT NULL DEFAULT 'pt-PT' CHECK (language IN ('pt-PT', 'en')),
    marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE auth_credentials (
    player_id TEXT PRIMARY KEY REFERENCES players(player_id) ON DELETE CASCADE,
    password_hash BYTEA NOT NULL,
    password_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    failed_attempts INTEGER NOT NULL DEFAULT 0 CHECK (failed_attempts >= 0),
    locked_until TIMESTAMPTZ
);

CREATE TABLE sessions (
    session_id TEXT PRIMARY KEY,
    player_id TEXT NOT NULL REFERENCES players(player_id) ON DELETE CASCADE,
    access_token_hash CHAR(64) NOT NULL UNIQUE,
    access_expires_at TIMESTAMPTZ NOT NULL,
    refresh_token_hash CHAR(64) NOT NULL UNIQUE,
    refresh_expires_at TIMESTAMPTZ NOT NULL,
    refresh_generation BIGINT NOT NULL DEFAULT 1 CHECK (refresh_generation > 0),
    device_label TEXT NOT NULL DEFAULT 'Unknown device',
    platform TEXT NOT NULL DEFAULT 'unknown',
    ip_masked TEXT NOT NULL DEFAULT '',
    mfa_used BOOLEAN NOT NULL DEFAULT FALSE,
    trust TEXT NOT NULL DEFAULT 'unrecognized' CHECK (trust IN ('trusted', 'unrecognized')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ,
    revoke_reason TEXT NOT NULL DEFAULT ''
);
CREATE INDEX sessions_player_active_idx ON sessions(player_id, last_seen_at DESC) WHERE revoked_at IS NULL;

CREATE TABLE wallets (
    wallet_id TEXT PRIMARY KEY,
    player_id TEXT NOT NULL UNIQUE REFERENCES players(player_id) ON DELETE RESTRICT,
    currency CHAR(3) NOT NULL DEFAULT 'EUR' CHECK (currency = 'EUR'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ledger_accounts (
    account_id TEXT PRIMARY KEY,
    wallet_id TEXT REFERENCES wallets(wallet_id) ON DELETE RESTRICT,
    account_kind TEXT NOT NULL CHECK (account_kind IN (
        'wallet_available', 'wallet_reserved', 'house_cash', 'house_revenue',
        'payment_clearing', 'betting_clearing', 'adjustment_clearing'
    )),
    currency CHAR(3) NOT NULL DEFAULT 'EUR' CHECK (currency = 'EUR'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE NULLS NOT DISTINCT (wallet_id, account_kind, currency)
);

CREATE TABLE ledger_transactions (
    transaction_id TEXT PRIMARY KEY,
    player_id TEXT REFERENCES players(player_id) ON DELETE RESTRICT,
    kind TEXT NOT NULL CHECK (kind IN ('deposit', 'withdrawal', 'wager', 'payout', 'refund', 'adjustment', 'reserve', 'release')),
    reference_id TEXT NOT NULL DEFAULT '',
    idempotency_key TEXT,
    description TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE NULLS NOT DISTINCT (player_id, idempotency_key)
);
CREATE INDEX ledger_transactions_player_idx ON ledger_transactions(player_id, created_at DESC);

CREATE TABLE ledger_entries (
    entry_id TEXT PRIMARY KEY,
    transaction_id TEXT NOT NULL REFERENCES ledger_transactions(transaction_id) ON DELETE RESTRICT,
    account_id TEXT NOT NULL REFERENCES ledger_accounts(account_id) ON DELETE RESTRICT,
    amount_minor BIGINT NOT NULL CHECK (amount_minor <> 0),
    currency CHAR(3) NOT NULL DEFAULT 'EUR' CHECK (currency = 'EUR'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ledger_entries_transaction_idx ON ledger_entries(transaction_id);
CREATE INDEX ledger_entries_account_idx ON ledger_entries(account_id, created_at DESC);

CREATE OR REPLACE FUNCTION prevent_ledger_mutation() RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'ledger records are immutable';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ledger_transactions_immutable
BEFORE UPDATE OR DELETE ON ledger_transactions
FOR EACH ROW EXECUTE FUNCTION prevent_ledger_mutation();

CREATE TRIGGER ledger_entries_immutable
BEFORE UPDATE OR DELETE ON ledger_entries
FOR EACH ROW EXECUTE FUNCTION prevent_ledger_mutation();

CREATE OR REPLACE FUNCTION enforce_balanced_ledger_transaction() RETURNS TRIGGER AS $$
DECLARE
    entry_count BIGINT;
    entry_sum BIGINT;
BEGIN
    SELECT COUNT(*), COALESCE(SUM(amount_minor), 0)
      INTO entry_count, entry_sum
      FROM ledger_entries
     WHERE transaction_id = NEW.transaction_id;

    IF entry_count < 2 OR entry_sum <> 0 THEN
        RAISE EXCEPTION 'ledger transaction % must contain at least two entries and sum to zero', NEW.transaction_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER ledger_transaction_balanced
AFTER INSERT ON ledger_entries
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION enforce_balanced_ledger_transaction();

CREATE TABLE bets (
    bet_id TEXT PRIMARY KEY,
    player_id TEXT NOT NULL REFERENCES players(player_id) ON DELETE RESTRICT,
    wallet_id TEXT NOT NULL REFERENCES wallets(wallet_id) ON DELETE RESTRICT,
    game TEXT NOT NULL CHECK (game IN ('plinko')),
    status TEXT NOT NULL CHECK (status IN ('accepted', 'settled', 'voided')),
    stake_minor BIGINT NOT NULL CHECK (stake_minor > 0),
    payout_minor BIGINT CHECK (payout_minor IS NULL OR payout_minor >= 0),
    multiplier_bps BIGINT CHECK (multiplier_bps IS NULL OR multiplier_bps >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'EUR' CHECK (currency = 'EUR'),
    ruleset_id TEXT NOT NULL,
    ruleset_version TEXT NOT NULL,
    rows INTEGER,
    risk TEXT CHECK (risk IS NULL OR risk IN ('low', 'medium', 'high')),
    slot INTEGER,
    idempotency_key TEXT NOT NULL,
    placed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    settled_at TIMESTAMPTZ,
    UNIQUE (player_id, idempotency_key)
);
CREATE INDEX bets_player_idx ON bets(player_id, placed_at DESC);

CREATE TABLE kyc_verifications (
    player_id TEXT PRIMARY KEY REFERENCES players(player_id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT '',
    provider_reference TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'not-started' CHECK (status IN ('not-started', 'document-required', 'selfie-required', 'processing', 'approved', 'rejected')),
    rejection_code TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE responsible_gaming_profiles (
    player_id TEXT PRIMARY KEY REFERENCES players(player_id) ON DELETE CASCADE,
    timeout_until TIMESTAMPTZ,
    self_excluded_until TIMESTAMPTZ,
    self_excluded_indefinitely BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE responsible_gaming_limits (
    limit_id TEXT PRIMARY KEY,
    player_id TEXT NOT NULL REFERENCES players(player_id) ON DELETE CASCADE,
    limit_type TEXT NOT NULL CHECK (limit_type IN ('deposit', 'net-loss', 'wager', 'session-duration')),
    period TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'session')),
    value_minor BIGINT,
    value_minutes INTEGER,
    effective_at TIMESTAMPTZ NOT NULL,
    pending_value_minor BIGINT,
    pending_value_minutes INTEGER,
    pending_effective_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (player_id, limit_type, period),
    CHECK ((value_minor IS NOT NULL) <> (value_minutes IS NOT NULL))
);

CREATE TABLE payment_intents (
    intent_id TEXT PRIMARY KEY,
    player_id TEXT NOT NULL REFERENCES players(player_id) ON DELETE RESTRICT,
    wallet_id TEXT NOT NULL REFERENCES wallets(wallet_id) ON DELETE RESTRICT,
    direction TEXT NOT NULL CHECK (direction IN ('deposit', 'withdrawal')),
    status TEXT NOT NULL CHECK (status IN ('requires_action', 'processing', 'succeeded', 'failed', 'cancelled')),
    amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
    currency CHAR(3) NOT NULL DEFAULT 'EUR' CHECK (currency = 'EUR'),
    method_token TEXT NOT NULL DEFAULT '',
    provider_reference TEXT NOT NULL DEFAULT '',
    idempotency_key TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (player_id, idempotency_key)
);

CREATE TABLE support_requests (
    request_id TEXT PRIMARY KEY,
    player_id TEXT NOT NULL REFERENCES players(player_id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    message_ciphertext BYTEA NOT NULL,
    message_nonce BYTEA NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'waiting-player', 'resolved', 'closed')),
    idempotency_key TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (player_id, idempotency_key)
);
CREATE INDEX support_requests_player_idx ON support_requests(player_id, updated_at DESC);

CREATE TABLE legal_documents (
    document_id TEXT PRIMARY KEY,
    kind TEXT NOT NULL,
    title TEXT NOT NULL,
    version TEXT NOT NULL,
    body_markdown TEXT NOT NULL,
    content_sha256 CHAR(64) NOT NULL,
    effective_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (kind, version)
);

CREATE TABLE idempotency_keys (
    player_id TEXT NOT NULL REFERENCES players(player_id) ON DELETE CASCADE,
    scope TEXT NOT NULL,
    idempotency_key TEXT NOT NULL,
    request_hash CHAR(64) NOT NULL,
    response_code INTEGER,
    response_body BYTEA,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (player_id, scope, idempotency_key)
);

CREATE TABLE outbox_events (
    event_id TEXT PRIMARY KEY,
    aggregate_type TEXT NOT NULL,
    aggregate_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ
);
CREATE INDEX outbox_unpublished_idx ON outbox_events(created_at) WHERE published_at IS NULL;

CREATE TABLE audit_events (
    audit_id TEXT PRIMARY KEY,
    player_id TEXT REFERENCES players(player_id) ON DELETE SET NULL,
    actor_type TEXT NOT NULL CHECK (actor_type IN ('player', 'system', 'admin')),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    request_id TEXT NOT NULL DEFAULT '',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX audit_events_player_idx ON audit_events(player_id, created_at DESC);
