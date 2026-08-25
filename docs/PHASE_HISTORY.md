# Vanta Phase History

This file records the chronological delivery history of the Vanta MVP. It answers: **what was implemented, in which phase, through which pull request, and what became canonical in `main`?**

For current scope use [`ROADMAP.md`](./ROADMAP.md). For recoverable project memory use [`VANTA_PROJECT_CONTEXT.md`](./VANTA_PROJECT_CONTEXT.md).

---

## Delivery timeline

| Phase | Pull request | Main commit after phase | Status | Main outcome |
|---|---:|---|---|---|
| 01 | #1 | `c10cc77c387e9051d4ca1b3b65cca2c17483bea4` | COMPLETE | Monorepo, Expo/Go bootstrap, CI/CodeQL, security baseline |
| 02 | #5 | `2d96730bfa4532ae96176417fa62bcc6fe1a96d9` | COMPLETE | Mobile design-system foundations |
| 03 | #6 | `49edf36213b0a5bee8de09a69f416083a80c0ef3` | COMPLETE | Storybook + reusable component library |
| 04 | #7 | `5aab4a7ed78efc14a80801343804fe482fcf66a4` | COMPLETE | Navigation shell and root/session routes |
| 05 | #8 | `3f6d7420c80928024b0bae15eba788fe58da9460` | COMPLETE | Splash/onboarding/auth UX |
| 06 | #9 | `d0ae5f362fa8f1b4940460266034ee83c319bc3b` | COMPLETE | KYC UX/provider boundary |
| 07 | #10 | `479f1c6a8d246fd5db64d5857bc7ddeab90860a9` | COMPLETE | Home |
| 08 | #11 | `74a49b150bca5c106d0399e72378888344e68b4c` | COMPLETE | Plinko visual + authoritative outcome foundation; red palette |
| 09 | #12 | `0a155d67098c5192769d75a879b0625fce5bf3ac` | COMPLETE | Bet History / Details |
| 10 | #13 | `a69acd392d828a3abbe2be47821d97bfff55db2e` | COMPLETE | Wallet |
| 11 | #14 | `cb0cbbc42fb30d703e507861ca636df1f285f711` | COMPLETE | Deposit/withdraw UX/contracts |
| 12 | #15 | `030bafbedff95bbdd3cbf77436f9dd9fc322dd04` | COMPLETE | Profile |
| 13 | #16 | `0b3e8db4a29d6aa94d831658e7420dd4346ccf1c` | COMPLETE | Security Center |
| 14 | #17 | `da58afd6331a28729f0ab5dd5c7fea5065d5f29b` | COMPLETE | Responsible Gaming |
| 15 | #18 | `dd7a81ca16b30dda6d13ea537ca75ad656396cce` | COMPLETE | Support + Legal + Privacy + Regulatory |
| 16 | #19 | `60082052519e05b89d4e7de1ce9477df958bf9c1` | COMPLETE | System states |
| 17 | #20 | `326ce2bbb75be58ec1f4be281a410fd4f18e59f5` | COMPLETE | Executable Go/PostgreSQL/Redis runtime |
| 18 | #21 | `0eedc285fbf838e0e3cd3634573ad54c4a9795a8` | COMPLETE | Mobile ↔ backend integration |
| 19 | #22 | `b12c56928eba8e79f1c48a2361683e1e1746e224` | COMPLETE | Tests/security/audit/regression gates |
| 20 | #24 | — | IN PROGRESS | Native Android/iOS builds, physical-device validation, alpha product/release polish |

---

## Phase 01 — Monorepo and secure bootstrap

**PR:** #1 — `chore: bootstrap Vanta monorepo foundation`

Established repository governance/naming, Expo React Native application, Go API bootstrap, PostgreSQL/Redis local-development shape, environment placeholder policy, bootstrap threat model/architecture, CI + CodeQL baseline and untrusted-client rule.

## Phase 02 — Design-system foundation

**PR:** #5 — `feat: establish Vanta mobile design foundations`

Established typed color/typography/spacing/radius/shadow/motion tokens and semantic dark theme. The active red palette was later corrected in Phase 08.

## Phase 03 — Storybook and component library

**PR:** #6

Added Storybook and reusable component primitives. Storybook became the primary code-first visual review mechanism after Figma was abandoned as the required primary workflow.

## Phase 04 — Navigation shell

**PR:** #7

Added typed Root/Main navigation, bottom tabs and explicit session/account routes. Permanent rule: route visibility is never authorization.

