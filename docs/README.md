# Vanta Documentation Index

This directory is the canonical source of truth for the Vanta project.

## Read first

For a new ChatGPT/Codex/developer session, read in this order:

1. [`VANTA_PROJECT_CONTEXT.md`](./VANTA_PROJECT_CONTEXT.md) — master recoverable project context, permanent rules, current Phase 20 state and resume instructions.
2. [`context/2026-08-25-phase20-strategy-checkpoint.md`](./context/2026-08-25-phase20-strategy-checkpoint.md) — detailed continuation checkpoint from the live Android/device/product-strategy discussion.
3. [`VANTA_PRODUCT_BUSINESS_STRATEGY.md`](./VANTA_PRODUCT_BUSINESS_STRATEGY.md) — product goals, UX, game math, risk, business model, regulatory and lawful corporate strategy.
4. [`ROADMAP.md`](./ROADMAP.md) — implementation sequence and Phase 20/post-MVP exit gates.
5. [`PHASE_HISTORY.md`](./PHASE_HISTORY.md) — chronological delivery history.
6. [`security/phase19-security-audit.md`](./security/phase19-security-audit.md) — latest completed security audit.
7. Current phase-specific release/security documents.

## Active Phase 20 records

Phase 20 is in PR #24 on `feat/phase20-native-builds`.

- [`release/phase20-native-builds.md`](./release/phase20-native-builds.md) — current native build/runtime state and remaining exit criteria.
- [`release/phase20-device-smoke-test.md`](./release/phase20-device-smoke-test.md) — Android/iOS validation checklist with observed Android results.
- [`release/phase20-troubleshooting-and-findings.md`](./release/phase20-troubleshooting-and-findings.md) — real failures encountered during Windows/Android testing and their fixes.
- [`release/versioning-and-release-governance.md`](./release/versioning-and-release-governance.md) — SemVer/build/tag/changelog/release rules.

## Architecture records

Examples:
- [`architecture/backend-runtime-phase17.md`](./architecture/backend-runtime-phase17.md)
- [`architecture/mobile-backend-integration.md`](./architecture/mobile-backend-integration.md)

Older architecture/ADR files remain useful historical evidence, but current code + canonical docs win when conflicts exist.

## Documentation precedence

When two documents conflict, use this precedence:

1. Current code/migrations on the branch being intentionally developed.
2. Current `main` for last completed/merged state.
3. `docs/VANTA_PROJECT_CONTEXT.md`.
4. Current dated context checkpoint for an in-progress phase.
5. `docs/ROADMAP.md`.
6. `docs/PHASE_HISTORY.md`.
7. Current phase-specific release/security/architecture documents.
8. Older ADRs, bootstrap docs, PDFs, screenshots, PR descriptions and historical planning.

A branch document can describe in-progress state that is intentionally newer than `main`; it must clearly say that it is not merged yet.

## Known historical/outdated categories

Do not treat these as current truth without checking canonical docs:

- former product name `AURABET`;
- Figma-first workflow plans;
- pre-Phase-17 backend-contract-only descriptions;
- pre-Phase-18 disconnected mobile-provider descriptions;
- old Vanta red experiments;
- historical milestone label `v0.0.0.1` as if it were a controlled native SemVer release;
- docs claiming all Phase 20 builds use Android emulator `10.0.2.2`;
- docs claiming production payment/identity/MFA/game operations already exist;
- any claim of licensing without verified operator/license data.

## Product-documentation rule

Player-facing copy and developer documentation are different things.

- App UI: simple language about actions, status, safety and required legal disclosure.
- Engineering docs: server authority, ledger, settlement, APIs, threat models, implementation detail.
- Audit/regulatory evidence: enough detail for verification.

Do not expose internal architecture text in normal player screens merely because it is technically accurate.

## Maintenance rule

Every phase that changes architecture, security boundaries, product scope, UX principles, build/release process, compliance, game economics or roadmap must update the relevant canonical docs in the same PR.

When a troubleshooting discovery is likely to recur, add it to the phase troubleshooting record with symptom, root cause, fix, verification and regression coverage/status.

A phase is not considered fully documented until these files are current.
