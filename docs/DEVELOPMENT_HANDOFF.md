# Vanta — Development Conversation Handoff

**Purpose:** preserve the development context established across the Vanta conversations so a future ChatGPT/Codex session can continue the repository without reconstructing decisions from chat history.

This is a normalized engineering handoff, not a raw chat transcript. It intentionally contains project/product context only and excludes unrelated personal conversation.

**Checkpoint:** Phase 19, branch `test/security-audit`, PR #22.

For canonical technical truth, use this document together with:

1. `docs/VANTA_PROJECT_CONTEXT.md`
2. `docs/ROADMAP.md`
3. `docs/PHASE_HISTORY.md`
4. `docs/security/phase19-security-audit.md`
5. current code and migrations on `main`

If any prose conflicts with executable code or migrations on `main`, the code/migrations win.

---

## 1. Product intent established in the conversations

The official product is **Vanta**. The previous name **AURABET** is obsolete and must not be reintroduced into new code, copy, documentation or build metadata.

Vanta is being developed as a native mobile betting/gaming platform. The MVP target is **v0.0.0.1** and its first game is **Plinko**. Future games may include Crash, Mines and Dice, but those are not reasons to prematurely generalize the current MVP.

The product must look and behave like a serious, premium financial/gaming product rather than a cheap casino UI. The long-term intent is a technically credible platform that can eventually satisfy the security, financial, compliance and operational requirements of regulated real-money operation. The MVP must never pretend those regulated capabilities are already production-ready.

---

## 2. Permanent working agreement from the conversations

The following rules were repeatedly established and should be treated as durable project constraints unless explicitly changed later:

- **Security is part of the architecture from the first commit.** It is never postponed to a final cleanup phase.
- When a phase is requested, implement it in the repository rather than only returning instructions or a conceptual plan.
- Do not ask unnecessary clarification questions when the next engineering action can be determined from the roadmap, repository and existing decisions.
- Every phase should use a descriptive branch, professional commits, a PR, CI/security gates and merge only after required checks are green.
- A phase is not `COMPLETE / MERGED` until the PR is actually integrated into `main`.
- Never describe disconnected/demo/Storybook values as real production state.
- Never create a fake API or local success state merely to make a screen look complete.
- The mobile application is untrusted. Authorization and regulated/financial decisions belong on the server.
- Route visibility is not authorization.
- Security, KYC, Responsible Gaming, wallet/ledger, payments and game settlement must fail closed when their authoritative backend state is unavailable.
- Use descriptive names for branches, commits, files, modules, types and functions. Avoid ambiguous names such as `update`, `changes`, `fix stuff`, `helpers2`.
- Keep the MVP development workflow free/open-source/local where practical. Do not make paid Figma or paid providers prerequisites for development.
- **Figma was abandoned.** The current design workflow is code-first React Native + Storybook.
- Update canonical documentation when a phase changes architecture, security boundaries, compliance, runtime or roadmap.

---

## 3. Design direction decided in the conversations

The visual language is premium dark technological minimalism:

- obsidian/graphite surfaces;
- restrained red brand accent;
- finance-style balances and transaction presentation;
- immersive game presentation;
- avoid excessive neon and cheap casino visual noise;
- success green is semantic, not a brand replacement;
- bottom navigation: **Home / Jogar / Carteira / Perfil**, with Jogar emphasized.

Reference products used only as product/UX research anchors include Stake, Betclic, DraftKings, FanDuel, BetMGM and regulated Portuguese operators such as Solverde.pt, Betano and ESC Online.

Approved palette:

```text
Background      #0B0D10
Surface         #12151A
Surface Raised  #181C22
Border          #252A32
Primary Red     #FF3B30
Primary Active  #D92D25
Text Primary    #F5F7FA
Text Secondary  #9299A6
Text Disabled   #5E6470
Success         #29D17D
Warning         #FFB020
Danger          #FF4D5A
```

Phase 08 corrected earlier experimental reds. New visual work should not silently restore the old palette.

---

## 4. Architecture chosen during planning

### Mobile

- React Native + TypeScript
- Expo
- React Navigation
- TanStack Query
- Zustand where appropriate for local non-authoritative state
- React Hook Form + Zod
- Reanimated
- React Native Skia
- Expo SecureStore for sensitive session credentials
- MMKV only for non-sensitive state
- Storybook for code-first UI development

### Backend

