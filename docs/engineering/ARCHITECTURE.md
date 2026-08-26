# Vanta — Engineering Architecture

**Status:** canonical engineering architecture summary.

This document describes the current implemented architecture. Detailed domain specifications remain in `docs/architecture/`, `docs/security/`, current code and migrations.

## System shape

```text
Native mobile client
React Native + Expo + TypeScript
        ↓ HTTP API
Go modular monolith
        ↓
application/domain services
        ↓
repositories/persistence
        ↓
PostgreSQL

Redis → ephemeral cache / rate limiting / coordination only
```

Repository responsibilities:

- `apps/mobile/` — native player application;
- `backend/` — server-authoritative Go application;
- `packages/` — shared non-secret contracts/artifacts;
- `infrastructure/` — local/runtime infrastructure configuration;
- `scripts/` — development/release automation;
- `docs/` — durable product/engineering/security/operations knowledge.

## Core invariants

- Mobile is untrusted.
- Authentication and authorization are server-authoritative.
- Financial, gaming, KYC, Responsible Gaming and regulated decisions are server-authoritative.
- PostgreSQL is canonical persistent financial/regulatory truth.
- Redis is never financial truth.
- Ledger history is append-oriented, immutable and auditable.
- Game outcome, wager acceptance, payout and settlement cannot be decided by the mobile UI.
- Sensitive production capabilities stay fail-closed while prerequisites are missing.
- Keep the modular monolith unless independent operational/scaling evidence justifies a different deployment boundary.

## Mobile architecture

`apps/mobile/src` is organized as:

- `app/` — application composition/configuration/providers;
- `core/` — API, query, session, localization, security and system-state concerns;
- `design-system/` — reusable visual primitives/tokens;
- `features/` — player/domain journeys;
- `types/` — shared mobile declarations.

The mobile application may present and format server state, but it must not become authority for balances, authorization, KYC approval, Responsible Gaming eligibility, game outcome or payment completion.

API/external data should be normalized at the boundary before screens consume it. Player-facing copy belongs in the localization system.

## Backend architecture

The backend is a Go modular monolith under `backend/internal` with domain/platform packages for identity, player/profile, wallet, betting, games, KYC, payments, Responsible Gaming, support, compliance/legal, health, integration tests and cross-cutting platform concerns.

The HTTP layer authenticates and validates transport concerns, then delegates to application/domain services. Domain code owns rules. Repositories own persistence. Cross-domain shortcuts must not bypass authorization, ledger, idempotency or policy invariants.

## Persistence architecture

PostgreSQL stores canonical player, credential/session, wallet/ledger, betting, KYC, Responsible Gaming, payment-intent, support, legal, idempotency, outbox and audit state.

Schema evolution is versioned through SQL migrations under `backend/internal/platform/migrations/sql`.

The current migration runner:

- embeds ordered SQL files;
- takes a PostgreSQL advisory lock;
- tracks versions in `schema_migrations`;
- runs one transaction per migration;
- executes before the API accepts traffic.

This is acceptable for the current development/alpha runtime. **Before production, migration execution must be deliberately reviewed and separated or controlled as part of the deployment process if required by the chosen infrastructure/rollback model.**

## Sessions

Current foundation:

```text
login/register
→ opaque access + refresh credentials
→ server stores token hashes
→ mobile SecureStore persistence
→ short-lived access token
→ rotating refresh token
→ server revocation/replay protection
```

Routine app restart should restore a valid session. Access expiry should use silent refresh. Expired/revoked refresh state returns the player to authentication.

Schema support for MFA/passkeys does not mean production MFA/passkey flows are complete.

## External providers

Provider-facing KYC/payment foundations exist, but production providers are not considered active until integration, security, reconciliation, observability and regulatory gates are complete.

## Environments

The proven runtime today is local/development plus CI/native alpha build validation. Staging and production architecture remain production-readiness work and must not be invented in documentation before provider/hosting decisions are made.

## Architecture change rule

Do not introduce microservices, new databases, alternate auth platforms, queues, orchestration platforms or a different package manager solely by preference. Significant architecture changes require evidence, an ADR, compatibility/security/operational analysis and human approval.

## References

- `AGENTS.md`
- `docs/architecture/README.md`
- `docs/architecture/backend-runtime-phase17.md`
- `docs/architecture/mobile-backend-integration.md`
- `docs/architecture/game-math-financial-risk-engine.md`
- `docs/security/phase20-security-architecture.md`
- `backend/README.md`
