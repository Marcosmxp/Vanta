# Vanta — Environments

## 1. Environment model

Vanta distinguishes configuration and operational intent by environment. Existing code/config supports development and mobile build profiles for development/preview/production, but staging/production backend infrastructure is not yet selected or authorized.

| Environment | Current status | Purpose |
|---|---|---|
| Local | ACTIVE | developer machine, Docker PostgreSQL/Redis/API, Metro/native development |
| Development | ACTIVE | controlled development builds and API behavior |
| Preview / Staging | PARTIAL | mobile EAS preview profile exists; backend/database/URLs are not yet canonical |
| Production | BLOCKED | EAS profile exists as configuration only; production operation is not authorized |

## 2. Local development

Current local infrastructure:
- PostgreSQL 18 in Docker;
- Redis in Docker;
- Go API in Docker or directly via Go;
- React Native/Expo mobile client;
- physical-device LAN workflow when needed.

PostgreSQL and Redis bind to loopback in standard compose development. The API binds to loopback unless the explicit physical-device development bind address is provided.

Local credentials in development configuration are placeholders only and must never be reused in staging/production.

## 3. Development configuration

Canonical public/private separation:
- backend `VANTA_*` variables are server configuration;
- `EXPO_PUBLIC_*` values are public client configuration embedded in mobile artifacts;
- secrets must never be placed in `EXPO_PUBLIC_*`.

`.env.example` documents development placeholders and variable purpose. Real environment files remain uncommitted.

## 4. Preview / staging

The EAS `preview` profile currently identifies mobile builds as `staging`, but a complete staging environment does not yet exist.

Before calling staging operationally ready, define:
- backend hosting/provider;
- staging API URL/domain/TLS;
- isolated PostgreSQL instance;
- isolated Redis instance;
- secret manager/KMS;
- provider sandbox credentials;
- logging/monitoring/error tracking;
- deployment and rollback procedures;
- staging data policy and synthetic/test account policy.

Never point staging at production databases or production provider credentials merely for convenience.

## 5. Production

`BLOCKED / DECISION REQUIRED`.

A production EAS profile is not evidence of production readiness. Before production, the project requires the gates in `docs/quality/PRODUCTION_READINESS.md`.

Required separation includes:
- isolated production database/cache;
- managed production secrets;
- protected signing credentials;
- verified domain/TLS/network policy;
- production providers and jurisdiction configuration;
- backup/restore;
- monitoring/alerting;
- controlled migration/release process.

## 6. URLs

- Local API default: `http://localhost:8080`.
- Physical-device development API: developer LAN address on port 8080 when explicitly enabled.
- Staging API URL: `UNKNOWN / DECISION REQUIRED`.
- Production API URL: `UNKNOWN / DECISION REQUIRED`.

Do not hardcode future staging/production URLs before infrastructure is selected.

## 7. Environment parity

Aim for behavioral parity without copying sensitive data or credentials. Differences must be deliberate and documented, especially for:
- TLS/proxy behavior;
- logging level;
- provider endpoints;
- secrets;
- database/cache topology;
- debug/dev tooling;
- maintenance mode;
- release signing.