## Phase 05 — Onboarding/auth UX

**PR:** #8

Added Splash, onboarding, age eligibility, login, account creation, verification and password recovery/reset presentation. Authentication was still presentation-only at this phase.

## Phase 06 — KYC UX

**PR:** #9

Added KYC flow, document/capture presentation, selfie/liveness presentation, processing/approved/rejected/retry states and provider boundary. Raw KYC media was not placed in navigation or client persistent storage.

## Phase 07 — Home

**PR:** #10

Added premium Home/dashboard, wallet summary, Plinko hero, activity area and Responsible Gaming messaging. Runtime data became server-backed later in Phase 18.

## Phase 08 — Plinko foundation

**PR:** #11

Added Skia board, Reanimated result animation foundation, server authoritative outcome foundation, versioned result/rules contracts, structural result validation and approved Vanta reds `#FF3B30` / `#D92D25`.

No public production game endpoint was opened.

## Phase 09 — Bet History

**PR:** #12

Added history/detail UX and server-authoritative read-model boundaries with opaque `betId` navigation.

## Phase 10 — Wallet

**PR:** #13

Added wallet balance/transaction presentation and details. No fabricated runtime money or client-side reconciliation.

## Phase 11 — Deposit / Withdraw UX

**PR:** #14

Added amount, method, review, processing/result UX and provider contracts. Execution remained fail-closed.

## Phase 12 — Profile

**PR:** #15

Added privacy-minimized Profile/account surfaces with masked contact information and verification/account states.

## Phase 13 — Security Center

**PR:** #16

Added session/device Security Center UX and contracts. Sensitive session secrets remain outside read models/navigation.

## Phase 14 — Responsible Gaming

**PR:** #17

Added deposit/loss/wager/session limits, pending changes, time-out and self-exclusion boundaries. Client cannot weaken server protection.

## Phase 15 — Support + Legal + Privacy + Regulatory

**PR:** #18

Added Support Center, guarded support request flow, versioned legal documents, privacy/regulatory disclosure models and protection against fabricated licensing claims.

## Phase 16 — System states

**PR:** #19

Introduced reusable Loading, Empty, Offline, Error and Maintenance states. Sensitive behavior remains fail-closed when authoritative state is unavailable.

## Phase 17 — Executable backend runtime

**PR:** #20

Major transition to executable infrastructure:
- PostgreSQL migrations/pool;
- Redis ephemeral controls;
- Go API;
- Docker/Compose;
- account/auth;
- bcrypt;
- AES-256-GCM PII protection;
- HMAC lookup;
- opaque access/refresh sessions;
- wallet/ledger;
- KYC status;
- Bet History;
- Security Center persistence/revocation;
- Responsible Gaming;
- encrypted Support;
- Legal/public regulatory read models;
- health/readiness/status;
- PostgreSQL/Redis CI integration.

Production game/payment/KYC-provider mutation surfaces stayed closed.

## Phase 18 — Mobile/backend integration

**PR:** #21

Connected central API client, SecureStore session persistence, rotating refresh, single-flight refresh, login/register/logout, TanStack Query and server-backed Profile/Wallet/Home/History/Security/RG/Support/Legal/KYC plus Maintenance/AccountBlocked coordination.

Still blocked: production game actions, real payments, KYC upload/liveness, MFA enrollment and password-recovery APIs.

## Phase 19 — Tests, Security and Audit

**PR:** #22 — `test: harden Vanta security boundaries and audit gates`

**Final main commit:** `b12c56928eba8e79f1c48a2361683e1e1746e224`

Validated/fixed:
- **F19-001 High:** refresh rotation race/replay → atomic compare-and-swap + fail-closed revocation;
- **F19-002 High:** auth throttle bucket source-port bypass → canonical client IP;
- **F19-003 Medium:** panic logger arbitrary recovered value → sensitive value removed;
- **F19-004 Medium:** PostgreSQL timestamp/interval ambiguity → query/cutoff corrected;
- **F19-005 High:** reachable Go dependency vulnerabilities → dependency upgrade/module normalization.

Coverage included refresh replay concurrency, ledger overspend concurrency, Support IDOR, cross-player session revocation, auth throttling, strict JSON/body limits, request IDs, production security headers, sanitized panic responses, HTTPS/API config boundaries, dependency audits, `go test -race`, `go vet`, `govulncheck` and CodeQL.

All required gates passed before merge.

---

## Phase 20 — Native MVP Builds and Device Validation