- Go
- modular monolith
- REST API first; WebSocket only where future realtime requirements justify it
- PostgreSQL as persistent canonical state
- Redis only for ephemeral coordination, cache and rate limiting
- transactional outbox foundation rather than introducing Kafka in the MVP
- Docker runtime
- GitHub Actions CI
- OpenTelemetry as observability direction
- Terraform/IaC as deployment direction

### Admin

A future/partial `apps/admin` surface is planned with Next.js + React + TypeScript + TanStack Query + Zod, but it is not the current MVP focus.

Microservices are not a goal by themselves. The modular monolith remains the correct architecture until scaling/operational evidence justifies decomposition.

---

## 5. Financial model that must not be weakened

The conversations explicitly rejected a simple mutable user-balance architecture.

Canonical financial concepts are based on:

```text
wallets
ledger_accounts
ledger_transactions
ledger_entries
bets
settlement state
```

Important rules:

- immutable/double-entry-style ledger;
- ledger entries balance to zero;
- financial mutations are transactional;
- integer minor units are used for money;
- EUR is currently the MVP currency contract;
- idempotency is mandatory for financial command boundaries;
- authenticated principal determines player/wallet ownership;
- concurrent requests must not overspend the wallet;
- Redis never becomes financial truth;
- PSP success alone never directly becomes canonical balance;
- provider reconciliation + ledger posting determine financial effect;
- the mobile client never optimistically changes canonical balances after a deposit, withdrawal, wager or payout.

---

## 6. Plinko decision history

Plinko is deliberately **server-authoritative**.

The backend owns:

1. authentication;
2. player/account/KYC/jurisdiction/Responsible Gaming eligibility;
3. ruleset validation;
4. stake validation;
5. reservation/posting of funds;
6. CSPRNG outcome generation;
7. path/slot/multiplier/payout calculation;
8. settlement through the ledger;
9. bet/audit persistence.

The mobile client owns only presentation and animation of the server-authorized result.

The React Native client must not contain the production RNG, private RNG material or authoritative payout calculation.

The visual Plinko experience and backend engine foundation exist, but **no public real-money Plinko bet-placement endpoint is currently allowed**. Do not open it merely to make the app feel more complete.

---

## 7. Identity/session security decisions

Current intended session model:

- PostgreSQL-backed registration/login;
- bcrypt password hashing;
- PII encrypted using AES-256-GCM;
- HMAC-SHA256 protected deterministic lookup where required;
- opaque short-lived access tokens;
- opaque rotating refresh tokens;
- refresh tokens stored server-side only as hashes;
- SecureStore on the mobile side;
- single-flight refresh coordination in the app;
- remote logout/session revocation;
- Redis-backed authentication throttling;
- session/device tracking.

Phase 19 found and fixed a real concurrent refresh race by converting rotation to compare-and-swap on the expected refresh hash + generation. Concurrent reuse of one generation must fail closed and revoke the session.

Phase 19 also fixed authentication rate-limit fragmentation caused by using `RemoteAddr` including the ephemeral TCP port. The rate-limit subject is now canonicalized to an IP before hashing.

Do not trust arbitrary `X-Forwarded-For`/similar headers. A trusted-proxy policy is still required before a Cloudflare/reverse-proxy production deployment.

---

## 8. KYC/compliance decisions

The KYC UI and KYC status integration exist, but production document/liveness processing does not.

Still closed:

- camera/document provider integration;
- liveness provider integration;
- signed provider callbacks;
- callback replay protection;
- verified production media handling;
- final jurisdiction and SRIJ licensing/certification work.

Legal/regulatory UI must never claim that Vanta is licensed when verified operator/license configuration does not exist.

---

## 9. Payments decisions

Deposit and withdrawal UX exists, including amount/method/review/processing/result presentation and provider boundaries.

Actual execution remains intentionally unavailable.

Before payment execution can open, the project still requires:

- authenticated server-side payment intents;
- KYC/AML/jurisdiction/Responsible Gaming checks;
- PSP tokenization/hosted SDK integration;
- no storage/logging of PAN/CVV;
- verified withdrawal destination ownership;
- signed provider webhooks;
- replay protection;
- idempotent webhook processing;
- reconciliation;
- canonical ledger posting;
- risk/fraud controls;
- approved step-up/MFA policy for withdrawals.

Storybook success screens are visual fixtures only and are never evidence that a real payment succeeded.

---

## 10. Responsible Gaming decisions

Implemented concepts include:

