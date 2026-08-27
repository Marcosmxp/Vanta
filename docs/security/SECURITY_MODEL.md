# Vanta — Security Model

**Status:** canonical security-model summary for the current Vanta architecture.  
**Scope:** trust boundaries, assets, security invariants, implemented controls and production gaps.  
**Detailed evidence:** see `SECURITY.md`, `docs/security/phase19-security-audit.md`, `docs/security/phase20-security-architecture.md`, `docs/security/session-device-security-roadmap.md` and `docs/architecture/game-math-financial-risk-engine.md`.

## 1. Security objective

Vanta is a security-sensitive financial/gaming system. The primary security objective is to prevent an untrusted client, compromised session, malformed request, provider failure or operator mistake from silently gaining authority over player identity, funds, Responsible Gaming state, game outcomes, settlement or regulated decisions.

## 2. Trust boundaries

```text
Untrusted mobile client
        ↓ HTTPS outside development
Go API / authorization boundary
        ↓
Domain/application services
        ↓
Repositories / financial services
        ↓
PostgreSQL — canonical persistent truth

Redis — ephemeral only
External providers — untrusted integration boundary until verified
```

Permanent rules:
- mobile code and state are never authority for money, authorization, KYC approval, Responsible Gaming enforcement or game settlement;
- PostgreSQL is canonical persistent financial/regulatory truth;
- Redis may support throttling/cache/coordination but is never financial truth;
- route visibility is not authorization;
- production provider responses/callbacks require independent verification, authentication and replay/idempotency controls.

## 3. Protected assets

Highest-value assets include:
- player accounts and session credentials;
- PII and KYC-related data;
- wallet and ledger state;
- payment intent/reconciliation state;
- Responsible Gaming controls;
- game rulesets, RNG/outcome and settlement integrity;
- production signing material and secrets;
- audit/security evidence;
- administrative or future provider credentials.

## 4. Authentication and sessions

Current foundations:
- bcrypt password hashing;
- opaque random access/refresh credentials;
- only token hashes persisted server-side;
- short-lived access token policy;
- rotating refresh credentials;
- replay/race-sensitive refresh handling;
- server-side session revocation;
- authentication throttling;
- mobile persistence through secure platform storage.

Expected normal flow:

```text
login
→ secure session persistence
→ access token expires
→ silent refresh
→ rotated session continues
```

A revoked or expired refresh session must fail closed and require authentication.

Production gaps:
- final idle/absolute lifetime policy;
- MFA/passkeys and recovery;
- step-up authentication for sensitive operations;
- device/new-login risk and alerts;
- complete high-risk security-event revocation policy.

## 5. Authorization

`authenticated != authorized`.

Every protected resource must verify ownership/permission server-side. Client-supplied identifiers must never be sufficient proof of access.

High-risk future boundaries include:
- withdrawals;
- account/security changes;
- KYC/provider operations;
- administration;
- payment callbacks;
- game/risk configuration.

## 6. Data protection

Current implementation includes encrypted storage plus keyed lookup protection for selected PII and encrypted support-message content. Real keys must never be committed and staging/production keys must come from managed secret storage.

Do not log or expose:
- passwords;
- access/refresh tokens;
- OTP/recovery codes;
- private keys/provider secrets;
- raw identity documents;
- full payment credentials;
- sensitive support/PII payloads.

`EXPO_PUBLIC_*` configuration is public by definition and must contain no secret.

## 7. Financial integrity

Financial state is server-authoritative.

Ledger requirements:
- double-entry;
- balanced transaction;
- immutable historical entries;
- idempotent mutation boundaries;
- auditable reference linkage;
- no balance mutation based only on client state.

Payment UI or intent objects do not authorize real money movement. Production payment flows remain blocked until provider verification, reconciliation and operational controls exist.

## 8. Game integrity

The operator advantage must come from approved mathematics, not player-specific outcome manipulation.

Production wager flow must validate, before authoritative outcome/settlement:
- authentication and authorization;
- jurisdiction/KYC eligibility as applicable;
- Responsible Gaming restrictions;
- balance/reservation;
- approved ruleset/math version;
- stake/payout/exposure limits;
- idempotency;
- authoritative outcome generation;
- ledger settlement/audit.

Historical bets must remain linked to exact ruleset/math metadata.

## 9. Responsible Gaming

Responsible Gaming controls are authoritative server-side constraints. The mobile client may present/change allowed controls but cannot weaken an active restriction by modifying local state.

Jurisdiction-specific behavior must come from verified policy/configuration, not assumptions in client copy.

## 10. API and input boundaries

Server boundaries should preserve:
- strict request validation;
- body-size limits;
- consistent error handling;
- ownership/authorization checks;
- rate limiting where abuse risk exists;
- `no-store` for sensitive responses where applicable;
- secure transport outside development;
- request IDs/auditability.

CORS, proxy/client-IP trust and public exposure must be configured per deployed environment rather than copied blindly from local development.

## 11. Supply chain and release security

Required controls:
- deterministic dependency lockfiles;
- frozen installs in CI/native builds;
- dependency/vulnerability scanning;
- CodeQL;
- build provenance;
- artifact/config inspection;
- protected production signing material;
- no debug/dev configuration in production artifacts;
- protected release/tag workflow.

Known open release-security work is tracked in `docs/project/BACKLOG.md`.

## 12. Logging and audit

Security-relevant logs should identify event, result, request ID and safe resource identifiers without recording credentials or sensitive payloads.

The database already includes an `audit_events` boundary. Production audit policy, retention, access and export procedures require operational definition before launch.

## 13. Production blockers

Production real-money operation remains blocked until applicable controls are evidenced, including:
- managed secrets/KMS and protected signing;
- final auth/session/MFA/step-up controls;
- production KYC/AML integration;
- production payment/reconciliation flow;
- jurisdiction/legal configuration;
- approved game math/bankroll/exposure model;
- fraud/risk monitoring;
- backup/restore and incident-response readiness;
- production observability;
- independent security assessment.

## 14. Security change control

Changes to authentication, authorization, sessions, cryptography, secrets, payments, ledger, database integrity, provider callbacks, Responsible Gaming or game outcome/settlement require an explicit security review and relevant regression tests.

A green CI run is necessary evidence, not proof of production security or regulatory compliance.