**PR:** #24  
**Branch:** `feat/phase20-native-builds`  
**Status:** IN PROGRESS  
**Branch head at 2026-08-25 documentation checkpoint start:** `fd215a0c45d657b58623f26146ffdf1700e04335`

Phase 20 is native/release/device validation, not a production launch.

### Native/build work completed so far

- native application IDs/bundle IDs/URL scheme;
- development/preview/production EAS profiles;
- Android clean prebuild/debug APK workflow;
- workflow simplified to one physical-device debug APK;
- Windows physical-device development helper;
- PostgreSQL 18 development-volume compatibility fix;
- API/Metro LAN/firewall setup;
- successful physical Android runtime.

### Physical Android validation

Observed working:
- onboarding;
- registration;
- login;
- Home;
- Profile;
- KYC/account status;
- Wallet;
- Deposit presentation;
- Plinko protected mode;
- logout → login.

### Phase 20 issues found

**P20-001 — PostgreSQL 18 mount:** old data-mount layout broke container startup; moved to PostgreSQL 18-compatible named volume at `/var/lib/postgresql`.

**P20-002 — Windows Docker/WSL2:** Docker required WSL2/VirtualMachinePlatform environment readiness.

**P20-003 — Metro physical device:** installed debug APK did not match assumed Expo dev-client QR path; manual React Native debug server host `<LAN_IP>:8081` successfully connected the device.

**P20-004 — Metro cache/runtime:** reload produced `EventEmitter` undefined; clean Metro/cache restart restored runtime without rebuilding native APK.

**P20-005 — registration password mismatch:** backend required minimum 12 characters while mobile UI/schema previously used 10; mobile schema aligned to backend minimum.

**P20-006 — Wallet null transactions:** backend nil slice serialized as `transactions: null`; mobile called `.length`. Fixed backend empty array + provider normalization + UI guard.

Relevant commits:
- `21e44eaec1efd23f68641853fd131abe1795e623`;
- `e1921a929adbf9e26b084648bfe2489d4eb4b021`;
- `fd215a0c45d657b58623f26146ffdf1700e04335`.

**P20-007 — stale login error:** previous invalid-credential message could remain visible after a later successful authentication. Still open UI debt.

**P20-008 — excessive Android artifacts:** workflow reduced to one physical-device debug APK to avoid unnecessary build time.

### Product decisions added during Phase 20

- player UI should not expose engineering architecture copy;
- Legal Center should contain full applicable terms/policies;
- bottom nav needs icons + motion;
- app needs final assets and native launch/splash branding;
- session must persist through minimize/close/reopen;
- routine reopen must not require password;
- sensitive actions should later use step-up;
- versioning must use controlled SemVer/build/tag/release metadata;
- iOS physical validation remains pending without an iPhone; use CI/simulator/build path first;
- game mathematics/RTP/house edge/exposure/risk of ruin becomes a first-class production prerequisite;
- commercial strategy must evaluate B2B Vanta Originals/technology vs carefully selected B2C launch market;
- corporate/tax strategy must be lawful and transparent.

See:
- `docs/context/2026-08-25-phase20-strategy-checkpoint.md`;
- `docs/VANTA_PRODUCT_BUSINESS_STRATEGY.md`;
- `docs/release/phase20-troubleshooting-and-findings.md`;
- `docs/release/versioning-and-release-governance.md`.

### Phase 20 is not complete

Pending includes persistent session force-close/reopen, silent token refresh, revocation evidence, stale login-error fix, password-copy alignment, copy cleanup, icon/splash/motion, Legal Center review, version normalization, artifact inspection, remaining integrated-screen smoke tests, iOS build/simulator path and physical iOS test later.

Do not merge PR #24 only because the APK renders.

---

## Historical decisions that must not regress

- Product name is Vanta, not AURABET.
- Code-first + Storybook replaced Figma as primary design workflow.
- Security is required from the beginning.
- Mobile is untrusted.
- PostgreSQL ledger is financial truth.
- Redis is never financial truth.
- Production game outcome is server-side.
- Outcomes are not altered per player to protect operator economics.
- Real payment execution remains blocked until provider/reconciliation/ledger controls exist.
- KYC media/liveness remains blocked until provider + signed callbacks exist.
- MFA/step-up remains blocked until implemented.
- No licensing claim without verified license data.
- Closing/minimizing the app should not force routine re-login.
- Native MVP build is not regulated production readiness.
- Project phase number is not application version.
- Lawful tax/entity planning is acceptable; concealment/evasion is not.
