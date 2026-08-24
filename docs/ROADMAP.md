# Vanta Roadmap

**Canonical roadmap.** If an older plan conflicts with this file, this file wins unless current `main` code/migrations prove a newer state.

Last consolidated: **2026-08-24**, after Phase 19 was merged.

---

## Status legend

- `COMPLETE / MERGED` — implemented, validated and integrated into `main`.
- `IN PROGRESS` — active branch/PR, not yet canonical in `main`.
- `NEXT` — next planned phase.
- `PLANNED` — sequenced future work.
- `BLOCKED` — intentionally unavailable until prerequisites exist.

---

# MVP v0.0.0.1 — Core phases

## Phase 01 — Monorepo + secure configuration
**Status:** COMPLETE / MERGED

Monorepo scaffold, Expo mobile app, Go backend bootstrap, CI/CodeQL baseline, environment placeholders and security/governance rules.

## Phase 02 — Design-system foundations
**Status:** COMPLETE / MERGED

Typed design tokens and dark-theme foundations. Phase 08 later normalized the active brand palette to approved Vanta reds `#FF3B30` and `#D92D25`.

## Phase 03 — Storybook + foundational components
**Status:** COMPLETE / MERGED

Code-first Storybook and reusable mobile component library.

## Phase 04 — Navigation + application shell
**Status:** COMPLETE / MERGED

Typed React Navigation root/main structure, main tabs and explicit session/account routes.

## Phase 05 — Splash + onboarding + authentication UX
**Status:** COMPLETE / MERGED

Onboarding, eligibility, login, account creation, verification and password-recovery presentation. Real session integration arrived in Phases 17–18.

## Phase 06 — KYC UX foundation
**Status:** COMPLETE / MERGED

Document/selfie/processing/approval/retry UX and KYC provider boundary. Real upload/liveness provider remains blocked.

## Phase 07 — Home
**Status:** COMPLETE / MERGED

Premium home/dashboard UX. Real server-backed data integration arrived in Phase 18.

## Phase 08 — Plinko visual + authoritative engine foundation
**Status:** COMPLETE / MERGED

Skia/Reanimated/Worklets Plinko UI, server-side CSPRNG engine foundation, rules/result contracts and corrected Vanta red palette.

Public real-money placement remains blocked.

## Phase 09 — Bet History
**Status:** COMPLETE / MERGED

Read-only bet-history/detail UX with opaque `betId` navigation and server-authoritative read models.

## Phase 10 — Wallet
**Status:** COMPLETE / MERGED

Wallet/transaction UX and financial read-model boundaries. PostgreSQL/ledger integration arrived in Phases 17–18.

## Phase 11 — Deposit / Withdraw experience
**Status:** COMPLETE / MERGED

Deposit/withdrawal amount, method, review and status UX plus payment-intent/provider contracts.

**Execution remains BLOCKED** until production PSP, signed webhooks, reconciliation, step-up policy and ledger integration are intentionally opened.

## Phase 12 — Profile
**Status:** COMPLETE / MERGED

Privacy-minimized profile/account UX with masked identity/contact information and feature entry points.

## Phase 13 — Security Center
**Status:** COMPLETE / MERGED

Sessions/devices/security UX and server-side security contracts. Real session persistence/revocation arrived in Phase 17 and mobile integration in Phase 18.

MFA enrollment/step-up remains blocked.

## Phase 14 — Responsible Gaming
**Status:** COMPLETE / MERGED

Limits, cooling-off, time-out and self-exclusion UX/contracts, later persisted/integrated in Phases 17–18.

## Phase 15 — Support + Legal + Privacy + Regulatory Information
**Status:** COMPLETE / MERGED

Support requests, legal/privacy/regulatory surfaces, versioned documents and protection against fabricated licensing claims.

## Phase 16 — System States
**Status:** COMPLETE / MERGED

Reusable Loading, Empty, Offline, Error and Maintenance states with fail-closed behavior.

## Phase 17 — Executable backend runtime
**Status:** COMPLETE / MERGED

Real Go runtime with PostgreSQL, Redis, migrations, Docker/Compose, auth/sessions, PII encryption, wallet/ledger, history, KYC status, Responsible Gaming, Support, Legal, platform status and integration CI.

