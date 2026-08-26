# Vanta — Project Backlog

This backlog captures actionable work that should not be hidden inside chat history. Strategic phase sequencing remains canonical in `docs/ROADMAP.md`.

## Status

`Backlog` · `Ready` · `In Progress` · `Review` · `Testing` · `Done` · `Blocked`

## Types

`Feature` · `Bug` · `Tech Debt` · `Security` · `Performance` · `Documentation` · `Infrastructure` · `Research`

---

## P0 — Critical

No confirmed P0 item is currently recorded from the latest repository audit/baseline.

---

## P1 — High

### AUTH-REFRESH-001 — Prove silent refresh on physical runtime
- Type: Security / Testing
- Status: Ready
- Description: after access-token expiry, trigger a protected API request and prove refresh rotation completes without visible re-login.
- Acceptance: protected request succeeds; refresh state rotates; no token is logged/exposed; failure path is understood.
- Dependencies: physical Android dev runtime.

### AUTH-REVOCATION-002 — Validate remote revocation/expired refresh
- Type: Security / Testing
- Status: Ready
- Description: prove revoked/expired server session returns the app to authentication rather than leaving stale authorized UI.

### REL-PROVENANCE-001 — Use PR source SHA in artifact provenance
- Type: Infrastructure / Security
- Status: Ready
- Description: distinguish source branch commit from synthetic pull-request merge commit in Android artifact name/metadata/IDENTITY.
- Acceptance: artifact records intended source SHA and optionally CI merge SHA separately.

### REL-ARTIFACT-002 — Inspect Android artifact for secrets/debug configuration
- Type: Security
- Status: Ready
- Description: inspect built artifact/public config/log behavior for credentials, tokens, backend-only configuration and inappropriate production settings.

### IOS-BUILD-001 — Establish iOS CI/build path
- Type: Infrastructure / Testing
- Status: Ready
- Description: validate Expo/iOS native configuration and macOS CI/EAS/simulator compile path without falsely claiming physical iPhone validation.

### UX-NATIVE-001 — Final icon/splash/launch identity
- Type: Feature
- Status: Ready
- Description: replace generic/broken development launch presentation with final alpha-quality Vanta identity.

### UX-COPY-002 — Finish player-copy/localization migration
- Type: Feature / Documentation
- Status: In Progress
- Description: remove remaining backend/API implementation language and hard-coded player copy from supported journeys.
- Acceptance: migrated screens work in `pt-BR`, `en`, `es`; unsupported copy is tracked.

### SEC-POLICY-001 — Align canonical password policy
- Type: Security / Tech Debt
- Status: Ready
- Description: ensure backend authority and mobile UX enforce/document the same canonical password policy.

### DATA-LOCALE-001 — Align locale persistence contract
- Type: Product / Database
- Status: Blocked
- Description: decide whether language is device-local, account-synced or both; then align database/API constraints for `pt-BR`, `en`, `es` or chosen locale set.
- Dependency: product decision before migration.

### GIT-GOV-001 — Protect `main`
- Type: Infrastructure / Security
- Status: Ready
- Description: configure branch/ruleset protection so required CI/security checks cannot be bypassed accidentally.
- Acceptance: pull request + required checks enforced; force-push/deletion policy deliberate.

### TEST-MOBILE-001 — Add critical mobile regression tests
- Type: Testing
- Status: Ready
- Description: cover session provider/refresh, logout, API empty-array normalization, locale switching and critical auth states.

---

## P2 — Medium

### DEVCLIENT-001 — Normalize physical-device dev-client workflow
- Type: Tech Debt
- Status: Backlog
- Description: resolve mismatch between `expo start --dev-client` workflow and explicit dependency/configuration strategy; reduce manual host configuration.

### DEP-HEALTH-001 — Review dependency warnings
- Type: Tech Debt / Security
- Status: Backlog
- Description: review React/ReactDOM, safe-area, valibot, deprecated transitive dependencies and ignored build scripts against Expo compatibility; avoid blind upgrades.

### TOOL-LINT-001 — Establish JS/TS lint/format policy
- Type: Infrastructure / Quality
- Status: Backlog
- Description: adopt tooling only after checking existing stack and CI cost; avoid stylistic mass rewrite.

### TEST-E2E-001 — Add minimal native E2E critical paths
- Type: Testing
- Status: Backlog
- Description: evaluate Maestro/Detox/Appium or equivalent for a small critical flow set after current native baseline is stable.

### OPS-DOC-001 — Canonical operations documentation
- Type: Documentation
- Status: Backlog
- Description: create/update ENVIRONMENTS, DEPLOYMENT, ROLLBACK, BACKUP/RESTORE, OBSERVABILITY and INCIDENT_RESPONSE before production readiness.

### DB-MIGRATION-001 — Separate production migration execution from app boot
- Type: Infrastructure / Database
- Status: Backlog
- Description: keep current dev convenience but design controlled migration job/process before production.

### LICENSE-001 — Decide repository/product licensing
- Type: Documentation / Research
- Status: Backlog
- Description: choose source-code license/distribution policy and audit third-party asset/font/image licensing before commercial distribution.

### SUPPORT-OPS-001 — Define production support operations
- Type: Product / Operations
- Status: Backlog
- Description: define ownership, escalation, privacy handling and service expectations before launch.

---

## P3 — Low

### DOC-STRUCTURE-001 — Continue canonical documentation consolidation
- Type: Documentation
- Status: In Progress
- Description: create only useful canonical docs; avoid empty/template-only files and remove stale duplicates over time.

### GIT-SIGN-001 — Evaluate commit/tag signing policy
- Type: Security / Infrastructure
- Status: Backlog
- Description: decide whether signed commits/tags are required for future release governance.

### I18N-SCALE-001 — Split localization catalogs when maintenance requires it
- Type: Tech Debt
- Status: Backlog
- Description: current catalogs can be split by domain only when size/change frequency justifies complexity.

## Backlog rule

Every item should have a real objective and acceptance boundary. Do not implement a backlog item merely because it exists; move it to `Ready` only when the requirement, dependencies and acceptance criteria are clear.
