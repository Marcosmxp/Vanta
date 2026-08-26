# Vanta — Technical Debt Register

Technical debt is recorded here so it can be prioritized instead of triggering opportunistic refactors.

## TECH-001 — JavaScript peer/transitive dependency warnings
- Area: Mobile / Dependencies
- Priority: P2
- Problem: deterministic install still reports peer/deprecation/transitive warnings; the current high-severity audit gate passes but reports 2 moderate advisories.
- Impact: future upgrade friction and potential compatibility/security exposure.
- Risk: Medium.
- Current evidence: React/ReactDOM relationship, safe-area compatibility, valibot/deprecated transitive warnings, and 2 moderate audit findings remain under scoped review.
- Possible solution: identify exact advisory paths and review against Expo SDK 57 compatibility before controlled upgrades; do not lower audit gates or broadly upgrade unrelated packages.

## TECH-002 — Ignored dependency build scripts
- Area: Mobile / Supply chain
- Priority: P2
- Problem: pnpm reports ignored build scripts including Skia/esbuild; Android workflow explicitly installs and verifies Skia native binaries.
- Impact: local/native behavior can depend on deliberate follow-up commands rather than a single generic install.
- Risk: Medium.
- Possible solution: review/approve only required scripts as a scoped supply-chain decision; do not enable scripts globally without evidence.

## TECH-003 — Dev-client workflow mismatch
- Area: Mobile / Developer Experience
- Priority: P2
- Problem: physical-device workflow uses `expo start --dev-client` while current setup has required manual React Native debug host configuration and does not treat QR/deep-link flow as canonical.
- Impact: onboarding a clean development machine/device is less reproducible than desired.
- Risk: Medium.
- Possible solution: deliberately adopt/configure a proper development-client workflow or change scripts/docs to match the actual supported debug-binary path.

## TECH-004 — Mobile regression coverage gap
- Area: Quality
- Priority: P1
- Problem: backend coverage remains stronger than mobile behavioral coverage.
- Progress: Phase 20 now tests API configuration/client behavior, session timing, SecureStore fail-closed persistence, locale policy, and Wallet/Legal/Support/Responsible Gaming null collection normalization.
- Remaining risk: full SessionProvider refresh/logout interaction, critical auth UI states and broader native E2E remain under-tested.
- Possible solution: continue focused boundary tests before broad E2E expansion.

## TECH-005 — Locale contract divergence
- Area: Mobile / API / Database
- Priority: P1
- Problem: mobile supports `pt-BR`, `en`, `es`, while existing persistence constraints historically included a different locale set.
- Impact: future account-synced language preference can fail or drift.
- Risk: High if server persistence is enabled without decision/migration.
- Possible solution: product decision on locale authority, then backward-compatible migration/API contract.

## TECH-006 — Password-policy contract divergence
- Area: Auth / Security
- Priority: P1
- Problem: backend and mobile have not always enforced identical complexity/copy rules.
- Impact: direct API and mobile UX may accept/reject different passwords.
- Risk: High.
- Possible solution: define server-authoritative canonical policy and mirror client validation/copy from it where practical.

## TECH-007 — PR artifact source-SHA provenance
- Area: Release / CI
- Priority: P1
- Problem: historical PR artifacts could use synthetic merge `GITHUB_SHA` instead of exact source-branch identity.
- Progress: workflow/script now carry `VANTA_GIT_SHA` (source) and `VANTA_CI_SHA` separately; artifact names use source SHA.
- Remaining: close only after a successful native workflow proves the emitted artifact/metadata.

## TECH-008 — Automatic migrations at API startup
- Area: Backend / Database / Operations
- Priority: P2 now; P1 before production
- Problem: development API startup runs migrations automatically.
- Impact: convenient locally but inappropriate as the only production migration control.
- Risk: Medium now, High at production boundary.
- Possible solution: introduce controlled migration execution/deployment gate while preserving reproducible dev setup.

## TECH-009 — No formal JS/TS lint/format gate
- Area: Mobile / Quality
- Priority: P2
- Problem: TypeScript strict/typecheck exists, but no explicit stable JS/TS linter/formatter dependency is canonical.
- Mitigation: CI now enforces changed code/config whitespace and secret-file hygiene without adding dependencies.
- Possible solution: evaluate ESLint/formatter fit against Expo/React Native and introduce it only as a scoped dependency/policy change without mass reformat churn.

## TECH-010 — Minimal native E2E automation
- Area: Quality
- Priority: P2
- Problem: physical Android validation is still substantially manual.
- Impact: repeated release smoke work costs time and may miss regressions.
- Possible solution: add a small E2E suite for authentication/session/navigation/core read flows when native baseline stabilizes.

## TECH-011 — Documentation accumulated across phase history
- Area: Documentation
- Priority: P3
- Problem: historical phase documents and current canonical specs coexist and can drift.
- Impact: new AI/developer sessions can choose stale context if precedence is ignored.
- Possible solution: maintain `docs/README.md`, `AGENTS.md` and explicit canonical docs; archive/deprecate only when safe rather than deleting useful evidence.

## TECH-012 — Large localization catalogs
- Area: Mobile / Maintainability
- Priority: P3
- Problem: localization dictionaries are growing as more player journeys migrate.
- Impact: higher merge/review cost as one catalog grows.
- Possible solution: split by domain only when change frequency/size justifies the added structure.

## Debt rule

Technical debt is not permission for immediate refactoring. A debt item should move into implementation only when its impact, priority and acceptance criteria justify the change.