Real Plinko/payment/KYC-provider mutation surfaces remained deliberately closed.

## Phase 18 — Mobile ↔ Backend integration
**Status:** COMPLETE / MERGED

Real API client, SecureStore session management, rotating refresh flow, login/register/logout and server-backed Profile, Wallet, Home, History, Security, Responsible Gaming, Support, Legal, KYC status and Maintenance/AccountBlocked coordination.

## Phase 19 — Tests + Security + Audit
**Status:** COMPLETE / MERGED

Final merge commit on `main`:

```text
b12c56928eba8e79f1c48a2361683e1e1746e224
```

Delivered:

- mobile Vitest API/security tests;
- `pnpm audit --audit-level=high`;
- PostgreSQL/Redis security integration tests;
- `go test -race`;
- `go vet`;
- `govulncheck`;
- refreshed security audit record;
- refresh-token compare-and-swap against concurrent replay;
- canonical-IP auth throttling;
- panic-log data minimization;
- `TouchSession` timestamp fix;
- concurrent wallet overspend test;
- Support/Security ownership/IDOR tests;
- strict JSON/body/request-ID/security-header tests;
- reachable dependency remediation for `pgx` and `x/text`.

All required Phase 19 gates passed before merge.

---

# Phase 20 — Native MVP builds and device validation

**Status:** NEXT

## Objective

Produce reproducible Android/iOS native MVP builds from the integrated application and validate native runtime behavior without opening any capability that remains regulator/provider/security blocked.

Phase 20 is a **development/preview release-engineering phase**, not real-money production launch.

## 20.1 Native configuration audit

- inspect current Expo configuration and Prebuild requirements;
- confirm Android application ID and iOS bundle identifier naming;
- normalize app display name/version/build-number strategy;
- remove obsolete AURABET naming/assets if any remain;
- verify orientation/status-bar/safe-area configuration;
- verify Reanimated/Worklets/Skia native setup;
- verify SecureStore native setup;
- check Android/iOS minimum supported OS targets;
- document native modules requiring dev builds rather than Expo Go.

## 20.2 Build profiles

Define reproducible profiles:

```text
development
preview
production
```

Rules:

- no production secrets committed to Git;
- environment-specific API base URLs injected through supported build/deployment configuration;
- `EXPO_PUBLIC_VANTA_ENV` remains explicit;
- production-like profiles reject plaintext HTTP;
- signing credentials are handled outside source control.

Where EAS is used, it is build infrastructure, not a source of secrets committed to the repository.

## 20.3 Branding/native assets

Validate and normalize:

- application icon;
- Android adaptive icon;
- splash screen;
- dark launch background;
- app name and native metadata;
- required privacy/permission strings.

No paid design tooling is required.

## 20.4 Android MVP build

Target deliverables:

- successful native Android development/preview build;
- installable artifact (APK for internal testing where appropriate and/or AAB for pipeline validation);
- documented build process;
- version/build metadata captured;
- no bundled secrets.

## 20.5 iOS MVP build

Target deliverables:

- validated iOS native configuration;
- successful simulator/dev/preview build where signing/account constraints permit;
- documented Apple signing/provisioning requirements;
- no false claim of App Store readiness if an external Apple developer account/signing step remains.

## 20.6 Device smoke tests

### Session

- fresh install;
- register;
- login;
- SecureStore persistence;
- app restart;
- access-token refresh;
- refresh-token rotation;
- logout;
- revoked/expired session behavior.

### Navigation/platform state

- Maintenance;
- AccountBlocked;
- offline/error states;
- background/foreground transition;
- no sensitive payload in navigation state.

### Integrated features

- Home;
- Wallet;
- Bet History/Details;
- Profile;
- Security Center;
- Responsible Gaming;
- Support;
- Legal;
- KYC status.

### Native rendering/performance

- Plinko Skia rendering;
- animation/frame behavior;
- Reanimated/Worklets;
- safe areas;
- keyboard behavior;
- screen-size/responsive layout;
- accessibility basics.

## 20.7 Native artifact security checks

- tokens absent from logs;
- tokens absent from AsyncStorage/MMKV;
- API URL/env config contains no privileged secret;
- bundled configuration contains no credentials;
- HTTPS enforced outside development;
- debug/dev conveniences disabled in production profile;
- Android backup/export and iOS secure-storage behavior reviewed;
- no public real-money endpoint accidentally opened.

