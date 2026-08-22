# Vanta Backend

Server-authoritative Go application for Vanta.

## Current bootstrap

The API currently provides only a minimal `/health` endpoint and platform configuration. Financial, identity, wallet, ledger, betting, and game modules will be added behind explicit domain boundaries.

## Run locally

From the repository root:

```bash
cp .env.example .env
set -a && source .env && set +a
pnpm api:run
```

On Windows PowerShell, set the environment variables using the shell's standard environment syntax before running the API.

## Security boundary

The backend, not the mobile application, will own:

- canonical wallet state
- bet validation
- cryptographically secure result generation
- payout calculation
- settlement
- ledger mutations
- idempotency enforcement
- audit events
