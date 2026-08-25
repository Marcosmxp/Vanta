# Vanta Security Documentation

**Status:** canonical security-documentation index.  
**Last consolidated:** 2026-08-25 during Phase 20.

Vanta is a security-sensitive mobile gaming/financial system. Security documentation must distinguish **implemented controls**, **validated controls**, **planned controls** and **production blockers**. A design appearing in this directory is not evidence that the implementation exists.

## Read in this order

1. [`phase19-security-audit.md`](./phase19-security-audit.md) — latest completed/merged security audit and regression evidence.
2. [`phase20-security-architecture.md`](./phase20-security-architecture.md) — current security architecture, trust boundaries and production hardening plan.
3. [`session-device-security-roadmap.md`](./session-device-security-roadmap.md) — session persistence, refresh, revocation, MFA/passkeys, step-up and device-trust policy.
4. [`threat-model-bootstrap.md`](./threat-model-bootstrap.md) — original bootstrap threat model; useful historical baseline, but newer documents/code win on conflicts.
5. [`../architecture/game-math-financial-risk-engine.md`](../architecture/game-math-financial-risk-engine.md) — game-integrity, payout-math, exposure and bankroll security boundary.

Top-level repository policy remains [`../../SECURITY.md`](../../SECURITY.md).

## Permanent trust model

Assume that a released mobile application can be:
- decompiled;
- inspected;
- hooked/instrumented;
- modified/repackaged;
- automated;
- run on a rooted/jailbroken/emulated environment;
- used to send custom API requests independent of the official UI.

Therefore mobile compromise must **not** grant authority to:
- create or modify canonical money;
- approve KYC or account eligibility;
- weaken Responsible Gaming restrictions;
- choose a production game result;
- choose a multiplier or payout;
- settle a wager;
- confirm a deposit/provider event;
- authorize a withdrawal by itself;
- access another player's resources;
- change server-side risk limits.

Obfuscation and device signals may raise attack cost or improve risk scoring, but they are not primary authorization boundaries.

## Current implemented foundations

Current code and completed audit evidence include:
- bcrypt password hashing;
- AES-256-GCM protection for sensitive PII;
- HMAC-based deterministic lookup protection;
- opaque access/refresh tokens;
- server-side token hashes;
- rotating refresh tokens;
- refresh replay/race fail-closed handling;
- server-side session revocation;
- SecureStore-backed mobile persistence;
- single-flight mobile refresh coordination;
- authentication throttling;
- server-side resource ownership checks;
- PostgreSQL as canonical financial/regulatory truth;
- immutable/double-entry-style ledger foundation;
- HTTPS-only mobile configuration outside development;
- production HTTP security headers;
- strict request parsing/body limits;
- CodeQL, dependency audit, `go test -race`, `go vet` and `govulncheck` gates.

See the Phase 19 audit for evidence and exact fixed findings.

## Current Phase 20 security validation

Phase 20 must still produce evidence for:
- force-close/reopen session persistence;
- background/foreground behavior;
- silent access-token refresh;
- refresh expiry/revocation behavior;
- remote logout/revocation behavior;
- native artifact/config/log secret inspection;
- absence of debug-only production behavior;
- exact build/version/Git provenance;
- iOS build-path security review.

A successful Android APK rendering is not enough to close these requirements.

## Production blockers

Before real-money production, Vanta still requires, as applicable:
- trusted reverse-proxy/client-IP policy;
- production secrets in KMS/HSM-equivalent managed storage;
- key rotation and break-glass procedures;
- MFA/passkeys and secure recovery;
- step-up authentication for sensitive actions;
- Play Integrity / App Attest integration and device-risk policy;
- production KYC/AML provider and replay-safe callbacks;
- payment provider, signed webhooks and reconciliation;
- approved game mathematics and financial-risk controls;
- production wager reservation/settlement pipeline;
- fraud/risk monitoring;
- immutable security/financial audit events;
- incident response and session/key revocation playbooks;
- supply-chain/release hardening;
- independent penetration test/security assessment;
- jurisdiction-specific regulatory controls/certification.

## Change rule

A PR that materially changes authentication, authorization, session behavior, device trust, KYC, payment, ledger, game mathematics, wager acceptance, settlement, risk limits, production secrets or infrastructure trust boundaries must update the relevant security/architecture documentation in the same PR.

Do not mark a security control as implemented until code and appropriate validation evidence exist.
