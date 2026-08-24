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
- Route visibility is never authorization; player ownership and policy are enforced by the API.
- Refresh-token rotation must be atomic and replay-safe.
- Responsible Gaming restrictions cannot be weakened by client state.

## Required verification

Changes affecting authentication, authorization, financial state, Responsible Gaming, support ownership, KYC/payment boundaries or infrastructure must keep the security gates green. The standard PR gate includes:

- TypeScript and mobile API boundary tests;
- Android application and Storybook exports;
- JavaScript dependency audit;
- Go module verification, `gofmt`, race-enabled tests and `go vet`;
- PostgreSQL/Redis integration security tests;
- Go vulnerability scanning;
- API/container/Compose validation;
- CodeQL for JavaScript/TypeScript and Go.

A green CI run is necessary but is not evidence of regulatory certification or authorization to process real money.

## Repository hygiene

Do not commit:

- `.env` files containing real credentials;
- signing keys or certificates;
- payment/KYC provider secrets;
- database passwords;
- service-account files;
- production exports or customer data;
- access/refresh tokens, OTPs, recovery codes or authentication cookies;
- raw KYC documents, selfies or support exports containing customer information.

Use `.env.example` only for documented placeholder variables.

## Production blockers

Real-money operation must remain fail-closed until the applicable security and compliance dependencies are implemented and reviewed, including production payment/KYC providers, signed/replay-safe callbacks, step-up authentication where required, production key management, device attestation and final jurisdiction/regulatory controls.

The current detailed residual-risk register is maintained under `docs/security/`.

## Vulnerability reporting

During private development, security findings should be tracked in a restricted channel rather than public GitHub issues when they expose exploitable implementation details. Reports should include affected boundary, reproducible evidence, impact, proposed remediation and validation status without embedding live credentials or customer data.
