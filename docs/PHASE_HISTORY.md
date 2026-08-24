# Vanta Phase History

This file records the chronological delivery history of the Vanta MVP. It is intended to answer: **what was implemented, in which phase, through which pull request, and what became canonical in `main`?**

For current scope and next work, use [`ROADMAP.md`](./ROADMAP.md). For architecture and project memory, use [`VANTA_PROJECT_CONTEXT.md`](./VANTA_PROJECT_CONTEXT.md).

---

## Delivery timeline

| Phase | Pull request | Main commit after phase | Status | Main outcome |
|---|---:|---|---|---|
| 01 | #1 | `c10cc77c387e9051d4ca1b3b65cca2c17483bea4` | COMPLETE | Monorepo, Expo/Go bootstrap, CI/CodeQL, security baseline |
| 02 | #5 | `2d96730bfa4532ae96176417fa62bcc6fe1a96d9` | COMPLETE | Mobile design-system foundations |
| 03 | #6 | `49edf36213b0a5bee8de09a69f416083a80c0ef3` | COMPLETE | Storybook + reusable component library |
| 04 | #7 | `5aab4a7ed78efc14a80801343804fe482fcf66a4` | COMPLETE | Navigation shell and root/session routes |
| 05 | #8 | `3f6d7420c80928024b0bae15eba788fe58da9460` | COMPLETE | Splash/onboarding/authentication UX |
| 06 | #9 | `d0ae5f362fa8f1b4940460266034ee83c319bc3b` | COMPLETE | KYC UX/provider boundary |
| 07 | #10 | `479f1c6a8d246fd5db64d5857bc7ddeab90860a9` | COMPLETE | Home experience |
| 08 | #11 | `74a49b150bca5c106d0399e72378888344e68b4c` | COMPLETE | Plinko visual + CSPRNG engine foundation; approved red palette |
| 09 | #12 | `0a155d67098c5192769d75a879b0625fce5bf3ac` | COMPLETE | Bet History / Bet Details |
| 10 | #13 | `a69acd392d828a3abbe2be47821d97bfff55db2e` | COMPLETE | Wallet experience/read models |
| 11 | #14 | `cb0cbbc42fb30d703e507861ca636df1f285f711` | COMPLETE | Deposit/withdraw UX and payment-intent contracts |
| 12 | #15 | `030bafbedff95bbdd3cbf77436f9dd9fc322dd04` | COMPLETE | Profile experience |
| 13 | #16 | `0b3e8db4a29d6aa94d831658e7420dd4346ccf1c` | COMPLETE | Security Center |
| 14 | #17 | `da58afd6331a28729f0ab5dd5c7fea5065d5f29b` | COMPLETE | Responsible Gaming controls |
| 15 | #18 | `dd7a81ca16b30dda6d13ea537ca75ad656396cce` | COMPLETE | Support + Legal + Privacy + Regulatory surfaces |
| 16 | #19 | `60082052519e05b89d4e7de1ce9477df958bf9c1` | COMPLETE | Unified system states |
| 17 | #20 | `326ce2bbb75be58ec1f4be281a410fd4f18e59f5` | COMPLETE | Executable Go/PostgreSQL/Redis backend runtime |
| 18 | #21 | `0eedc285fbf838e0e3cd3634573ad54c4a9795a8` | COMPLETE | Mobile ↔ backend integration |
| 19 | #22 | `b12c56928eba8e79f1c48a2361683e1e1746e224` | COMPLETE | Tests, security hardening, dependency audit and regression gates |
| 20 | — | — | NEXT | Native Android/iOS MVP builds and device validation |

---

## Phase 01 — Monorepo and secure bootstrap

**PR:** #1 — `chore: bootstrap Vanta monorepo foundation`

Established:

- repository governance and naming conventions;
- Expo React Native application;
- Go API bootstrap;
- PostgreSQL/Redis local-development shape;
- environment placeholder policy;
- bootstrap threat model and architecture ADR;
- CI + CodeQL + Dependabot baseline;
- client treated as untrusted from the start.

---

## Phase 02 — Design-system foundation

**PR:** #5 — `feat: establish Vanta mobile design foundations`

Established:

- typed color/typography/spacing/radius/shadow/motion tokens;
- semantic dark theme;
- code-first visual architecture.

Historical note: the active red palette was later corrected in Phase 08.

---

## Phase 03 — Storybook and component library

**PR:** #6

Added Storybook and the first reusable component set, including button/input/card/badge/tabs/segmented-control/bottom-navigation/modal/sheet/toast primitives.

Storybook became the primary code-first review mechanism after Figma was abandoned.

---

## Phase 04 — Navigation shell

**PR:** #7

Added typed Root/Main navigation, bottom tabs, explicit session-expired/account-blocked routes and the rule that route visibility is not authorization.

---

## Phase 05 — Onboarding and authentication UX

**PR:** #8

Added Splash, onboarding, age eligibility, login, account creation, verification and password-recovery/reset presentation.

At this stage authentication was still presentation-only. No session was minted locally.

---

## Phase 06 — KYC UX

**PR:** #9

Added KYC flow, document type/capture presentation, selfie/liveness presentation, processing/approved/rejected/retry states and a provider boundary.

No raw KYC media was placed in navigation or persistent client storage.

---

## Phase 07 — Home

**PR:** #10

Replaced the scaffold with the premium Home experience, wallet summary, Plinko hero, activity area and Responsible Gaming messaging.

Runtime still used disconnected financial projections until Phase 18.

---

## Phase 08 — Plinko foundation

**PR:** #11

Added:

