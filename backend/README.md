# Vanta Backend

Server-authoritative Go application for Vanta.

## Phase 17 runtime

The backend now boots against PostgreSQL and Redis, applies embedded migrations before accepting traffic, and exposes real authenticated read/application boundaries for the MVP domains.

PostgreSQL is the canonical persistent source for player, session, KYC, wallet, ledger, betting history, responsible-gaming, support and legal state. Redis is intentionally limited to ephemeral concerns such as authentication throttling; it is never financial truth.

## Local development

From the repository root, the complete development runtime can be started with:

```bash
docker compose -f infrastructure/docker/compose.dev.yml up -d --build
```

Or run PostgreSQL/Redis separately and start the API directly:

```bash
cp .env.example .env
# Load the environment variables using your shell.
pnpm api:run
```

Health endpoints:

- `GET /health` — process liveness only.
- `GET /health/ready` — PostgreSQL and Redis readiness.
- `GET /v1/platform/status` — presentation-safe public platform availability.

## Public authentication endpoints

- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/refresh`

Access and refresh credentials are opaque random tokens. Only token hashes are persisted. Refresh rotation invalidates the previous generation.

## Authenticated MVP endpoints

- `POST /v1/auth/logout`
- `GET /v1/profile`
- `GET /v1/kyc/status`
- `GET /v1/wallet`
- `GET /v1/security`
- `DELETE /v1/security/sessions`
- `DELETE /v1/security/sessions/{sessionID}`
- `GET /v1/responsible-gaming`
- responsible-gaming change/time-out/self-exclusion commands
- `GET /v1/bets`
- `GET /v1/bets/{betID}`
- `GET /v1/support`
- `POST /v1/support/requests`
- `GET /v1/support/requests/{requestID}`

Legal documents/disclosures are public read-only resources and remain unavailable until verified operator/compliance configuration is persisted.

## Financial boundary

The internal ledger service is double-entry, serializable, idempotent and immutable. Wallet balances are projections of ledger entries, not mutable balance columns. Redis is never consulted as financial truth.

The following are deliberately **not** exposed yet:

- real Plinko bet placement/settlement endpoint;
- deposit/withdrawal money movement;
- payment-provider callbacks;
- KYC provider uploads/approval callbacks;
- production licensing assertions.

Those flows remain fail-closed until their dependent controls and providers are implemented.

## Security boundary

- mobile clients are untrusted;
- PII fields requiring lookup are protected using encrypted storage plus keyed lookup hashes;
- passwords use bcrypt;
- bearer/refresh tokens are never persisted in plaintext;
- player-owned resources enforce ownership server-side;
- request bodies are size-limited and strict JSON decoded;
- sensitive responses use `Cache-Control: no-store`;
- production enables HSTS;
- authentication throttling fails closed if Redis is unavailable;
- logs do not include passwords, tokens, support bodies or PII payloads;
- migrations run before the API starts accepting traffic.
