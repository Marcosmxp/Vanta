# Vanta

Vanta is a native mobile gaming platform under active development.

## Current milestone

Phases **01–19 are complete and merged**.

**Phase 20 — Native MVP Builds and Device Validation is IN PROGRESS** on `feat/phase20-native-builds` / PR #24.

The current Android baseline is being validated on a physical device. Registration/login, authenticated Home/Profile/Wallet and protected Plinko rendering have been exercised against the local Go/PostgreSQL/Redis backend. Phase 20 is not yet ready to merge.

### Current controlled release identity

```text
Release: 0.1.0-alpha.1
Native marketing version: 0.1.0
Android versionCode: 2
iOS buildNumber: 2
Channel: alpha
```

Root `version.json` is the canonical source. Use `pnpm release:check` to detect drift. The `v0.1.0-alpha.1` Git tag is intentionally pending until the intended Phase 20 alpha artifact passes its release gates.

JavaScript dependency resolution is now pinned by root `pnpm-lock.yaml`; controlled local/CI/native installs use `pnpm install --frozen-lockfile` with the project toolchain baseline (`Node 22.13.0`, `pnpm 10.15.0`).

See [`docs/release/versioning-and-release-governance.md`](./docs/release/versioning-and-release-governance.md) and [`CHANGELOG.md`](./CHANGELOG.md).

## Canonical project documentation

Read:

1. [`AGENTS.md`](./AGENTS.md) — stable repository operating contract for Codex/AI-assisted development and contributors.
2. [`docs/README.md`](./docs/README.md) — documentation index and precedence.
3. [`docs/VANTA_PROJECT_CONTEXT.md`](./docs/VANTA_PROJECT_CONTEXT.md) — master recoverable context.
4. [`docs/context/2026-08-25-phase20-strategy-checkpoint.md`](./docs/context/2026-08-25-phase20-strategy-checkpoint.md) — current Phase 20 continuation checkpoint.
5. [`docs/VANTA_PRODUCT_BUSINESS_STRATEGY.md`](./docs/VANTA_PRODUCT_BUSINESS_STRATEGY.md) — product/business/game-math/regulatory strategy.
6. [`docs/ROADMAP.md`](./docs/ROADMAP.md) — current implementation roadmap.
7. [`docs/PHASE_HISTORY.md`](./docs/PHASE_HISTORY.md) — delivery history.
8. [`docs/release/phase20-troubleshooting-and-findings.md`](./docs/release/phase20-troubleshooting-and-findings.md) — live native-test issues/fixes.
9. [`docs/security/phase19-security-audit.md`](./docs/security/phase19-security-audit.md) — latest completed security audit.

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
- Project phases are not application versions.
- Dependency resolution is committed and frozen for controlled builds.

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

A successful APK/native build or a normalized software version does **not** authorize regulated production operation.

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
