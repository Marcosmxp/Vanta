# Vanta — Technical Debt Register

Technical debt is recorded here so it can be prioritized instead of triggering opportunistic refactors.

## TECH-001 — JavaScript peer/transitive dependency warnings
- Area: Mobile / Dependencies
- Priority: P2
- Problem: current deterministic install reports peer/deprecation/transitive warnings, including React/ReactDOM, safe-area-context, valibot and deprecated transitive packages.
- Impact: future upgrade friction and potential compatibility/security exposure.
- Risk: Medium.
- Possible solution: review against Expo SDK 57 compatibility matrix and upgrade only as a scoped dependency task with CI/native validation.

## TECH-002 — Ignored dependency build scripts
- Area: Mobile / Supply chain
- Priority: P2
- Problem: pnpm reports ignored build scripts including Skia/esbuild; Android workflow explicitly installs Skia native binaries.
- Impact: local/native behavior can depend on deliberate follow-up commands rather than a single generic install.
- Risk: Medium.
- Possible solution: document/approve required build-script policy and keep supply-chain risk explicit; do not enable scripts globally without review.

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
- Problem: backend coverage is materially stronger than mobile behavioral coverage; several `null.length` runtime crashes were found manually.
- Impact: UI/API-boundary regressions may escape CI.
- Risk: High.
- Possible solution: add focused tests for API normalization, session lifecycle, auth states, localization and critical screens before broad E2E expansion.

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
- Possible solution: define server-authoritative canonical policy and generate/mirror client validation/copy from it where practical.

## TECH-007 — PR artifact source-SHA provenance
- Area: Release / CI
- Priority: P1
- Problem: pull-request workflows may use synthetic merge `GITHUB_SHA` instead of the actual source branch head for artifact identity.
- Impact: artifact provenance can point to a CI merge commit rather than exact source commit.
- Risk: High for release traceability.
- Possible solution: explicitly derive `pull_request.head.sha` when applicable and optionally retain CI merge SHA separately.

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
- Problem: TypeScript strict/typecheck exists, but no explicit stable JS/TS lint/format gate is currently canonical.
- Impact: consistency/quality issues rely more on review and compiler than static style/error rules.
- Risk: Medium.
- Possible solution: evaluate ESLint/formatter fit without broad reformat churn.

## TECH-010 — Minimal native E2E automation
- Area: Quality
- Priority: P2
- Problem: physical Android validation is still substantially manual.
- Impact: repeated release smoke work costs time and may miss regressions.
- Risk: Medium.
- Possible solution: add a small E2E suite for authentication/session/navigation/core read flows when native baseline stabilizes.

## TECH-011 — Documentation accumulated across phase history
- Area: Documentation
- Priority: P3
- Problem: historical phase documents and current canonical specs coexist and can drift.
- Impact: new AI/developer sessions can choose stale context if precedence is ignored.
- Risk: Low/Medium.
- Possible solution: maintain `docs/README.md`, `AGENTS.md` and explicit canonical docs; archive/deprecate only when safe rather than deleting useful evidence.

## TECH-012 — Large localization catalogs
- Area: Mobile / Maintainability
- Priority: P3
- Problem: localization dictionaries are growing as more player journeys migrate.
- Impact: higher merge/review cost as one catalog grows.
- Risk: Low currently.
- Possible solution: split by domain only when change frequency/size justifies the added structure.

## Debt rule

Technical debt is not permission for immediate refactoring. A debt item should move into implementation only when its impact, priority and acceptance criteria justify the change.
