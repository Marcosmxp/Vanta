# Vanta — Database

**Status:** canonical database engineering summary.

## Technology and authority

- Primary persistent database: PostgreSQL.
- Redis is ephemeral only and is not financial or regulatory truth.
- Database access is owned by the backend; the mobile app never connects directly.
- No ORM is currently used. The backend uses Go/pgx, repositories and explicit SQL.

## Current schema domains

The current migration set establishes tables for:

### Identity/account

- `players`
- `auth_credentials`
- `sessions`
- `mfa_factors`

### Financial

- `wallets`
- `ledger_accounts`
- `ledger_transactions`
- `ledger_entries`
- `payment_intents`

### Gaming

- `bets`

### Verification / protection

- `kyc_verifications`
- `responsible_gaming_profiles`
- `responsible_gaming_limits`
- `responsible_gaming_jurisdiction_policy`
- `responsible_gaming_policy_options`

### Support/legal

- `support_requests`
- `support_topics`
- `support_channels`
- `legal_documents`
- `legal_disclosures`

### Platform integrity

- `idempotency_keys`
- `outbox_events`
- `audit_events`
- `schema_migrations`

## Financial invariants

- Money uses integer minor units (`BIGINT`), not floating-point arithmetic.
- Wallet balance is derived from ledger accounts/entries, not a mutable `players.balance` field.
- Ledger transactions and entries are immutable through database triggers.
- A ledger transaction must contain at least two entries and sum to zero.
- Financial mutation requires idempotency at the appropriate boundary.
- PostgreSQL remains canonical even when caches/projections exist.

## Referential integrity

Foreign keys and restrictive/cascade deletion behavior are used deliberately depending on the domain. Financial records generally favor retention/restriction; account/session/profile data may use cascades where the current schema explicitly defines them.

Do not change deletion semantics without evaluating audit, retention, privacy and financial requirements.

## Indexes

Current migrations include indexes for active sessions, ledger history, ledger entries, player bet history, support requests, Responsible Gaming policy lookup, support configuration, outbox processing and audit history.

New indexes should be driven by measured/query-plan need. Do not add indexes speculatively to every column.

## Migrations

Canonical migration location:

`backend/internal/platform/migrations/sql/`

Current sequence:

- `000001_core_schema.sql`
- `000002_identity_security.sql`
- `000003_responsible_gaming_policy.sql`
- `000004_support_legal_configuration.sql`

Rules:

1. schema changes are versioned and reproducible;
2. never rewrite an already-applied migration for cosmetic reasons;
3. prefer additive/backward-compatible changes when possible;
4. destructive changes require explicit impact/rollback/data-migration analysis;
5. production migrations require human approval and a controlled deployment plan;
6. do not use manual production SQL as a substitute for versioned schema evolution.

## Current migration runner

The Go runner uses embedded SQL, a PostgreSQL advisory lock, `schema_migrations`, ordered numeric filenames and one transaction per migration. Pending migrations currently run before API traffic is accepted.

### Production decision required

`DECISION REQUIRED`: before production, define the deployment-specific migration strategy, including:

- whether migrations execute as a dedicated release job;
- backward/forward compatibility expectations;
- rollback policy;
- data migration procedure;
- backup/restore prerequisites;
- validation after migration.

## Locale schema debt

Current `players.language` constraint still reflects an older locale set. The mobile localization set is broader. Do not patch the constraint casually; first define whether language preference is device-local, account-synchronized or both, then introduce a compatible migration.

## Backup/restore

A formal production backup/restore policy is not yet established. This is a production-readiness blocker and belongs in operations documentation once the production database provider is selected.

## References

- `backend/internal/platform/migrations/runner.go`
- `backend/internal/platform/migrations/sql/`
- `docs/engineering/ARCHITECTURE.md`
- `docs/security/`
- `docs/project/RISKS.md`
