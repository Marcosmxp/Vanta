# Vanta Documentation Index

This directory is the canonical source of truth for the Vanta project.

## Canonical documents

Read these first, in this order:

1. [`VANTA_PROJECT_CONTEXT.md`](./VANTA_PROJECT_CONTEXT.md) — master project context, architecture, product rules, security boundaries, current implementation state, and operational constraints.
2. [`ROADMAP.md`](./ROADMAP.md) — current roadmap, phase status, Phase 20 plan, and post-MVP regulated roadmap.
3. [`PHASE_HISTORY.md`](./PHASE_HISTORY.md) — chronological implementation history with phase outcomes, pull requests, merge commits, and major decisions.
4. [`security/phase19-security-audit.md`](./security/phase19-security-audit.md) — current security audit findings, fixes, regression coverage, and residual blockers.
5. [`architecture/backend-runtime-phase17.md`](./architecture/backend-runtime-phase17.md) — Phase 17 backend runtime details.
6. [`architecture/mobile-backend-integration.md`](./architecture/mobile-backend-integration.md) — Phase 18 mobile/backend integration details.

## Active Phase 20 records

Phase 20 implementation is tracked in PR #24 on `feat/phase20-native-builds`.

- [`release/phase20-native-builds.md`](./release/phase20-native-builds.md) — native build profiles, versioning, environment rules, CI artifact path, open work and exit criteria.
- [`release/phase20-device-smoke-test.md`](./release/phase20-device-smoke-test.md) — Android/iOS device and emulator validation checklist.

Until PR #24 is merged, `main` remains the canonical completed-state reference and `ROADMAP.md` may still identify Phase 20 as `NEXT`. The active branch/PR records are the implementation state for the in-progress phase.

## Documentation precedence

When two documents conflict, use this precedence:

1. Current code and migrations on `main`.
2. `docs/VANTA_PROJECT_CONTEXT.md`.
3. `docs/ROADMAP.md`.
4. `docs/PHASE_HISTORY.md`.
5. Current phase-specific architecture/security/release documents.
6. Older ADRs, bootstrap documents, historical notes, PR descriptions, screenshots, PDFs, and external planning artifacts.

Older documents are not deleted solely because they are historical. They remain useful as implementation history, but they must not override the canonical documents above.

## Known historical/outdated material

The following categories must not be treated as current project truth without checking the canonical documents:

- documents using the former product name `AURABET`;
- planning that assumes Figma as the primary design workflow;
- pre-Phase-17 documents that describe the backend as contract-only or disconnected;
- pre-Phase-18 documents that describe all mobile providers as disconnected;
- old palette experiments using reds other than the approved Vanta palette;
- any document claiming real-money Plinko, live deposit/withdrawal, production KYC upload, MFA enrollment, or regulatory licensing already exists.

## Maintenance rule

Every phase that changes architecture, security boundaries, product scope, deployment, compliance, or roadmap must update the canonical documents in the same pull request. A phase is not considered fully documented until the relevant canonical files are current.