- deposit limits;
- loss limits;
- wager limits;
- session-duration limits;
- pending changes;
- server-defined cooling-off/effective dates;
- time-out;
- self-exclusion.

The client sends requests; the server owns policy and enforcement.

There is deliberately no client command to cancel time-out early or remove self-exclusion. Protection cannot be downgraded by local state.

---

## 11. Security Center decisions

Security Center includes sessions/devices, session details and server-authoritative revocation. Route parameters use opaque session IDs rather than full session records.

Tokens, cookies, refresh hashes, TOTP secrets, recovery codes, raw passkey material and other authentication secrets must remain outside read models/navigation/UI.

MFA enrollment and step-up authentication are still future blockers and must not be simulated locally.

---

## 12. Support / Legal / Privacy decisions

Support is authenticated and player-scoped. Ticket bodies are encrypted at rest and request lookup must enforce ownership to prevent IDOR.

The support channel must not request or accept secrets such as:

- passwords;
- OTPs;
- access/refresh tokens;
- recovery codes;
- PAN/CVV;
- raw KYC media.

Legal/Privacy/Regulatory content is read-only, versioned and configuration-driven. Production operator/license claims require real verified data.

---

## 13. System-state decisions

The mobile UI has standardized states:

```text
Loading
Empty
Offline
Error
Maintenance
```

Maintenance is a trusted platform/backend state, not a local toggle.

When backend state is unavailable, regulated/security/financial operations remain fail closed.

---

## 14. Why Docker is not required on the developer machine yet

A specific conversation decision was to continue the work through GitHub and CI rather than block progress on local environment setup.

Docker is never installed on the mobile device. It is a backend/development-runtime concern.

The current CI can provision ephemeral PostgreSQL and Redis and can validate:

- migrations;
- integration tests;
- race detector;
- API build;
- Docker image;
- Compose model;
- vulnerability scanning.

Local Docker/Android Studio/native setup becomes materially necessary when performing native/device validation, especially in Phase 20.

Until then, development can continue in repository + CI without requiring the developer workstation to be configured first.

---

## 15. Phase history checkpoint from the conversations

The following phase sequence is the project history and must not be reconstructed differently in a new session:

| Phase | Result |
| --- | --- |
| 01 | Monorepo + secure configuration |
| 02 | Design-system foundations |
| 03 | Storybook + foundational components |
| 04 | Navigation + app shell |
| 05 | Splash + onboarding + Auth UX |
| 06 | KYC UX foundation |
| 07 | Home |
| 08 | Plinko visual + server-authoritative engine foundation |
| 09 | Bet History |
| 10 | Wallet |
| 11 | Deposit / Withdraw experience |
| 12 | Profile |
| 13 | Security Center |
| 14 | Responsible Gaming |
| 15 | Support + Legal + Privacy + Regulatory |
| 16 | System States |
| 17 | Executable Go/PostgreSQL/Redis backend runtime |
| 18 | Real Mobile ↔ Backend integration |
| 19 | Tests + Security + Audit |
| 20 | Native MVP builds/device validation |

Exact PR numbers, merge SHAs and detailed outcomes are maintained in `docs/PHASE_HISTORY.md`.

Phases 01–18 are merged. Phase 19 is PR #22 at this handoff checkpoint and must remain `IN PROGRESS` until its final required CI/CodeQL checks are green and it is merged.

---

## 16. Phase 19 security findings discovered during the conversation

The Phase 19 work is not theoretical. The new tests/scanners exposed real issues.

Validated fixes include:

1. **High — refresh-token concurrent replay race**
   - fixed using compare-and-swap on expected hash + generation;
   - regression tested against PostgreSQL with concurrent refreshes.

2. **High — authentication rate-limit bucket fragmentation**
   - `RemoteAddr` source ports could create separate buckets;
   - fixed by canonicalizing the IP before the limiter hashes it.

3. **Medium — panic-value logging**
   - arbitrary panic values could contain sensitive/request-derived data;
   - logs no longer emit the recovered panic value.

4. **Medium — `TouchSession` SQL type defect**
   - PostgreSQL rejected the previous timestamp/interval expression for the bound parameter;
   - fixed by computing the cutoff in Go and using typed timestamp comparisons.

