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
- Status: Done
- Description: after access-token expiry, trigger a protected API request and prove refresh rotation completes without visible re-login.
- Acceptance: protected request succeeds; refresh state rotates; no token is logged/exposed; failure path is understood.
- Evidence: physical Android session `session_...37f2` completed three consecutive rotations (`1 -> 2`, `2 -> 3`, `3 -> 4`) with advancing access expiry under the controlled 1m access TTL; the tester explicitly confirmed the app remained logged in without visible re-authentication. Token values/hashes were not queried or printed. Detailed timestamps are recorded in `docs/release/phase20-session-security-evidence.md`.
- Dependencies: physical Android dev runtime.

### AUTH-REVOCATION-002 — Validate remote revocation/expired refresh
- Type: Security / Testing
- Status: Done
- Description: prove revoked/expired server session returns the app to authentication rather than leaving stale authorized UI.
- Evidence: final physical Android run targeted `session_...65a7`. The controlled revocation harness reached `Server status: revoked`, which only occurs after the targeted DELETE returns HTTP 204 and a subsequent authenticated `/v1/security` snapshot reports the selected session as `revoked`. On the physical device, Vanta later displayed `Sessão expirada` / `Reauthentication required`; after `Voltar a autenticar`, the app returned to the introduction/authentication flow and did not restore protected access. Detailed evidence is recorded in `docs/release/phase20-session-security-evidence.md`.
- Note: the earlier `AUTH-PERSIST-003` suspicion was closed as a false alarm because the Android session involved in that observation had already been deliberately revoked by the security-center endpoint; process close was not the cause of session loss.

### REL-PROVENANCE-001 — Use PR source SHA in artifact provenance
- Type: Infrastructure / Security
- Status: Done
- Description: Android workflow separates `pull_request.head.sha`/source SHA from CI `github.sha`; artifact name, metadata and `IDENTITY.txt` use explicit provenance.
- Evidence: final FOUNDATION-005 Native Android run succeeded on source HEAD `f8eeecf51d275aaea23efbcc7dbceb20e967465e`.

### REL-ARTIFACT-002 — Inspect Android artifact for secrets/debug configuration
- Type: Security
- Status: Done
- Description: Android workflow unpacks the APK and rejects secret-like files or known server-only configuration markers before artifact upload.
- Evidence: final FOUNDATION-005 Native Android run passed the APK inspection gate on source HEAD `f8eeecf51d275aaea23efbcc7dbceb20e967465e`.

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
- Status: Done
- Description: repository ruleset `main-protection` (`21597647`) is active for `refs/heads/main`.
- Enforcement: pull request required; `Repository hygiene`, `Mobile validation`, `Go tests`, `Analyze javascript-typescript` and `Analyze go` required; strict status-check policy enabled; force-push/non-fast-forward and branch deletion blocked; zero approving reviews required for the current solo workflow.

### TEST-MOBILE-001 — Add critical mobile regression tests
- Type: Testing
- Status: In Progress
- Description: coverage now protects session expiry/refresh timing, SecureStore persistence, locale selection, API configuration/client behavior and the Wallet/Legal/Support/Responsible Gaming null-collection regressions.
- Remaining: full SessionProvider silent-refresh/logout interaction and other critical auth-state behavior still require focused tests/evidence.

---

## P2 — Medium

### DEVCLIENT-001 — Normalize physical-device dev-client workflow
- Type: Tech Debt
- Status: Backlog
- Description: resolve mismatch between `expo start --dev-client` workflow and explicit dependency/configuration strategy; reduce manual host configuration.

### DEP-HEALTH-001 — Review dependency warnings
- Type: Tech Debt / Security
- Status: In Progress
- Description: deterministic install is stable and high-severity audit gate passes, but current audit reports 2 moderate advisories plus peer/transitive/build-script warnings.
- Acceptance: identify affected packages, review Expo SDK 57/native compatibility, upgrade only in a scoped change, and rerun CI/native validation without broad blind upgrades.

### TOOL-LINT-001 — Establish JS/TS lint/format policy
- Type: Infrastructure / Quality
- Status: Backlog
- Description: strict TypeScript/tests/bundle validation and a dependency-free repository whitespace gate exist; dedicated ESLint/formatter adoption remains a scoped dependency/policy decision.

### TEST-E2E-001 — Add minimal native E2E critical paths
- Type: Testing
- Status: Backlog
- Description: evaluate Maestro/Detox/Appium or equivalent for a small critical flow set after current native baseline is stable.

### CI-GATES-001 — Enforce repository/PR quality gates
- Type: Infrastructure / Quality
- Status: Done
- Description: repository hygiene/secret-file checks, PR template controls, current Actions runtimes and concurrency cancellation for superseded CI/CodeQL/Android runs are implemented and passed on final FOUNDATION-005 HEAD.

### OPS-DOC-001 — Canonical operations documentation
- Type: Documentation
- Status: Done
- Description: canonical ENVIRONMENTS, DEPLOYMENT, ROLLBACK, BACKUP/RESTORE, OBSERVABILITY, INCIDENT_RESPONSE and EXTERNAL_SERVICES documentation exists, with production unknowns explicitly marked instead of invented.

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
