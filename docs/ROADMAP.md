# Vanta Roadmap

**Canonical roadmap.** If an older plan conflicts with this file, this file wins unless `main` code/migrations prove a newer state.

Last consolidated: **2026-08-24** during Phase 19 / PR #22.

---

## Roadmap status legend

- `COMPLETE / MERGED` — implemented, validated and integrated into `main`.
- `IN PROGRESS` — active branch/PR, not yet canonical in `main`.
- `NEXT` — next planned phase after the current phase is merged.
- `PLANNED` — sequenced future work.
- `BLOCKED` — intentionally unavailable until prerequisites exist.

---

# MVP v0.0.0.1 — Core phases

## Phase 01 — Monorepo + secure configuration

**Status:** COMPLETE / MERGED

Delivered:

- monorepo scaffold;
- Expo mobile application;
- Go backend bootstrap;
- CI and CodeQL baseline;
- environment examples and Git hygiene;
- initial security boundaries.

---

## Phase 02 — Design-system foundations

**Status:** COMPLETE / MERGED

Delivered tokens/theme and reusable styling foundations.

Later correction: Phase 08 normalized the active brand palette to the approved Vanta reds `#FF3B30` and `#D92D25`.

---

## Phase 03 — Storybook + foundational components

**Status:** COMPLETE / MERGED

Delivered code-first Storybook and foundational components including buttons, inputs, cards, badges, tabs, segmented controls, bottom navigation, modal/sheet and toast primitives.

---

## Phase 04 — Navigation + application shell

**Status:** COMPLETE / MERGED

Delivered React Navigation root/main structure, main tabs and typed route boundaries.

---

## Phase 05 — Splash + onboarding + authentication UX

**Status:** COMPLETE / MERGED

Delivered the presentation/forms for onboarding, eligibility, login, account creation, verification and password recovery/reset surfaces.

Important historical note: Phase 05 was presentation-only. Real login/register/session integration arrived in Phases 17–18.

---

## Phase 06 — KYC UX foundation

**Status:** COMPLETE / MERGED

Delivered KYC navigation and presentation for document type/capture, selfie, processing, approval/rejection/retry states.

Still blocked for production: real camera/upload/liveness provider and signed callbacks.

---

## Phase 07 — Home

**Status:** COMPLETE / MERGED

Delivered premium home/dashboard UX, wallet summary presentation, featured Plinko, activity area and Responsible Gaming messaging.

Real data integration arrived in Phase 18.

---

## Phase 08 — Plinko visual + authoritative engine foundation

**Status:** COMPLETE / MERGED

Delivered:

- corrected approved red palette;
- Skia/Reanimated/Worklets mobile dependencies;
- Plinko board/controls/UI;
- server-side Plinko rules validation and CSPRNG engine foundation;
- authoritative result contracts.

Still blocked: public real-money bet placement and production payout/ruleset approval.

---

## Phase 09 — Bet History

**Status:** COMPLETE / MERGED

Delivered bet-history list/detail UX, opaque `betId` routing, read models and IDOR-safe future ownership boundary.

Real PostgreSQL/API integration arrived in Phases 17–18.

---

## Phase 10 — Wallet

**Status:** COMPLETE / MERGED

Delivered read-only premium wallet experience, transaction history/detail, privacy hide/show and financial read models.

Real PostgreSQL/API integration arrived in Phases 17–18.

---

## Phase 11 — Deposit / Withdraw experience

**Status:** COMPLETE / MERGED

Delivered deposit/withdrawal UX, method/amount/review/status contracts and provider boundaries.

**Execution remains BLOCKED** until production payment provider, signed webhooks, reconciliation, ownership, step-up policy and ledger integration are intentionally opened.

---

## Phase 12 — Profile

**Status:** COMPLETE / MERGED

Delivered privacy-minimized profile/account UX, masked contact fields, verification/account states and access to Security, Responsible Gaming, Support and Legal.

---

## Phase 13 — Security Center

**Status:** COMPLETE / MERGED

Delivered Security Center UI and backend contracts for sessions/devices, MFA state surfaces and session revocation.

Real PostgreSQL-backed session operations arrived in Phase 17 and mobile integration in Phase 18.

MFA enrollment/step-up remains blocked.

---

## Phase 14 — Responsible Gaming

**Status:** COMPLETE / MERGED

