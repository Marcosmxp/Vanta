# Vanta — External Services Register

**Rule:** never record credentials, API keys, private URLs containing secrets or customer data here.

## Current development/build services

| Service | Purpose | Environment | Criticality | Failure impact | Notes |
|---|---|---|---|---|---|
| GitHub | source repository, PRs, version history | Development | High | collaboration/release workflow blocked | source of repository history |
| GitHub Actions | CI, CodeQL, Android native artifact | Development/Release | High | validation/build delayed | not runtime financial authority |
| Expo / EAS | React Native tooling and configured native build profiles | Development/Preview/Future production | Medium/High | native build/distribution affected | production distribution policy still pending |
| npm/pnpm registry ecosystem | JavaScript dependency retrieval | Build | High | clean install/build unavailable | lockfile + frozen install reduce drift |
| Go module ecosystem | Go dependency retrieval | Build | High | clean backend build unavailable | `go.mod`/`go.sum` canonical |
| Docker image registries | PostgreSQL/Redis/build base image retrieval | Development/Build | Medium | clean environment/build may fail | pin/review image versions |

## Current runtime dependencies

### PostgreSQL
- Purpose: canonical persistent application/financial/regulatory truth.
- Current: local Docker PostgreSQL 18.
- Production provider: `UNKNOWN / DECISION REQUIRED`.
- Criticality: Critical.
- Failure impact: API readiness/core operations unavailable.

### Redis
- Purpose: ephemeral throttling/cache/coordination only.
- Current: local Docker Redis.
- Production provider: `UNKNOWN / DECISION REQUIRED`.
- Criticality: High for boundaries configured to fail closed, but never financial truth.

## Regulated providers not yet selected

### KYC / AML provider
- Status: `NOT SELECTED / PRODUCTION BLOCKED`.
- Future review: identity coverage, jurisdiction support, security, webhook authenticity/replay protection, privacy/data residency, cost, SLA, retention/deletion.

### Payment service provider / banking rails
- Status: `NOT SELECTED / PRODUCTION BLOCKED`.
- Future review: jurisdiction/currency support, tokenization/hosted controls, deposit/withdrawal, webhook signing, idempotency, reconciliation, chargebacks/fraud, settlement, costs and operational support.

### Observability / error tracking
- Status: `NOT SELECTED`.
- Requirements are in `OBSERVABILITY.md`.

### Secret manager / KMS
- Status: `NOT SELECTED / PRODUCTION BLOCKER`.
- Must support access control, rotation/audit and environment isolation.

## Service onboarding checklist

Before adding a new external service evaluate:
- exact necessity;
- data sent/received;
- authentication/secrets;
- authorization model;
- webhook/callback verification;
- timeout/retry/idempotency;
- rate limits;
- privacy/data residency/retention;
- vendor security posture;
- SLA/failure behavior;
- cost model;
- fallback/exit strategy;
- licenses/terms;
- staging/sandbox separation;
- monitoring and support ownership.

## Cost ownership

A detailed production cost model is not yet canonical. Provider and infrastructure costs must be added to product financial modeling before a commercial pilot. Do not treat free development tiers as reliable production economics.
