# Vanta Security Policy

Vanta is being designed as a security-sensitive financial/gaming system.

## Core invariants

- Mobile clients are untrusted.
- Game outcomes are generated and settled server-side.
- The database and ledger are never directly reachable from the mobile client.
- No production secret belongs in source control or client bundles.
- Every bet/payment mutation must support idempotent processing.
- Monetary history must be auditable and append-oriented.
- Redis may support cache, rate limiting, and ephemeral coordination but is not a financial source of truth.

## Repository hygiene

Do not commit:

- `.env` files containing real credentials
- signing keys or certificates
- payment/KYC provider secrets
- database passwords
- service-account files
- production exports or customer data

Use `.env.example` only for documented placeholder variables.

## Vulnerability reporting

During private development, security findings should be tracked in a restricted channel rather than public GitHub issues when they expose exploitable implementation details.
