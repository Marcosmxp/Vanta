# Vanta Security Policy

Vanta is a security-sensitive financial/gaming system under active development.

## Core invariants

- Mobile clients are untrusted.
- Game outcomes are generated, validated and settled server-side.
- The database and ledger are never directly reachable from the mobile client.
- No production secret belongs in source control or client bundles.
- Every financial/game mutation must support idempotent processing.
- Monetary history must be auditable and append-oriented.
- PostgreSQL is canonical financial/regulatory truth.
- Redis may support cache, rate limiting and ephemeral coordination but is not financial truth.
- Route visibility is never authorization.
- Refresh-token rotation must be atomic and replay-safe.
- Responsible Gaming restrictions cannot be weakened by client state.
- A player closing/minimizing/reopening the app should not require routine password login while a valid secure session exists.
- Sensitive financial/security actions should use step-up authentication according to policy rather than forcing full login on every app open.
- Operator economics must come from approved game mathematics and pre-action limits, never hidden user-specific outcome changes.

## Untrusted-client model

Assume released client code can be inspected, modified or automated. Therefore client compromise must not grant authority to change wallet balance, approve identity state, weaken Responsible Gaming controls, choose authoritative outcomes, change settlement, confirm payments, authorize withdrawals or access another player's records.

Obfuscation may increase analysis cost but is not a trusted security boundary.

## Session security

Current foundations:
- SecureStore mobile persistence;
- short-lived access tokens;
- rotating refresh tokens;
- server-side token hashes;
- replay/race detection;
- server revocation;
- authentication throttling.

Expected normal UX:
- minimize → session remains;
- force-close/reopen → session restored;
- access expiry → silent refresh;
- revoked/expired refresh → authentication.

Future production work:
- explicit idle + absolute session lifetime;
- MFA/passkeys;
- device/new-login alerts;
- step-up for withdrawals/security changes;
- secure recovery;
- policy-driven session revocation after password/security events.

## Game/financial security

Every production game action must validate authentication, authorization, identity/jurisdiction/Responsible Gaming policy, ruleset, balance and applicable risk limits before authoritative outcome generation and ledger settlement.

Approved game configurations require versioned mathematics/risk metadata and immutable historical linkage.

## Required verification

Changes affecting authentication, authorization, session persistence, financial state, game math, Responsible Gaming, support ownership, identity/payment boundaries or infrastructure must keep security gates green.

Standard PR gates include:
- TypeScript/mobile boundary tests;
- Android app/Storybook exports;
- JS dependency audit;
- Go module verification;
- `gofmt`;
- race-enabled tests;
- `go vet`;
- PostgreSQL/Redis integration security tests;
- `govulncheck`;
- API/container/Compose validation;
- CodeQL JS/TS + Go.

A green CI run is necessary but is not evidence of regulatory certification.

## Release/supply-chain requirements

Before controlled production release:
- exact version/build/Git provenance;
- dependency lockfile committed;
- frozen dependency installation;
- production signing protected outside source;
- secret scanning;
- artifact inspection;
- environment separation;
- no debug-only production behavior;
- HTTPS outside development.

Planned hardening includes KMS/HSM, key rotation, platform device-attestation services, device-risk signals, controlled release signing, independent penetration testing and incident-response/revocation playbooks.

See `docs/release/versioning-and-release-governance.md`.

## Repository hygiene

Do not commit:
- real `.env` credentials;
- signing private keys/certificates;
- payment/identity-provider secrets;
- database passwords;
- service-account files;
- production exports/customer data;
- access/refresh tokens;
- OTPs/recovery codes;
- authentication cookies;
- raw identity documents/selfies;
- support exports with customer information.

Use `.env.example` only for documented placeholders.

## Production blockers

Production operation remains fail-closed until applicable dependencies are implemented/reviewed, including production identity/compliance providers, payments/reconciliation, replay-safe callbacks, MFA/passkey/step-up, device trust, production key management, approved game mathematics, exposure/bankroll controls, fraud/risk monitoring, final jurisdiction controls and independent security assessment.

The detailed completed audit record remains under `docs/security/`.

## Vulnerability reporting

During development, findings that expose exploitable implementation details should be tracked in a restricted channel rather than a public issue.

Reports should contain the affected boundary, reproduction/evidence, impact, remediation and validation status without live credentials/customer data.

For recurring non-sensitive runtime failures, use phase troubleshooting docs instead.
