# Vanta Documentation Index

This directory is the canonical documentation source for the Vanta project. Root [`AGENTS.md`](../AGENTS.md) is the permanent operating contract for Codex/AI-assisted development and human contributors.

## Read first

For a new ChatGPT/Codex/developer session, use this order:

1. [`../AGENTS.md`](../AGENTS.md) — stable engineering/AI operating rules, safety boundaries, validation and Definition of Done.
2. [`product/PROJECT.md`](./product/PROJECT.md) — what Vanta is, target user, product boundary, business direction and success criteria.
3. [`project/STATUS.md`](./project/STATUS.md) — current version, milestone, completed/in-progress/blocked work and next priorities.
4. [`product/MVP.md`](./product/MVP.md) — current Native Alpha scope and exit criteria.
5. [`product/REQUIREMENTS.md`](./product/REQUIREMENTS.md) — stable product/domain requirement IDs and status.
6. [`project/BACKLOG.md`](./project/BACKLOG.md) — prioritized actionable work.
7. [`engineering/ARCHITECTURE.md`](./engineering/ARCHITECTURE.md) — current implemented system architecture and boundaries.
8. [`engineering/COMPONENTS.md`](./engineering/COMPONENTS.md) — mobile/backend component responsibility map.
9. [`engineering/DATABASE.md`](./engineering/DATABASE.md) — database, ledger and migration rules.
10. [`engineering/CODING_STANDARDS.md`](./engineering/CODING_STANDARDS.md) — TypeScript/Go/SQL implementation standards.
11. [`engineering/DEPENDENCIES.md`](./engineering/DEPENDENCIES.md) — dependency and lockfile change control.
12. [`engineering/GIT_WORKFLOW.md`](./engineering/GIT_WORKFLOW.md) — branch/commit/PR workflow.
13. [`quality/TESTING.md`](./quality/TESTING.md) — testing strategy, commands, baseline and regression rules.
14. [`project/TECH_DEBT.md`](./project/TECH_DEBT.md) and [`project/RISKS.md`](./project/RISKS.md) — known debt and risk register.
15. [`VANTA_PROJECT_CONTEXT.md`](./VANTA_PROJECT_CONTEXT.md) — recoverable historical/project context and permanent background.
16. [`VANTA_PRODUCT_BUSINESS_STRATEGY.md`](./VANTA_PRODUCT_BUSINESS_STRATEGY.md) — strategic product/business/game-economics/regulatory direction.
17. [`ROADMAP.md`](./ROADMAP.md) — sequenced technical, security, regulatory and commercial execution.
18. Relevant detailed domain documentation under `product/`, `security/`, `architecture/` and `release/`.
19. [`PHASE_HISTORY.md`](./PHASE_HISTORY.md) — chronological delivery history.

For small scoped tasks, do not mechanically reread every document. Read the minimum relevant context required by `AGENTS.md`.

## Canonical product/project records

### Product

- [`product/PROJECT.md`](./product/PROJECT.md) — canonical product definition.
- [`product/MVP.md`](./product/MVP.md) — current MVP boundary.
- [`product/REQUIREMENTS.md`](./product/REQUIREMENTS.md) — requirement IDs, priority, status and acceptance criteria.
- [`product/README.md`](./product/README.md) — product documentation index.

### Project management

- [`project/STATUS.md`](./project/STATUS.md) — current project checkpoint.
- [`project/BACKLOG.md`](./project/BACKLOG.md) — actionable prioritized work.
- [`project/TECH_DEBT.md`](./project/TECH_DEBT.md) — debt register; discovery does not imply immediate refactor.
- [`project/RISKS.md`](./project/RISKS.md) — technical/security/product/operations risk register.

## Engineering and quality

Canonical engineering summaries:

- [`engineering/ARCHITECTURE.md`](./engineering/ARCHITECTURE.md) — real current architecture, trust/persistence/environment boundaries and change rules.
- [`engineering/COMPONENTS.md`](./engineering/COMPONENTS.md) — logical mobile/backend modules and responsibility boundaries.
- [`engineering/DATABASE.md`](./engineering/DATABASE.md) — PostgreSQL/Redis authority, schema domains, ledger invariants and migration policy.
- [`engineering/CODING_STANDARDS.md`](./engineering/CODING_STANDARDS.md) — implementation conventions for TypeScript/React Native, Go and SQL.
- [`engineering/DEPENDENCIES.md`](./engineering/DEPENDENCIES.md) — dependency evaluation, pinned toolchain and lockfile policy.
- [`engineering/GIT_WORKFLOW.md`](./engineering/GIT_WORKFLOW.md) — simple solo-project Git/PR workflow and release relationship.
- [`quality/TESTING.md`](./quality/TESTING.md) — risk-based testing strategy and evidence rules.

Detailed/historical architecture records remain under `architecture/`; the engineering files above summarize the current canonical operating model rather than deleting those records.

## Product experience standards

