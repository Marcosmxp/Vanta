# Vanta Security Documentation

**Status:** canonical security-documentation index.  
**Last consolidated:** 2026-08-26 during Phase 20.

Vanta is a security-sensitive mobile gaming/financial system. Security documentation must distinguish **implemented controls**, **validated controls**, **planned controls** and **production blockers**. A design appearing in this directory is not evidence that the implementation exists.

## Read in this order

1. [`SECURITY_MODEL.md`](./SECURITY_MODEL.md) — canonical current security-model summary: trust boundaries, assets, implemented controls, change control and production gaps.
2. [`DATA_PRIVACY.md`](./DATA_PRIVACY.md) — engineering privacy/data inventory, storage/protection boundaries and explicit legal/retention decisions still required.
3. [`phase19-security-audit.md`](./phase19-security-audit.md) — latest completed/merged security audit and regression evidence.
4. [`phase20-security-architecture.md`](./phase20-security-architecture.md) — detailed current security architecture, trust boundaries and production hardening plan.
5. [`session-device-security-roadmap.md`](./session-device-security-roadmap.md) — session persistence, refresh, revocation, MFA/passkeys, step-up and device-trust policy.
6. [`threat-model-bootstrap.md`](./threat-model-bootstrap.md) — original bootstrap threat model; useful historical baseline, but newer documents/code win on conflicts.
7. [`../architecture/game-math-financial-risk-engine.md`](../architecture/game-math-financial-risk-engine.md) — game-integrity, payout-math, exposure and bankroll security boundary.

Top-level repository policy remains [`../../SECURITY.md`](../../SECURITY.md). Operational recovery/readiness procedures are indexed at [`../operations/README.md`](../operations/README.md).

## Permanent trust model

Assume that a released mobile application can be decompiled, inspected, hooked, modified, automated and used to send custom API requests independent of the official UI.

Therefore mobile compromise must **not** grant authority to:
- create or modify canonical money;
- approve KYC or account eligibility;
- weaken Responsible Gaming restrictions;
- choose a production game result, multiplier or payout;
- settle a wager;
- confirm a deposit/provider event;
- authorize a withdrawal by itself;
- access another player's resources;
- change server-side risk limits.

Obfuscation and device signals may raise attack cost or improve risk scoring, but they are not primary authorization boundaries.

## Current implemented foundations

Current code and completed audit evidence include:
- bcrypt password hashing;
- encryption/keyed lookup protection for selected sensitive PII;
- opaque access/refresh tokens with server-side hashes;
- rotating refresh tokens and replay/race fail-closed handling;
- server-side session revocation;
- SecureStore-backed mobile persistence;
- authentication throttling;
- server-side resource ownership checks;
- PostgreSQL as canonical financial/regulatory truth;
- immutable/double-entry ledger foundation;
- HTTPS-only mobile configuration outside development;
- HTTP security/request-parsing controls;
- deterministic lockfiles/frozen installs;
- CodeQL, dependency audit, `go test -race`, `go vet` and `govulncheck` gates.

See the Phase 19 audit for evidence and exact fixed findings.

## Current Phase 20 security validation

Phase 20 still requires or is completing evidence for:
- background/foreground session behavior;
- true access-token expiry + silent refresh;
- refresh expiry/revocation behavior;
- remote logout/revocation behavior;
- native artifact/config/log secret inspection;
- absence of debug-only production behavior;
- exact source build/version/Git provenance;
- iOS build-path security review.

Force-close/reopen SecureStore persistence has physical Android evidence, but that alone does not prove silent refresh or revocation behavior.

## Production blockers

Before real-money production, Vanta still requires, as applicable:
- trusted reverse-proxy/client-IP policy;
- production secrets in managed KMS/secret storage;
- key rotation and break-glass procedures;
- MFA/passkeys and secure recovery;
- step-up authentication for sensitive actions;
- device-risk/integrity signals where justified;
- production KYC/AML provider and replay-safe callbacks;
- payment provider, signed callbacks and reconciliation;
- approved game mathematics and financial-risk controls;
- production wager reservation/settlement pipeline;
- fraud/risk monitoring;
- production observability;
- tested backup/restore/rollback;
- incident-response rehearsal;
- independent penetration test/security assessment;
- jurisdiction-specific regulatory controls/certification.

See [`../quality/PRODUCTION_READINESS.md`](../quality/PRODUCTION_READINESS.md) for the consolidated gate.

## Change rule

A PR that materially changes authentication, authorization, session behavior, device trust, KYC, payment, ledger, game mathematics, wager acceptance, settlement, risk limits, personal-data handling, production secrets or infrastructure trust boundaries must update the relevant security/architecture/privacy/operations documentation in the same PR.

Do not mark a security control as implemented until code and appropriate validation evidence exist.
