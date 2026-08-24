# Vanta

Vanta is a native mobile betting/gaming platform under active development.

## Current milestone

**MVP v0.0.0.1** — React Native mobile client, Go server-authoritative backend, PostgreSQL immutable ledger foundation, Redis ephemeral controls, and Plinko as the first game.

Phases **01–19 are complete and merged**. The next implementation milestone is **Phase 20 — native Android/iOS MVP builds and device validation**.

## Canonical project documentation

To continue the project without relying on old chat history or outdated planning files, read:

1. [`docs/README.md`](./docs/README.md) — documentation index and precedence rules.
2. [`docs/VANTA_PROJECT_CONTEXT.md`](./docs/VANTA_PROJECT_CONTEXT.md) — master recoverable project context.
3. [`docs/ROADMAP.md`](./docs/ROADMAP.md) — current roadmap, Phase 20 plan, and post-MVP regulated roadmap.
4. [`docs/PHASE_HISTORY.md`](./docs/PHASE_HISTORY.md) — implementation history through Phase 19.
5. [`docs/security/phase19-security-audit.md`](./docs/security/phase19-security-audit.md) — latest security audit and residual blockers.

When an older PDF, screenshot, PR description or historical note conflicts with the canonical documents above, follow the precedence defined in `docs/README.md` and verify against current `main` code/migrations.

## Engineering principles

- Server-authoritative financial and game logic.
- Mobile client treated as untrusted.
- Security by design from the first phase.
- Immutable and auditable double-entry-style financial ledger.
- PostgreSQL as canonical persistent truth.
- Redis only for ephemeral controls/cache/coordination, never financial truth.
- Clear feature-based/domain module boundaries.
- No secrets or privileged credentials in client code or Git history.
- Explicit separation of development, staging, and production environments.
- Code-first UI workflow with Storybook; Figma is not the primary development dependency.

## Important production boundary

A successful MVP/native build does **not** authorize real-money operation.

Real-money Plinko placement, live deposit/withdraw execution, production KYC upload/liveness, MFA/step-up, production secrets/KMS, provider callbacks, final licensing/certification and other regulated-production requirements remain intentionally blocked until their roadmap prerequisites are implemented and independently validated.