- [`product/ux-motion-guidelines.md`](./product/ux-motion-guidelines.md) — visual language, assets, native launch/splash, bottom navigation, motion, states, accessibility and UX acceptance criteria.
- [`product/player-copy-content-guidelines.md`](./product/player-copy-content-guidelines.md) — player-facing copy, wallet/auth/KYC/game/security wording, blocked/error states, localization and content acceptance criteria.

These documents describe intended player experience. Executable visual tokens/components remain under `apps/mobile/src/design-system`, and authoritative financial/security/legal rules remain in their server/domain sources.

## Security and session standards

Security documentation is indexed at [`security/README.md`](./security/README.md).

Current key records:
- [`security/phase19-security-audit.md`](./security/phase19-security-audit.md) — latest completed/merged security audit and regression evidence.
- [`security/phase20-security-architecture.md`](./security/phase20-security-architecture.md) — current trust boundaries, implemented controls, threat classes and production hardening path.
- [`security/session-device-security-roadmap.md`](./security/session-device-security-roadmap.md) — persistent session UX, token lifecycle, revocation, MFA/passkeys, step-up and device-risk design.
- [`architecture/game-math-financial-risk-engine.md`](./architecture/game-math-financial-risk-engine.md) — game-integrity, payout math, bankroll, exposure and risk-of-ruin architecture.

The released mobile client is assumed inspectable/modifiable. Canonical authorization, money, game outcome, settlement, KYC, Responsible Gaming and risk decisions remain server-side.

## Active Phase 20 records

Phase 20 is in PR #24 on `feat/phase20-native-builds`.

- [`release/phase20-native-builds.md`](./release/phase20-native-builds.md) — current native build/runtime state and remaining exit criteria.
- [`release/phase20-device-smoke-test.md`](./release/phase20-device-smoke-test.md) — Android/iOS validation checklist with observed Android results.
- [`release/phase20-troubleshooting-and-findings.md`](./release/phase20-troubleshooting-and-findings.md) — real failures encountered during Windows/Android testing and fixes.
- [`release/versioning-and-release-governance.md`](./release/versioning-and-release-governance.md) — SemVer/build/tag/changelog/release rules.

## Detailed architecture records

Current detailed references:
- [`architecture/README.md`](./architecture/README.md)
- [`architecture/backend-runtime-phase17.md`](./architecture/backend-runtime-phase17.md)
- [`architecture/mobile-backend-integration.md`](./architecture/mobile-backend-integration.md)
- [`architecture/game-math-financial-risk-engine.md`](./architecture/game-math-financial-risk-engine.md)

Older architecture/ADR files remain useful historical evidence, but current code + current canonical docs win when conflicts exist.

## Documentation precedence

When two sources conflict, use this precedence:

1. Current code/migrations/tests on the branch intentionally being developed for implementation truth.
2. Root `AGENTS.md` for stable operating/safety/development rules.
3. Current product/project/engineering/quality canonical records for present scope, state and engineering rules.
4. Current `main` for last completed/merged repository state.
5. `docs/VANTA_PROJECT_CONTEXT.md` for recoverable context/background.
6. Current dated context checkpoint for an in-progress phase.
7. `docs/VANTA_PRODUCT_BUSINESS_STRATEGY.md` for strategic intent.
8. `docs/ROADMAP.md` for sequenced future execution.
9. Current detailed domain specs (`docs/security/`, `docs/product/`, `docs/architecture/`, `docs/release/`).
10. `docs/PHASE_HISTORY.md` and older ADR/bootstrap/historical planning evidence.

A branch document may intentionally describe in-progress state newer than `main`; it must not be confused with already-merged production truth.

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
- any claim of licensing without verified operator/license data;
- player UI examples exposing internal ledger/settlement/read-model/server implementation terminology as normal product copy;
- any document treating positive house edge as sufficient proof that bankroll/exposure is safe;
- any plan permitting player-specific result manipulation to protect operator profit.

## Product-documentation rule

Player-facing copy and developer documentation are different things.

- App UI: simple language about actions, status, safety and required legal disclosure.
- Product docs: scope, requirements, interaction/visual/content intent and acceptance criteria.
- Engineering docs: server authority, ledger, APIs, persistence and implementation boundaries.
- Security/math/risk docs: invariants, evidence requirements, failure modes, simulation and production gates.
- Audit/regulatory evidence: enough detail for verification.

Do not expose internal architecture text in normal player screens merely because it is technically accurate.

## Maintenance rule

When architecture, security boundaries, product scope, requirements, UX principles, build/release process, compliance, game economics, milestone state or roadmap changes, update the relevant canonical documentation in the same scoped work.

When a troubleshooting discovery is likely to recur, add it to the appropriate troubleshooting/runbook record with symptom, root cause, fix, verification and regression status.

When implementation diverges from an approved requirement/product/security/math rule, record it as implementation debt/backlog instead of silently weakening the specification.

Do not create empty documents only to match an ideal folder tree.