- Skia Plinko board;
- Reanimated authoritative-result animation;
- secure backend CSPRNG engine foundation;
- versioned rules/result contract;
- structural result validation;
- corrected Vanta red palette (`#FF3B30`, `#D92D25`).

No public real-money betting endpoint was created.

---

## Phase 09 — Bet History

**PR:** #12

Added history/detail UX and server-authoritative read-model contracts. Only opaque `betId` is routed; full betting records remain server-owned.

---

## Phase 10 — Wallet

**PR:** #13

Added wallet balance/transaction presentation and detail flow. No fabricated runtime money and no client-side reconciliation were introduced.

---

## Phase 11 — Deposit / Withdraw UX

**PR:** #14

Added deposit/withdrawal amount, methods, review, processing/result UX and payment-intent contracts.

Execution remained fail-closed. No PAN/CVV/provider credentials and no real payment mutation endpoint were introduced.

---

## Phase 12 — Profile

**PR:** #15

Added privacy-minimized profile/account surfaces with masked contact information and verification/account states.

Full legal/KYC identity remains outside the general Profile read model.

---

## Phase 13 — Security Center

**PR:** #16

Added session/device Security Center UX and backend security contracts. Tokens, raw IPs, TOTP secrets and recovery codes remain outside read models/navigation.

---

## Phase 14 — Responsible Gaming

**PR:** #17

Added deposit/loss/wager/session limits, pending changes, time-out and self-exclusion boundaries.

Cooling-off/effective dates are server policy. No early self-exclusion/time-out bypass route exists.

---

## Phase 15 — Support + Legal + Privacy + Regulatory

**PR:** #18

Added:

- Support Center and guarded request flow;
- versioned legal documents;
- privacy/regulatory disclosure models;
- protection against fake licensing claims;
- privacy-minimized ticket/detail navigation.

---

## Phase 16 — System states

**PR:** #19

Introduced reusable Loading, Empty, Offline, Error and Maintenance states and applied them across the primary application surfaces.

Sensitive behavior remains fail-closed when authoritative state is unavailable.

---

## Phase 17 — Real backend runtime

**PR:** #20

Major transition from contracts to executable infrastructure:

- PostgreSQL connection pool and embedded migrations;
- Redis ephemeral controls;
- Go API runtime;
- Docker image and local Compose;
- account creation and authentication;
- bcrypt;
- AES-256-GCM protected PII;
- HMAC lookup hashes;
- opaque access/refresh sessions;
- wallet and immutable double-entry ledger;
- KYC status;
- Bet History;
- Security Center persistence/revocation;
- Responsible Gaming persistence/mutations;
- Support encrypted at rest;
- Legal/public regulatory read models;
- health/readiness/platform status;
- PostgreSQL/Redis integration tests in CI.

Real Plinko/payment/KYC-provider mutation surfaces stayed closed.

---

## Phase 18 — Mobile/backend integration

**PR:** #21

Connected the native client to the Phase 17 runtime:

- central API transport;
- SecureStore session persistence;
- rotating refresh flow;
- single-flight refresh;
- login/register/logout;
- TanStack Query;
- server-backed Profile/Wallet/Home/History/Security/RG/Support/Legal/KYC status;
- platform Maintenance and AccountBlocked coordination.

Still blocked: real-money Plinko, real payments, KYC upload/liveness, MFA enrollment and password recovery APIs.

---

## Phase 19 — Tests, Security and Audit

**PR:** #22 — `test: harden Vanta security boundaries and audit gates`

**Final main commit:** `b12c56928eba8e79f1c48a2361683e1e1746e224`

Validated/fixed findings:

- **F19-001 High:** refresh rotation race/replay → atomic compare-and-swap and fail-closed revocation;
- **F19-002 High:** authentication throttle bypass through ephemeral source port → canonical client IP bucket;
- **F19-003 Medium:** panic logger could include arbitrary recovered values → sensitive panic value removed from logs;
- **F19-004 Medium:** `TouchSession` PostgreSQL timestamp/interval parameter ambiguity → cutoff calculated safely and query corrected;
- **F19-005 High:** reachable Go dependency vulnerabilities → `pgx/v5` upgraded to `v5.9.2`, `golang.org/x/text` to `v0.39.0`, module graph normalized.

Security/regression coverage added:

- concurrent refresh replay;
- concurrent ledger overspend;
- Support IDOR;
- Security Center cross-player session revocation;
- auth throttling across changing source ports;
- strict JSON and body limits;
- server-generated request IDs;
- HTTP production security headers;
- sanitized panic responses;
- HTTPS/client API configuration tests;
- `pnpm audit`;
- `govulncheck`;
- `go test -race`;
- CodeQL JS/TS + Go.

Phase 19 passed all required gates before merge.

---

## Phase 20 — Native MVP builds

**Status:** NEXT

The next phase is intentionally focused on native build/release engineering and real-device runtime validation, **not** on enabling real-money features.

See [`ROADMAP.md`](./ROADMAP.md) for the detailed Phase 20 work breakdown and post-MVP regulated roadmap.

---

## Historical decisions that must not regress

- Product name is Vanta, not AURABET.
- Code-first + Storybook replaced Figma as the primary design workflow.
- Security is required from the beginning, not at launch.
- Mobile is untrusted.
- PostgreSQL ledger is financial truth.
- Redis is never financial truth.
- Production Plinko result is generated server-side.
- Real payment execution remains blocked until PSP/reconciliation/ledger controls exist.
- KYC media/liveness remains blocked until a provider and signed callback model exist.
- MFA enrollment/step-up remains blocked until explicitly implemented.
- No licensing claim without verified real license data.
- A native MVP build in Phase 20 is not equivalent to regulated production readiness.