5. **High — reachable Go dependency vulnerabilities**
   - `GO-2026-5004` affected `github.com/jackc/pgx/v5 v5.7.6`;
   - fixed target: `pgx/v5 v5.9.2`;
   - `GO-2026-5970` affected `golang.org/x/text v0.28.0`;
   - fixed target: `x/text v0.39.0`;
   - module graph is normalized with the `go mod tidy` selected compatible `x/sync` version.

The security audit source of truth is `docs/security/phase19-security-audit.md`.

---

## 17. Required CI/security discipline

The expected pull-request gate set now includes:

### Mobile

- `pnpm audit --audit-level=high`;
- TypeScript;
- Vitest API/security boundary tests;
- Android app export/bundle validation;
- Storybook Android export/bundle validation.

### Backend

- clean Go module graph / `go mod tidy`;
- `gofmt`;
- PostgreSQL + Redis integration runtime;
- `go test -race ./...`;
- `go vet ./...`;
- `govulncheck`;
- API binary build;
- API Docker image build;
- Docker Compose validation.

### Static security

- CodeQL JavaScript/TypeScript;
- CodeQL Go.

A required red gate is a blocker. Do not merge around it merely to advance the roadmap.

---

## 18. Capabilities that remain intentionally closed

A future session must not accidentally interpret the existence of UI/contracts as evidence that the following capabilities are production-enabled:

```text
Real-money Plinko placement      CLOSED
Deposit execution                CLOSED
Withdrawal execution             CLOSED
Production KYC upload/liveness   CLOSED
MFA enrollment                   CLOSED
Withdrawal step-up auth          CLOSED
Password recovery/reset API      CLOSED
Production regulatory license    NOT CLAIMED
```

These boundaries are architectural safety controls, not unfinished cosmetic buttons to be bypassed.

---

## 19. Phase 20 intent after Phase 19

Phase 20 is the native MVP build/device-validation phase.

It should produce reproducible Android/iOS development or preview builds and validate the actual native runtime boundaries, while keeping regulated real-money mutations closed.

Important Phase 20 areas:

- Expo/native configuration audit;
- app identifiers/package/bundle IDs;
- development/preview/production build profiles without committed secrets;
- icon/splash/native metadata;
- SecureStore verification on native runtime;
- Skia/Reanimated native behavior;
- HTTPS/API environment injection;
- Android build artifact;
- iOS configuration/build path subject to signing/account constraints;
- physical/emulator smoke tests;
- login/register/refresh/logout;
- Maintenance and AccountBlocked routing;
- Profile/Wallet/History/Security/RG/Support/Legal against backend;
- Plinko visual performance only;
- sensitive-data/log review;
- signing/key documentation.

Phase 20 is **not** the regulated production launch.

---

## 20. Roadmap after the native MVP build

The conversations established that work must continue beyond Phase 20 before real-money production can be considered:

- Phase 21 — production environment + observability;
- Phase 22 — device trust + MFA/step-up;
- Phase 23 — production KYC/AML provider;
- Phase 24 — payment provider + reconciliation;
- Phase 25 — production Plinko betting pipeline;
- Phase 26 — risk/fraud + operational admin;
- Phase 27 — regulatory readiness/certification;
- Phase 28 — independent security assessment;
- Phase 29 — regulated store/release readiness;
- Phase 30 — regulated production launch only when evidence exists for every prerequisite.

`docs/ROADMAP.md` owns detailed exit criteria.

---

## 21. How future ChatGPT/Codex sessions should behave

When the developer says variants of `start phase N`, `continue`, `next`, or `faça a N` and the roadmap/repository already makes the next action clear:

1. inspect `main`, open PRs and canonical docs;
2. continue from the actual repository state, not remembered assumptions;
3. create/use the descriptive phase branch;
4. implement the requested work rather than only describing it;
5. preserve security/compliance boundaries;
6. run/follow CI and security scanners;
7. fix real failures on the branch;
8. merge only when required gates are green;
9. update canonical documentation in the same work;
10. report the real merged/in-progress state precisely.

Do not ask the developer to repeat context that is already in these documents.

---

## 22. Resume checklist

A fresh session should read, in order:

1. `docs/README.md`
2. `docs/VANTA_PROJECT_CONTEXT.md`
3. `docs/DEVELOPMENT_HANDOFF.md`
4. `docs/ROADMAP.md`
5. `docs/PHASE_HISTORY.md`
6. the current phase-specific architecture/security document
7. open PRs and current `main`

Then continue from the first incomplete roadmap item.

This file exists specifically so the Vanta project no longer depends on retaining the original chat history.