Delivered limits, pending changes, server-defined cooling-off, time-out and self-exclusion UX/contracts.

Phase 17 made state persistent/server-authoritative; Phase 18 connected mobile mutations/read models.

---

## Phase 15 — Support + Legal + Privacy + Regulatory Information

**Status:** COMPLETE / MERGED

Delivered:

- Support Center and player-scoped request model;
- legal/privacy/regulatory surfaces;
- versioned legal documents;
- operator/regulatory disclosure model;
- protection against fabricated licensed state.

---

## Phase 16 — System States

**Status:** COMPLETE / MERGED

Delivered reusable Loading, Empty, Offline, Error and Maintenance states, including platform-controlled maintenance routing and fail-closed behavior for sensitive operations.

---

## Phase 17 — Executable backend runtime

**Status:** COMPLETE / MERGED

Delivered the real backend foundation:

- Go API runtime;
- PostgreSQL + migrations;
- Redis;
- Docker and Compose;
- identity/auth/session persistence;
- bcrypt;
- AES-256-GCM PII protection + HMAC lookup;
- wallet/immutable double-entry ledger;
- bet history;
- KYC status;
- Responsible Gaming state/commands;
- Support;
- Legal;
- platform health/status;
- integration CI with PostgreSQL/Redis.

Intentionally did not expose production Plinko placement or real payment execution.

---

## Phase 18 — Mobile ↔ Backend integration

**Status:** COMPLETE / MERGED

Delivered:

- central API client;
- Expo SecureStore session persistence;
- rotating access/refresh session flow;
- single-flight refresh;
- login/register/logout integration;
- TanStack Query integration;
- Profile, Wallet, Home, Bet History, Bet Details;
- Security Center/session revocation;
- Responsible Gaming reads/mutations;
- Support;
- Legal;
- KYC status;
- Maintenance/AccountBlocked routing.

Still intentionally blocked: real-money Plinko, payments, KYC upload/liveness, MFA enrollment and password recovery endpoints.

---

## Phase 19 — Tests + Security + Audit

**Status:** IN PROGRESS — PR #22

Goal: make security and regression checks executable gates before native MVP builds.

Implemented during the phase:

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

### Phase 19 exit criteria

All must be green on the final merge candidate:

```text
Mobile dependency audit
Mobile TypeScript
Mobile API/security tests
Android application export
Storybook Android export
Go module graph
Gofmt
Go race/integration tests
Go vet
Govulncheck
API binary build
Docker image build
Docker Compose validation
CodeQL JavaScript/TypeScript
CodeQL Go
```

Then:

1. update final audit state;
2. squash merge PR #22;
3. mark Phase 19 `COMPLETE / MERGED` in this file;
4. begin Phase 20 from current `main`.

---

# Phase 20 — Native MVP builds and device validation

**Status:** NEXT

## Objective

Produce reproducible Android/iOS native MVP builds from the integrated application and validate native runtime behavior without opening any capability that remains regulator/provider/security blocked.

Phase 20 is a **development/preview release engineering phase**, not real-money production launch.

## 20.1 Native configuration audit

- inspect current Expo configuration and Prebuild requirements;
- confirm Android application ID and iOS bundle identifier naming;
- normalize app display name/version/build-number strategy;
- remove obsolete AURABET naming/assets if any remain;
- verify orientation/status-bar/safe-area configuration;
- verify Reanimated/Worklets/Skia native setup;
- verify SecureStore native setup;
- check Android/iOS minimum supported OS targets;
- document any native modules requiring dev builds rather than Expo Go.

## 20.2 Build profiles

Define reproducible profiles, preferably:

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

Where EAS is used, configure it as build infrastructure, not as a source of application secrets committed to the repository.

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
- installable artifact (APK for direct internal testing where appropriate, and/or AAB for release pipeline validation);
- documented build command/process;
- version/build metadata captured;
- no bundled secrets.

## 20.5 iOS MVP build

Target deliverables:

- validated iOS native configuration;
- successful simulator/dev/preview build where signing/account constraints permit;
- documented Apple signing/provisioning requirements;
- no fake claim of App Store readiness if an Apple developer account/signing step remains external.

## 20.6 Device smoke tests

Test at minimum:

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
- deep/navigation state does not expose sensitive payloads.

### Integrated feature reads

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

## 20.7 Security checks for native artifact

