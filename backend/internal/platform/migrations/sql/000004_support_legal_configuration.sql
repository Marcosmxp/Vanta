CREATE TABLE legal_disclosures (
    jurisdiction CHAR(2) PRIMARY KEY,
    operator_legal_name TEXT NOT NULL DEFAULT '',
    operator_contact TEXT NOT NULL DEFAULT '',
    operator_address TEXT NOT NULL DEFAULT '',
    licensing_status TEXT NOT NULL DEFAULT 'unconfigured' CHECK (licensing_status IN ('unconfigured', 'pending', 'licensed')),
    regulator_name TEXT NOT NULL,
    regulator_url TEXT NOT NULL,
    license_references JSONB NOT NULL DEFAULT '[]'::jsonb,
    license_notice TEXT NOT NULL,
    complaints_document_id TEXT NOT NULL,
    controller_name TEXT NOT NULL,
    privacy_contact TEXT NOT NULL,
    dpo_contact TEXT NOT NULL DEFAULT '',
    supervisory_authority_name TEXT NOT NULL,
    supervisory_authority_url TEXT NOT NULL,
    privacy_document_id TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE support_topics (
    topic_id TEXT PRIMARY KEY,
    jurisdiction CHAR(2) NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX support_topics_active_idx ON support_topics(jurisdiction, sort_order) WHERE active;

CREATE TABLE support_channels (
    channel_id TEXT PRIMARY KEY,
    jurisdiction CHAR(2) NOT NULL,
    channel_type TEXT NOT NULL CHECK (channel_type IN ('in-app', 'email', 'phone', 'web')),
    label TEXT NOT NULL,
    target TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX support_channels_active_idx ON support_channels(jurisdiction, sort_order) WHERE active;
