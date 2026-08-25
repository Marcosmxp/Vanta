# Vanta

Vanta is a native mobile gaming platform under active development.

## Current milestone

Phases **01–19 are complete and merged**.

**Phase 20 — Native MVP Builds and Device Validation is IN PROGRESS** on `feat/phase20-native-builds` / PR #24.

The current Android baseline is being validated on a physical device. Registration/login, authenticated Home/Profile/Wallet and protected Plinko rendering have been exercised against the local Go/PostgreSQL/Redis backend. Phase 20 is not yet ready to merge.

The repository still contains inconsistent early version declarations (`0.0.1` vs `0.0.0`). Controlled SemVer/build governance is now an explicit Phase 20 requirement; see [`docs/release/versioning-and-release-governance.md`](./docs/release/versioning-and-release-governance.md).

## Canonical project documentation

Read:

1. [`docs/README.md`](./docs/README.md) — documentation index and precedence.
2. [`docs/VANTA_PROJECT_CONTEXT.md`](./docs/VANTA_PROJECT_CONTEXT.md) — master recoverable context.
3. [`docs/context/2026-08-25-phase20-strategy-checkpoint.md`](./docs/context/2026-08-25-phase20-strategy-checkpoint.md) — current Phase 20 continuation checkpoint.
4. [`docs/VANTA_PRODUCT_BUSINESS_STRATEGY.md`](./docs/VANTA_PRODUCT_BUSINESS_STRATEGY.md) — product/business/game-math/regulatory strategy.
5. [`docs/ROADMAP.md`](./docs/ROADMAP.md) — current implementation roadmap.
6. [`docs/PHASE_HISTORY.md`](./docs/PHASE_HISTORY.md) — delivery history.
7. [`docs/release/phase20-troubleshooting-and-findings.md`](./docs/release/phase20-troubleshooting-and-findings.md) — live native-test issues/fixes.
8. [`docs/security/phase19-security-audit.md`](./docs/security/phase19-security-audit.md) — latest completed security audit.

## Engineering principles

- Server-authoritative financial and game logic.
- Mobile client treated as untrusted.
- Security by design.
- Immutable/auditable financial ledger.
- PostgreSQL as canonical persistent truth.
- Redis only for ephemeral coordination/cache/rate limiting.
- No secrets or privileged credentials in client code or Git history.
- Development/staging/production explicitly separated.
- Code-first UI + Storybook.
- Sensitive production capabilities remain fail-closed until prerequisites exist.
- Player-facing copy explains the product; developer docs explain architecture.
- Releases must be traceable to version + native build + Git commit.

## Product direction

Vanta should feel like a premium financial product with original gaming capability, not a generic noisy casino.

Current product-polish direction includes:
- final app icon/splash/launch animation;
- navigation icons + motion;
- restrained shared motion system;
- clearer player-facing copy;
- structured Legal Center;
- persistent session UX;
- version/build About information;
- approved game math/risk before production game operations open.

## Important production boundary

A successful APK/native build does **not** authorize regulated production operation.

Still blocked before production:
- production game placement/settlement;
- production payment execution/reconciliation;
- production KYC/AML provider;
- MFA/passkey/step-up implementation;
- device trust/attestation;
- production secrets/KMS;
- approved game mathematics/exposure;
- final licensing/certification;
- store policy readiness;
- independent security assessment.

Launch readiness requires evidence, not only code completion.
