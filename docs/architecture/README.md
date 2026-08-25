# Vanta Architecture

> Canonical project context lives in [`../VANTA_PROJECT_CONTEXT.md`](../VANTA_PROJECT_CONTEXT.md). This architecture overview summarizes the current system shape; if there is a conflict, follow the documentation precedence in [`../README.md`](../README.md).

## Product boundary

Vanta is a native mobile gaming platform under active development with Plinko as the first Vanta Original.

Phases 01–19 are complete. Phase 20 is the native build/device-validation phase. Production real-money wagering, live payments, production KYC/AML, MFA/step-up and licensing remain intentionally blocked until their dedicated roadmap prerequisites exist.

## System shape

- `apps/mobile`: React Native + TypeScript + Expo application.
- `backend`: Go modular monolith with server-authoritative identity, financial, Responsible Gaming and game boundaries.
- `packages`: shared contracts and non-secret compile-time artifacts.
- `infrastructure`: local runtime and future deployment configuration.
- `docs`: canonical project context, roadmap, architecture decisions, security/math/product specifications and development history.

## Backend domains

Current/target modular boundaries include:

- identity/auth
- identity/security
- player/profile
- kyc
- wallet
- ledger
- betting/history
- games/plinko
- payments
- compliance/legal
- responsiblegaming
- support
- platform/status
- risk
- fraud
- notification
- audit

The MVP remains a modular monolith. Microservices are not a goal without evidence that independent scaling/operations justify them.

## Trust model

The mobile application is untrusted and may be inspected, modified or automated.

The backend owns:
- authentication/authorization;
- KYC/eligibility decisions;
- Responsible Gaming enforcement;
- canonical wallet/ledger state;
- game ruleset selection;
- wager acceptance;
- production RNG;
- multiplier/payout resolution;
- settlement;
- risk/exposure decisions;
- provider reconciliation.

See [`../security/phase20-security-architecture.md`](../security/phase20-security-architecture.md).

## Session architecture

Mobile uses SecureStore for sensitive session persistence and restores a valid server session across process restarts. Access credentials are short-lived, refresh credentials rotate and server-side revocation remains authoritative.

Routine minimize/close/reopen must not force login while a valid session exists. Sensitive operations later use policy-driven step-up authentication.

See [`../security/session-device-security-roadmap.md`](../security/session-device-security-roadmap.md).

## Financial model

Vanta uses an immutable, double-entry-style PostgreSQL ledger model. A mutable `users.balance` field is not an acceptable source of financial truth.

Core concepts:
- wallets;
- ledger accounts;
- ledger transactions;
- ledger entries;
- bets;
- settlement state.

Redis is never financial truth.

## Game authority

The mobile application may request an authorized wager and animate the returned result, but it must not determine RNG outcomes, payouts, settlement or canonical balance state.

The Plinko visual and secure engine foundation exist, but the public real-money wager/settlement path remains intentionally closed.

### Game mathematics and risk

Current Plinko engine uses cryptographically secure independent Left/Right decisions. For `n` rows, final slot probability is analytically binomial:

```text
P(K = k) = C(n, k) / 2^n
```

Before production, each payout ruleset requires exact RTP/house-edge calculation, variance/tail analysis, simulation, bankroll/risk-of-ruin study, max-stake/max-payout policy and aggregate exposure controls.

Risk capacity is checked before wager acceptance. Accepted outcomes are never altered to protect operator profit.

Canonical specification: [`game-math-financial-risk-engine.md`](./game-math-financial-risk-engine.md).

## Production maturity sequence

```text
Native Alpha (Phase 20)
      ↓
Production Platform / Identity / Providers
      ↓
Game Math + Financial Risk (Phase 25)
      ↓
Production Wager + Settlement Pipeline (Phase 26)
      ↓
Fraud / Regulatory / Independent Security
      ↓
Controlled Pilot / Unit Economics / Expansion
```

A production app artifact is not equivalent to a production operating system.

## Current architecture references

- [`backend-runtime-phase17.md`](./backend-runtime-phase17.md) — executable backend foundation.
- [`mobile-backend-integration.md`](./mobile-backend-integration.md) — mobile/API integration.
- [`game-math-financial-risk-engine.md`](./game-math-financial-risk-engine.md) — game math, bankroll, exposure and production risk architecture.
- [`../security/README.md`](../security/README.md) — security documentation index.
- [`../security/phase19-security-audit.md`](../security/phase19-security-audit.md) — completed security findings/regression evidence.
- [`../security/phase20-security-architecture.md`](../security/phase20-security-architecture.md) — current security architecture/hardening plan.
- [`../security/session-device-security-roadmap.md`](../security/session-device-security-roadmap.md) — session/step-up/device-security design.
- [`../ROADMAP.md`](../ROADMAP.md) — current technical/commercial execution roadmap.
