# Vanta Phase History

This document is the chronological implementation history for Vanta. It complements `VANTA_PROJECT_CONTEXT.md` and `ROADMAP.md` and must not override current code or migrations on `main`.

Last consolidated: **2026-08-25**, during Phase 19 (`test/security-audit`, PR #22).

## Status legend

- `COMPLETE / MERGED` — integrated into `main`.
- `IN PROGRESS` — active branch/PR, not yet canonical in `main`.
- `PLANNED` — future work.

## MVP v0.0.0.1 history

| Phase | Status | PR | Main result |
| --- | --- | --- | --- |
| 01 — Monorepo + secure configuration | COMPLETE / MERGED | #1 | `c10cc77…` |
| 02 — Design-system foundations | COMPLETE / MERGED | #5 | `2d96730…` |
| 03 — Storybook + foundational components | COMPLETE / MERGED | #6 | `49edf362…` |
| 04 — Navigation + app shell | COMPLETE / MERGED | #7 | `5aab4a7…` |
| 05 — Splash + onboarding + Auth UX | COMPLETE / MERGED | #8 | `3f6d7420c80928024b0bae15eba788fe58da9460` |
| 06 — KYC UX foundation | COMPLETE / MERGED | #9 | `d0ae5f362fa8f1b4940460266034ee83c319bc3b` |
| 07 — Home | COMPLETE / MERGED | #10 | `479f1c6a8d246fd5db64d5857bc7ddeab90860a9` |
| 08 — Plinko visual + authoritative engine foundation | COMPLETE / MERGED | #11 | `74a49b150bca5c106d0399e72378888344e68b4c` |
| 09 — Bet History | COMPLETE / MERGED | #12 | `0a155d67098c5192769d75a879b0625fce5bf3ac` |
| 10 — Wallet | COMPLETE / MERGED | #13 | `a69acd392d828a3abbe2be47821d97bfff55db2e` |
| 11 — Deposit / Withdraw experience | COMPLETE / MERGED | #14 | `cb0cbbc42fb30d703e507861ca636df1f285f711` |
| 12 — Profile | COMPLETE / MERGED | #15 | `030bafbedff95bbdd3cbf77436f9dd9fc322dd04` |
| 13 — Security Center | COMPLETE / MERGED | #16 | `0b3e8db4a29d6aa94d831658e7420dd4346ccf1c` |
| 14 — Responsible Gaming | COMPLETE / MERGED | #17 | `da58afd6331a28729f0ab5dd5c7fea5065d5f29b` |
| 15 — Support + Legal + Privacy + Regulatory | COMPLETE / MERGED | #18 | `dd7a81ca16b30dda6d13ea537ca75ad656396cce` |
| 16 — System States | COMPLETE / MERGED | #19 | `60082052519e05b89d4e7de1ce9477df958bf9c1` |
| 17 — Executable backend runtime | COMPLETE / MERGED | #20 | `326ce2bbb75be58ec1f4be281a410fd4f18e59f5` |
| 18 — Mobile ↔ Backend integration | COMPLETE / MERGED | #21 | `0eedc285fbf838e0e3cd3634573ad54c4a9795a8` |
| 19 — Tests + Security + Audit | IN PROGRESS | #22 | pending final green gates + merge |
| 20 — Native MVP builds/device validation | NEXT | — | starts after Phase 19 |

## Phase outcomes and important decisions

### Phase 01

Created the monorepo, Expo mobile application, Go backend baseline, GitHub Actions and CodeQL. Security boundaries and environment hygiene were established from the beginning.

### Phase 02

Created design-system tokens/theme. Phase 08 later corrected the active brand red palette to the approved `#FF3B30` / `#D92D25` values.

### Phase 03

Added code-first Storybook and foundational mobile components. This became the primary visual workflow after Figma was abandoned.

### Phase 04

Established typed React Navigation boundaries and the root/main shell.

### Phase 05

Implemented onboarding/authentication presentation. Authentication was intentionally presentation-only at this stage; real sessions arrived in Phases 17–18.

### Phase 06

Implemented KYC presentation/navigation while keeping document upload, camera/liveness and provider approval unavailable.

### Phase 07

Implemented the Home experience and disconnected financial/game summaries. Real data integration arrived in Phase 18.

### Phase 08

Implemented the Plinko mobile visual surface and server-side CSPRNG/rules engine foundation. The mobile client never became authoritative for outcomes. Public real-money placement remains closed.

### Phase 09

Implemented Bet History and Bet Details with opaque `betId` navigation and ownership/IDOR boundaries.

### Phase 10

Implemented the read-only Wallet and financial transaction detail experience. PostgreSQL/ledger-backed data arrived later.

### Phase 11

Implemented deposit/withdraw forms, review/status UX and payment provider contracts. Real PSP execution remains intentionally blocked.

### Phase 12

Implemented privacy-minimized Profile using masked contact information and account/verification states.

### Phase 13

Implemented Security Center sessions/devices/MFA presentation and session-management contracts. Phase 17 added persistence and Phase 18 added mobile integration. MFA enrollment remains closed.

### Phase 14

Implemented server-authoritative Responsible Gaming controls: limits, pending changes, cooling-off, time-out and self-exclusion. The client cannot cancel protection locally.

### Phase 15

Implemented authenticated Support plus versioned Legal/Privacy/Regulatory surfaces. Runtime cannot claim a licensed state without configured operator/license evidence.

### Phase 16

Standardized Loading, Empty, Offline, Error and Maintenance behavior. Sensitive actions remain fail-closed during unavailable states.

### Phase 17

Converted the backend from contracts/read models into an executable Go runtime with PostgreSQL, Redis, migrations, Docker, real identity/session persistence, encrypted PII, wallet/immutable double-entry ledger, Responsible Gaming, Support, Legal and integration CI.

### Phase 18

Connected the mobile application to the real API: login/register/logout, SecureStore session persistence, single-flight rotating refresh, Profile, Wallet, Home, Bet History/Details, Security Center, Responsible Gaming, Support, Legal, KYC status and platform Maintenance/AccountBlocked state.

### Phase 19

Current security/audit phase. Validated findings already fixed include refresh-token concurrent replay, authentication rate-limit fragmentation by ephemeral TCP ports, panic-value logging, the `TouchSession` timestamp query defect, and reachable dependency vulnerabilities in `pgx` / `x/text`. New regression gates include mobile Vitest, dependency audits, PostgreSQL/Redis integration tests, `go test -race`, `govulncheck`, Docker/Compose validation and CodeQL.

Phase 19 must not be marked complete until PR #22 is fully green and merged.

## Work after the MVP build phase

Phase 20 ends the original MVP build roadmap. It does **not** authorize real-money production.

The regulated roadmap then continues with:

- Phase 21 — production environment + observability;
- Phase 22 — device trust + MFA/step-up;
- Phase 23 — production KYC/AML provider;
- Phase 24 — payment provider + reconciliation;
- Phase 25 — production Plinko betting pipeline;
- Phase 26 — risk/fraud + operational admin;
- Phase 27 — regulatory readiness/certification;
- Phase 28 — independent security assessment;
- Phase 29 — regulated store/release readiness;
- Phase 30 — regulated production launch, blocked until all prerequisites have evidence.

For detailed remaining work and exit criteria, always use `docs/ROADMAP.md`.
