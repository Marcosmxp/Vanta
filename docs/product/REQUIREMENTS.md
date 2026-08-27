# Vanta — Product Requirements

**Status values:** `Done`, `In Progress`, `Ready`, `Backlog`, `Blocked`, `Decision Required`  
**Priority values:** `MUST`, `SHOULD`, `COULD`, `LATER`

This document defines product requirements at a stable domain level. Current code, migrations and tests determine exact implementation truth. Regulatory/provider requirements remain subject to explicit jurisdiction/provider decisions.

## AUTH — Account and session

### AUTH-001 — Create account
- Priority: MUST
- Status: Done
- Requirement: a player can create an account using the supported registration flow.
- Acceptance: valid registration is persisted server-side; invalid input is rejected without exposing sensitive internals.

### AUTH-002 — Login
- Priority: MUST
- Status: Done
- Requirement: a registered player can authenticate with valid credentials.
- Acceptance: successful login creates a server-authoritative session; invalid credentials fail closed.

### AUTH-003 — Persist valid session
- Priority: MUST
- Status: In Progress
- Requirement: a valid session survives normal app minimize/restart without routine password re-entry.
- Acceptance: SecureStore restores the valid session and protected API calls remain authorized.

### AUTH-004 — Silent access refresh
- Priority: MUST
- Status: In Progress
- Requirement: expired short-lived access credentials are renewed through the rotating refresh session without interrupting normal use.
- Acceptance: protected API request after access expiry succeeds through refresh; refresh rotation remains valid; no token is exposed to UI/logs.

### AUTH-005 — Logout and revocation
- Priority: MUST
- Status: In Progress
- Requirement: logout clears the local session and revokes the relevant server session.
- Acceptance: revoked credentials cannot continue protected use.

### AUTH-006 — Account recovery
- Priority: LATER
- Status: Backlog
- Requirement: secure recovery must exist before production operation.
- Acceptance: DECISION REQUIRED after email/identity/provider strategy is selected.

## PROFILE — Account/profile

### PROFILE-001 — View account summary
- Priority: MUST
- Status: Done
- Requirement: authenticated player can view profile/account state without engineering terminology.

### PROFILE-002 — Language preference
- Priority: SHOULD
- Status: In Progress
- Requirement: supported player journeys can use `pt-BR`, `en` and `es`, with explicit fallback behavior.
- Acceptance: language can be changed without restarting; preference persistence/synchronization authority is documented.
- Dependency: locale database/account synchronization policy is Decision Required.

## KYC — Identity/eligibility

### KYC-001 — View verification state
- Priority: MUST
- Status: Done
- Requirement: player can view current KYC/account verification state supplied by the server.

### KYC-002 — Production identity verification
- Priority: LATER
- Status: Blocked
- Requirement: production identity/KYC/AML must use a selected real provider and verified jurisdiction rules.
- Acceptance: signed/replay-safe provider integration, audited state transitions and no fabricated client approval.

## WALLET — Financial read model

### WALLET-001 — View wallet balance
- Priority: MUST
- Status: Done
- Requirement: authenticated player can view server-authoritative wallet state.

### WALLET-002 — View transaction history
- Priority: MUST
- Status: Done
- Requirement: empty and populated transaction collections render without crash.
- Acceptance: API empty collections serialize/normalize consistently as arrays.

### WALLET-003 — Client cannot mutate canonical balance
- Priority: MUST
- Status: Done
- Requirement: mobile cannot directly create canonical money or settlement state.

## PAY — Deposits/withdrawals

### PAY-001 — Deposit/withdraw presentation
- Priority: SHOULD
- Status: Done
- Requirement: product surfaces may present unavailable/future deposit/withdraw actions with clear player language.

### PAY-002 — Production payment execution
- Priority: LATER
- Status: Blocked
- Requirement: payments require selected PSP, server-side confirmation, idempotency, reconciliation, ledger posting and applicable KYC/RG policy.

### PAY-003 — Production withdrawal authorization
- Priority: LATER
- Status: Blocked
- Requirement: withdrawal requires ownership/risk/security/step-up policy and must not be authorized only by frontend state.

## GAME — Vanta Originals / Plinko

### GAME-001 — Open Plinko protected experience
- Priority: MUST
- Status: Done
- Requirement: authenticated player can reach the Plinko experience without enabling unauthorized production wagering.

### GAME-002 — Server-authoritative outcomes
- Priority: MUST
- Status: Done
- Requirement: authoritative outcome/payout logic resides server-side; client may animate returned state only.

### GAME-003 — Approved production math
- Priority: LATER
- Status: Blocked
- Requirement: every production ruleset has analytical probability/RTP/house-edge/variance/tail/max-stake/max-payout/bankroll/exposure evidence and versioning.

### GAME-004 — Production wager/settlement pipeline
- Priority: LATER
- Status: Blocked
- Requirement: production wagers validate auth, eligibility, Responsible Gaming, balance and risk before outcome/settlement/ledger mutation.

