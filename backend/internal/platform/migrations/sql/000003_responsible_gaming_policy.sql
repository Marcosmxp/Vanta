ALTER TABLE responsible_gaming_profiles
    ADD COLUMN timeout_started_at TIMESTAMPTZ,
    ADD COLUMN timeout_option_id TEXT NOT NULL DEFAULT '',
    ADD COLUMN self_excluded_started_at TIMESTAMPTZ,
    ADD COLUMN self_exclusion_option_id TEXT NOT NULL DEFAULT '';

ALTER TABLE responsible_gaming_limits
    ADD COLUMN pending_requested_at TIMESTAMPTZ;

CREATE TABLE responsible_gaming_policy_options (
    option_id TEXT PRIMARY KEY,
    jurisdiction CHAR(2) NOT NULL,
    option_type TEXT NOT NULL CHECK (option_type IN ('time-out', 'self-exclusion')),
    label TEXT NOT NULL,
    description TEXT NOT NULL,
    duration_minutes BIGINT,
    indefinite BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK ((duration_minutes IS NOT NULL AND duration_minutes > 0) OR indefinite),
    CHECK (NOT (duration_minutes IS NOT NULL AND indefinite))
);
CREATE INDEX responsible_gaming_policy_options_lookup_idx
    ON responsible_gaming_policy_options(jurisdiction, option_type)
    WHERE active;