## 20.8 Phase 20 repository deliverables

Expected outputs:

- native/build configuration;
- build profiles;
- build/release documentation;
- smoke-test checklist and results;
- MVP release notes;
- artifact/version metadata;
- CI/build validation updates;
- explicit external signing/account steps where they cannot be automated in repository tooling.

## 20.9 Phase 20 exit criteria

Phase 20 can be marked complete when:

1. Android native preview/development build succeeds.
2. iOS native build path is validated and either succeeds or has only clearly documented external signing/account blockers.
3. core native modules initialize correctly.
4. integrated API/session smoke tests pass on native runtime.
5. no sensitive secret appears in artifacts/config/logging.
6. Phase 19 security gates remain green.
7. blocked regulated capabilities remain blocked.
8. build/release documentation is current.

---

# Post-MVP regulated roadmap

The original 20-phase plan ends with a native MVP build. The following work is required before real-money production and must not be confused with Phase 20.

## Phase 21 — Production environment + observability foundation
**Status:** PLANNED

- staging/production deployment architecture;
- managed PostgreSQL/Redis design;
- OpenTelemetry traces/metrics/logs;
- alerts/SLOs;
- production secrets/KMS strategy;
- backup/restore/DR;
- infrastructure as code;
- trusted reverse-proxy policy.

## Phase 22 — Device trust + MFA/step-up
**Status:** PLANNED

- Play Integrity;
- App Attest;
- jailbreak/root risk signals;
- MFA enrollment;
- recovery controls;
- step-up policy for withdrawals and other sensitive actions.

## Phase 23 — Production KYC/AML provider
**Status:** PLANNED / PROVIDER DEPENDENT

- provider adapter;
- document/selfie/liveness flow;
- signed callbacks;
- callback replay protection;
- KYC media policy;
- AML/sanctions/PEP workflow where required;
- audit/manual-review states.

## Phase 24 — Payment provider + reconciliation
**Status:** PLANNED / PROVIDER DEPENDENT

- deposit/withdraw provider adapters;
- PSP tokenization;
- signed webhooks;
- idempotent webhook processing;
- destination ownership;
- reconciliation;
- ledger integration;
- fraud/risk checks.

## Phase 25 — Production Plinko betting pipeline
**Status:** PLANNED

- approved production ruleset/payout configuration;
- authenticated placement endpoint;
- policy enforcement before reservation;
- idempotent wager reservation;
- authoritative CSPRNG result;
- transactional settlement;
- immutable ledger/bet/audit records;
- replay/duplicate controls;
- concurrency/failure testing.

## Phase 26 — Risk, fraud and operational admin
**Status:** PLANNED

- risk/fraud foundation;
- manual review;
- operational/admin console;
- least-privilege roles;
- audit trails;
- protected support/compliance tooling.

## Phase 27 — Regulatory readiness and certification
**Status:** PLANNED / JURISDICTION DEPENDENT

For Portugal, final legal/regulatory work must satisfy applicable SRIJ and data-protection requirements where relevant.

- operator/legal entity configuration;
- approved terms/privacy/cookies/rules;
- licensing/certification;
- Responsible Gaming verification;
- complaints/support process;
- data-protection review;
- reporting/audit requirements.

No `licensed` UI state may be configured before actual verified license data exists.

## Phase 28 — Independent security assessment
**Status:** PLANNED

- independent penetration test;
- mobile/API/infrastructure review;
- remediation;
- retest;
- evidence package where required.

## Phase 29 — Store/release readiness for regulated product
**Status:** PLANNED

- Apple/Google gambling-app policy review;
- jurisdiction/distribution controls;
- age/location requirements;
- production signing/release process;
- privacy/store metadata;
- rollback/incident playbooks.

## Phase 30 — Regulated production launch
**Status:** BLOCKED until all required technical, security, provider, store and regulatory prerequisites are complete.

Launch readiness requires evidence, not only code completion.

---

# Current next action

Start **Phase 20** from `main` at or after `b12c56928eba8e79f1c48a2361683e1e1746e224`, after this documentation checkpoint is merged.