## RG — Responsible Gaming

### RG-001 — View protection controls
- Priority: MUST
- Status: Done
- Requirement: player can access Responsible Gaming controls in plain language.

### RG-002 — Server enforcement
- Priority: MUST
- Status: Done
- Requirement: Responsible Gaming restrictions cannot be weakened by client state.

### RG-003 — Jurisdiction-aware policy
- Priority: LATER
- Status: Decision Required
- Requirement: specific limits/time-out/self-exclusion rules are enabled/configured according to verified jurisdiction/product policy rather than assumed universally.

## SECURITY — Player security

### SEC-001 — Secure token persistence
- Priority: MUST
- Status: Done
- Requirement: sensitive session state uses secure platform storage and server-side token hashes/revocation.

### SEC-002 — Authentication throttling
- Priority: MUST
- Status: Done
- Requirement: authentication abuse is rate limited server-side.

### SEC-003 — MFA/passkeys/step-up
- Priority: LATER
- Status: Blocked
- Requirement: production-sensitive operations use an approved step-up/MFA/passkey policy.

### SEC-004 — No secrets in client/repository
- Priority: MUST
- Status: Done
- Requirement: production secrets/private credentials are absent from client bundles/source control.

## SUPPORT — Support

### SUPPORT-001 — View support options
- Priority: MUST
- Status: Done
- Requirement: authenticated player can access support options without API/backend implementation text.

### SUPPORT-002 — Production support workflow
- Priority: LATER
- Status: Backlog
- Requirement: production support ownership, SLA/escalation and privacy-safe case handling are documented before launch.

## LEGAL — Legal/privacy

### LEGAL-001 — Legal Center entry point
- Priority: MUST
- Status: Done
- Requirement: player can access Legal/Privacy surfaces.

### LEGAL-002 — Versioned legal documents
- Priority: LATER
- Status: In Progress
- Requirement: production legal documents have verified content, version and effective date.

### LEGAL-003 — Verified operator/regulator/license data
- Priority: LATER
- Status: Blocked
- Requirement: app displays operator/regulator/license claims only from verified approved data.

## I18N — Localization

### I18N-001 — Supported alpha locales
- Priority: SHOULD
- Status: In Progress
- Requirement: migrated player journeys support `pt-BR`, `en`, `es` through the localization system.

### I18N-002 — Locale persistence authority
- Priority: SHOULD
- Status: Decision Required
- Requirement: define whether locale is device-local, account-synced or both; align database constraints before server persistence.

## UX — Native product experience

### UX-001 — Player-facing copy
- Priority: MUST
- Status: In Progress
- Requirement: normal UI explains actions/status in product language and avoids backend/API/ledger implementation explanations.

### UX-002 — Bottom navigation
- Priority: MUST
- Status: In Progress
- Requirement: Home/Play/Wallet/Profile use coherent icon + label navigation and accessible active-state feedback.

### UX-003 — Reduce Motion
- Priority: SHOULD
- Status: In Progress
- Requirement: shared motion respects system reduced-motion preference.

### UX-004 — Native identity/launch
- Priority: MUST
- Status: In Progress
- Requirement: final alpha uses coherent Vanta icon/splash/launch presentation without generic/broken development branding.

## RELEASE — Build/release

### REL-001 — Canonical release identity
- Priority: MUST
- Status: Done
- Requirement: root `version.json` controls release identity/build mirrors.

### REL-002 — Deterministic dependencies
- Priority: MUST
- Status: Done
- Requirement: committed `pnpm-lock.yaml` and frozen installs are used in controlled builds.

### REL-003 — Artifact provenance
- Priority: MUST
- Status: In Progress
- Requirement: distributed artifact identifies release, build and intended source Git commit.
- Known gap: PR workflow source SHA must be distinguished from synthetic merge SHA where applicable.

### REL-004 — Release tag gate
- Priority: MUST
- Status: Blocked
- Requirement: no alpha tag/GitHub Release until documented Phase 20 exit criteria are satisfied.

## OPS — Operations

### OPS-001 — Environment separation
- Priority: LATER
- Status: Backlog
- Requirement: Local/Development/Staging/Production boundaries and configuration are documented and enforced before production.

### OPS-002 — Backup/restore
- Priority: LATER
- Status: Backlog
- Requirement: database/storage backup and restore procedure is documented and restore-tested before production.

### OPS-003 — Observability
- Priority: LATER
- Status: Backlog
- Requirement: production authentication/API/wallet/game/provider health has appropriate logs, metrics, error tracking and alerts.

### OPS-004 — Incident response/rollback
- Priority: LATER
- Status: Backlog
- Requirement: release rollback, migration recovery and security/availability incident workflows are documented/testable before production.

## Requirement change rule

When behavior changes, update the affected requirement status/acceptance criteria in the same scoped work. Do not mark a requirement `Done` solely because UI exists when authoritative/provider/regulatory behavior is still blocked.