- verify tokens are not in logs;
- verify tokens are not in AsyncStorage/MMKV;
- verify API URL/env configuration contains no privileged secret;
- inspect bundled configuration for accidental credentials;
- confirm HTTPS enforcement outside development;
- verify debug/dev conveniences are not enabled in a production profile;
- document Android backup/export rules and iOS secure-storage behavior;
- ensure no public real-money endpoint was accidentally opened during build work.

## 20.8 Phase 20 deliverables

Expected repository outputs:

- native/build configuration;
- build profiles;
- build/release documentation;
- smoke-test checklist and results;
- MVP release notes;
- artifact/version metadata;
- CI/build validation updates;
- explicit list of external signing/account steps if they cannot be completed inside repository automation.

## 20.9 Phase 20 exit criteria

Phase 20 can be marked complete when:

1. Android native preview/development build succeeds.
2. iOS native build path is validated and either succeeds or has only clearly documented external signing/account blockers.
3. core native modules initialize correctly.
4. integrated API/session smoke tests pass on native runtime.
5. no sensitive secret appears in build artifacts/config/logging.
6. Phase 19 security gates remain green.
7. blocked regulated capabilities remain blocked.
8. build/release documentation is current.

---

# Post-MVP regulated roadmap

The original 20-phase plan ends with a native MVP build. The following work is required before real-money production and should not be confused with Phase 20.

## Phase 21 — Production environment + observability foundation

**Status:** PLANNED

- deployment architecture;
- staging/production separation;
- PostgreSQL managed production design;
- Redis production isolation/auth/networking;
- OpenTelemetry traces/metrics/logs;
- alerts/SLOs;
- secret/KMS strategy;
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
- step-up policy for sensitive actions, especially withdrawals/account changes.

## Phase 23 — Production KYC/AML provider

**Status:** PLANNED / PROVIDER DEPENDENT

- provider adapter;
- document/selfie/liveness flow;
- signed callbacks;
- callback replay protection;
- KYC media handling policy;
- AML/sanctions/PEP workflow where required;
- audit/review states.

## Phase 24 — Payment provider + reconciliation

**Status:** PLANNED / PROVIDER DEPENDENT

- deposit provider;
- withdrawal provider;
- PSP tokenization;
- signed webhooks;
- idempotent webhook handling;
- withdrawal destination ownership;
- reconciliation;
- financial ledger integration;
- fraud/risk checks.

## Phase 25 — Production Plinko betting pipeline

**Status:** PLANNED

- approved ruleset/payout configuration;
- authenticated placement endpoint;
- all policy enforcement before reservation;
- idempotent wager reservation;
- authoritative CSPRNG result;
- transactional settlement;
- immutable ledger/bet/audit records;
- replay/duplicate handling;
- abuse/rate controls;
- full integration tests under concurrency/failure.

## Phase 26 — Risk, fraud and operational admin

**Status:** PLANNED

- risk engine foundation;
- fraud signals;
- manual review workflows;
- operational/admin console;
- least-privilege admin roles;
- audit trail;
- protected support/compliance tooling.

## Phase 27 — Regulatory readiness and certification

**Status:** PLANNED / JURISDICTION DEPENDENT

For Portugal this includes final legal/regulatory work with the relevant authorities and specialists, including SRIJ requirements where applicable.

- operator/legal entity configuration;
- approved terms/privacy/cookies/rules;
- licensing/certification requirements;
- Responsible Gaming verification;
- complaints/support process;
- data-protection review;
- regulatory reporting/audit requirements.

No `licensed` UI state may be configured before actual verified license data exists.

## Phase 28 — Independent security assessment

**Status:** PLANNED

- independent penetration test;
- mobile/API review;
- infrastructure review;
- remediation;
- retest;
- certification/security evidence package where required.

## Phase 29 — Store/release readiness for regulated product

**Status:** PLANNED

- Apple/Google gambling-app policy review;
- distribution/jurisdiction controls;
- age/location requirements;
- production signing/release process;
- store disclosures/privacy metadata;
- release rollback/incident playbooks.

## Phase 30 — Regulated production launch

**Status:** BLOCKED until all required technical, security, provider, store and regulatory prerequisites are complete.

Launch readiness requires evidence, not only code completion.

---

# Current next action

Finish **Phase 19 / PR #22** with every security and CI gate green. Then merge it and start **Phase 20** from the resulting `main` branch.
