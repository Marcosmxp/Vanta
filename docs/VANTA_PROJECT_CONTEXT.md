# Vanta — Master Project Context

**Purpose:** this file is the recoverable project memory for Vanta. A new ChatGPT/Codex session should be able to read this document and continue development without relying on old chat history.

**Last consolidated:** 2026-08-24, during Phase 19 (`test/security-audit`, PR #22).

---

## 1. Product identity

- Official product name: **Vanta**.
- Repository: `Marcosmxp/Vanta`.
- Default branch: `main`.
- Product: native mobile betting/gaming platform under active development.
- Current MVP version target: **v0.0.0.1**.
- First game: **Plinko**.
- Possible later games: Crash, Mines, Dice and other server-authoritative games.
- Product goal for the MVP: build the complete technical/product foundation without pretending that regulated real-money capabilities exist before their providers, policies and certifications are actually ready.

The former name **AURABET** is obsolete. Any PDF, DOCX, screenshot or planning artifact using AURABET must be treated as historical unless explicitly migrated to Vanta.

---

## 2. Permanent development rules

These decisions were established during the project and must be preserved unless deliberately changed by a later ADR:

1. **Security is an architectural requirement from day one.** It is not a final hardening pass.
2. Mobile is always an **untrusted client**.
3. Financial truth and game outcomes are **server-authoritative**.
4. PostgreSQL is the canonical persistent source of truth for financial and regulated state.
5. Redis is only for ephemeral/cache/rate-limit/coordination use; it must never become financial truth.
6. No secrets, RNG secrets, privileged credentials, database credentials, PSP credentials or admin credentials belong in the client.
7. No fabricated production financial state. Storybook fixtures are allowed only as isolated presentation fixtures.
8. No local client state may approve authentication, KYC, MFA, Responsible Gaming protection, deposits, withdrawals, settlements or account privilege.
9. Financial mutations require idempotency and auditable server-side processing.
10. Route visibility is never authorization. Every server operation derives ownership from the authenticated principal.
11. Commits, branches, files, modules, types and functions must use professional, descriptive names. Avoid ambiguous names such as `update`, `fix stuff`, `changes`, `helpers2`.
12. Prefer free/open-source/local development tooling for the MVP. Do not make paid Figma or paid providers a development dependency.
13. Figma was explicitly abandoned as the primary workflow. Vanta uses **code-first design + Storybook**.
14. Never claim a regulated capability, provider integration, license, successful payment or approved KYC state that does not actually exist.

---

## 3. Visual/product direction

Vanta should feel like a premium financial product with gaming capability, not a cheap casino interface.

### References used for product direction

- Stake: Originals/game UX/Plinko patterns.
- Betclic: mobile navigation.
- DraftKings: wallet/account/product architecture.
- FanDuel: betting interaction and bottom navigation patterns.
- BetMGM: premium dark visual language.
- Portuguese regulated operators such as Solverde.pt, Betano and ESC Online: KYC/deposit/wallet/compliance UX references.

### Approved visual language

- premium dark technological minimalism;
- obsidian/graphite surfaces;
- red accent;
- fintech-style wallet and transaction treatment;
- immersive game surface;
- avoid excessive neon and cheap casino styling;
- semantic green only for success;
- bottom navigation: **Home / Jogar / Carteira / Perfil**, with Jogar emphasized.

### Approved palette

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

Typography direction: Inter/Geist-like, with tabular finance numbers.

Phase 08 corrected earlier experimental reds. Approved red tokens must remain based on `#FF3B30` / `#D92D25` unless a deliberate design-system change is approved later.

---

## 4. Repository shape

Canonical monorepo structure:

```text
Vanta/
├── apps/
│   ├── mobile/
│   └── admin/
├── backend/
├── packages/
├── contracts/
├── infrastructure/
├── docs/
├── scripts/
├── .github/workflows/
├── .gitignore
└── README.md
```

`apps/admin` is a planned/partial product surface and is not the current MVP focus.

---

## 5. Mobile architecture

### Technology

- React Native + TypeScript.
- Expo.
- React Navigation.
- TanStack Query.
- Zustand where local feature state is appropriate.
- React Hook Form + Zod.
- React Native Reanimated.
- React Native Skia.
- Expo SecureStore for sensitive session credentials.
- MMKV only for non-sensitive local data when needed.
- Storybook for code-first component and screen review.

Phase 18 added the real API/session infrastructure. Sensitive tokens must remain in secure storage, not AsyncStorage/MMKV/navigation/logs/analytics.

### Navigation shape

Root-level state supports:

- Auth
- KYC
- Main
- SessionExpired
- AccountBlocked
- Maintenance

Main contains the tab shell plus typed stack destinations such as bet history/details, wallet transaction details, Security Center, Responsible Gaming, Support and Legal.

Opaque IDs may be used in route params (`betId`, `transactionId`, `sessionId`, `requestId`, `documentId`). Full financial/security/KYC records must not be routed between screens.

---

## 6. Backend architecture

### Technology

- Go modular monolith.
- REST HTTP APIs; WebSocket remains optional for future realtime game needs.
- PostgreSQL.
- Redis for ephemeral coordination/rate limiting/cache only.
- Transactional Outbox foundation rather than Kafka in the MVP.
- Docker for local/runtime packaging.
- GitHub Actions for CI.
- OpenTelemetry remains the observability direction.
- Terraform/infrastructure-as-code remains the deployment direction.
- Cloudflare may be used at the edge, but trusted-proxy policy must be explicit before production.

### Domain boundaries

Current/target modules include:

- identity/auth
- identity/security
- player/profile
- kyc
- wallet
- ledger
- betting/history
- games/plinko
- payments
- compliance/legal
- responsiblegaming
- support
- platform/status
- risk/fraud/notification/audit as later expansion areas

Microservices are not required for the MVP. Keep the modular monolith unless actual scaling/operational evidence justifies decomposition.

---

## 7. Financial architecture

Canonical concepts:

```text
wallets
ledger_accounts
ledger_transactions
ledger_entries
bets
bet_settlements / settlement state
```

The ledger is immutable/double-entry style. Mutable `users.balance`-style fields are not acceptable as financial truth.

Important invariants:

- ledger entries must sum to zero per financial transaction;
- financial posting is transactional;
- wallet/player ownership is validated server-side;
- idempotency is mandatory for financial command boundaries;
- overspend is prevented under concurrent requests;
- Redis never decides canonical balances;
- payment-provider success alone must not directly mutate the wallet; reconciliation + ledger posting own the canonical effect.

Phase 19 added concurrent overspend regression testing against real PostgreSQL.

---

## 8. Game architecture — Plinko

Plinko is designed as a completely **server-authoritative** game.

Server responsibilities:

1. authenticate and identify player;
2. validate account/KYC/jurisdiction/Responsible Gaming state;
3. validate the approved ruleset and stake;
4. reserve/post money transactionally;
5. generate outcome with CSPRNG;
6. determine path/slot/multiplier/payout;
7. settle through the ledger;
8. persist bet/audit data;
9. return the authorized result.

Mobile responsibilities:

- collect allowed stake/risk/row selection;
- request the authorized action;
- render/animate the result returned by the server;
- refresh authoritative wallet/history state.

The client must never generate the production RNG result or infer canonical payout.

**Current boundary:** the visual Plinko foundation and backend engine exist, but no public production real-money bet-placement endpoint is exposed yet. This is intentional.

---

## 9. Identity and session model

Implemented runtime foundation includes:

- registration and login backed by PostgreSQL;
- bcrypt password hashing;
- PII protection using AES-256-GCM;
- deterministic lookup protection using HMAC-SHA256;
- opaque access tokens with short lifetime;
- opaque rotating refresh tokens stored server-side only as hashes;
- session/device records;
- revocation;
- refresh replay/race detection;
- Redis-backed authentication throttling;
- SecureStore-backed mobile session persistence;
- single-flight refresh coordination in the mobile client;
- logout with remote revocation.

Phase 19 hardened refresh rotation with an atomic compare-and-swap on expected token hash + generation and added a concurrent replay integration test.

Rate limiting now normalizes `RemoteAddr` to canonical IP rather than using ephemeral TCP ports as part of the bucket key.

Before Cloudflare/reverse-proxy deployment, a trusted-proxy policy must be designed so forwarding headers are accepted only from trusted proxy networks.

---

## 10. KYC and compliance state

Implemented:

- KYC UX foundation;
- KYC status model and PostgreSQL persistence;
- mobile integration for status;
- legal/privacy/regulatory surfaces;
- versioned legal documents/read models;
- operator/regulatory disclosure contracts;
- explicit prevention of fabricated `licensed` state without configured operator/license references.

Not implemented/open for production:

- document upload provider;
- camera/liveness provider;
- signed KYC provider callbacks;
- callback replay protection;
- production verified-media handling;
- final SRIJ licensing/certification;
- final jurisdiction-specific legal approval.

Vanta must never display an unverified claim that it is licensed for real-money operation.

---

## 11. Payments

Mobile deposit/withdraw flows and provider contracts exist. They provide amount/method/review/processing/result UX and Storybook states.

Actual execution remains closed until there is a secure PSP integration.

Required before opening real payment mutation:

- authenticated server-side payment intents;
- server-side limits/KYC/AML/jurisdiction/Responsible Gaming checks;
- PSP tokenization/hosted SDK; Vanta must not store PAN/CVV;
- withdrawal destination ownership;
- signed webhooks;
- webhook replay protection + idempotent processing;
- reconciliation;
- ledger posting as canonical financial effect;
- fraud/risk controls;
- approved withdrawal step-up/MFA policy.

---

## 12. Responsible Gaming

Implemented UI and server-backed state include:

- deposit limits;
- loss limits;
- wager limits;
- session-duration limits;
- pending changes;
- cooling-off/effective-at policy determined server-side;
- time-out;
- self-exclusion;
- idempotent mutation commands;
- mobile integration/refetch of authoritative state.

There is no client command to end a time-out early or cancel self-exclusion. Protection enforcement must remain server-side and fail-closed.

---

## 13. Support, Legal and regulatory information

Support:

- authenticated/player-scoped requests;
- idempotent creation;
- encrypted message bodies at rest;
- ownership checks against IDOR;
- request detail by opaque `requestId`.

Legal:

- public/read-only legal center;
- versioned documents;
- integrity metadata;
- privacy/controller/regulator disclosure models;
- no fabricated production channels/license/operator information.

Sensitive content such as passwords, OTPs, tokens, recovery codes, PAN/CVV or raw KYC media must not be collected through support flows.

---

## 14. System states

Phase 16 introduced reusable application states:

- Loading
- Empty
- Offline
- Error
- Maintenance

Sensitive operations remain fail-closed during unavailable states. Maintenance is server/platform-controlled rather than a local client toggle.

---

## 15. Runtime and environments

Phase 17 established the executable backend runtime:

- PostgreSQL migrations;
- Redis connection;
- Go API process;
- Docker image;
- Docker Compose development runtime;
- `.env.example` including `EXPO_PUBLIC_VANTA_ENV=development`;
- readiness/health endpoints;
- platform status;
- request IDs;
- security headers/timeouts/recovery;
- CI integration services for PostgreSQL and Redis.

Docker is a development/server concern, never something installed on the mobile device.

Development can continue through GitHub/CI without requiring the developer workstation to have Docker until local/device testing becomes necessary.

---

## 16. Security posture as of Phase 19

Phase 19 introduced explicit security regression gates and an audit record.

Validated/fixed issues include:

1. High — refresh-token rotation race/replay was made atomic.
2. High — authentication rate-limit buckets no longer include ephemeral source ports.
3. Medium — arbitrary panic values are no longer emitted in logs.
4. Medium — `TouchSession` timestamp comparison was corrected and no longer relies on ambiguous PostgreSQL parameter interval arithmetic.
5. High/Dependency — reachable vulnerabilities identified by `govulncheck` required upgrading `github.com/jackc/pgx/v5` to `v5.9.2` and `golang.org/x/text` to `v0.39.0`; `x/sync` resolves to the tidy-selected compatible version.

Security regression coverage includes:

- refresh replay concurrency;
- ledger overspend concurrency;
- Support IDOR;
- Security Center cross-player revocation;
- authentication throttling across changing TCP ports;
- strict JSON/body limits;
- server-generated request IDs;
- production HTTP security headers;
- sanitized panic responses;
- mobile HTTPS configuration;
- mobile API error/204/invalid-JSON behavior;
- dependency audits and vulnerability scans.

See `docs/security/phase19-security-audit.md` for the detailed record.

---

## 17. CI quality gates

Current pull-request validation is intended to include:

### Mobile

- workspace dependency installation;
- `pnpm audit --audit-level=high`;
- TypeScript typecheck;
- Vitest API/security boundary tests;
- Android application bundle/export validation;
- Storybook Android bundle/export validation.

### Backend

- Go module graph / `go mod tidy` cleanliness;
- `gofmt`;
- PostgreSQL + Redis integration runtime;
- `go test -race ./...`;
- `go vet ./...`;
- `govulncheck`;
- API binary build;
- API Docker image build;
- Docker Compose model validation.

### Static security

- CodeQL JavaScript/TypeScript;
- CodeQL Go.

A phase should not be merged while a required gate is red.

---

## 18. Current phase status

At this consolidation point:

- Phases 01–18: **COMPLETE / MERGED**.
- Phase 19: **IN PROGRESS / PR #22**, with security findings fixed and final CI being revalidated after dependency/audit/documentation updates.
- Phase 20: **NEXT** after Phase 19 is fully green and merged.

Do not claim Phase 19 complete until PR #22 is merged to `main`.

---

## 19. Phase 20 — intended goal

Phase 20 is the **MVP native build and device-validation phase**, not a declaration of regulated production readiness.

Primary objective:

> Produce reproducible Android and iOS development/preview builds from the integrated Vanta mobile application, validate them on native runtime boundaries, and document the release process without opening any still-blocked real-money capability.

Planned work:

- audit Expo/native configuration;
- normalize app identifiers/package names/bundle IDs;
- define development/preview/production build profiles without committing secrets;
- configure icons, adaptive icon, splash and native metadata;
- validate SecureStore, Reanimated, Skia and native dependencies in actual native builds;
- configure environment injection for API base URL and environment marker;
- validate network security configuration (HTTPS outside development);
- Android build pipeline and installable artifact;
- iOS build configuration and artifact path where signing/account constraints permit;
- smoke-test checklist on physical Android and iOS devices/emulators;
- validate login/register/session refresh/logout;
- validate Maintenance/AccountBlocked routing;
- validate Wallet/Profile/History/Security/RG/Support/Legal against backend;
- validate Plinko visual performance without enabling real-money placement;
- verify no sensitive token/data appears in logs, navigation state or bundled config;
- document signing/key handling and what must move to managed production secret storage;
- version MVP build metadata and release notes;
- keep deposit/withdraw, production KYC, MFA and production Plinko mutations closed.

Phase 20 exit criteria are detailed in `docs/ROADMAP.md`.

---

## 20. Explicit blockers after Phase 20

Even a successful Phase 20 build does **not** mean Vanta can operate with real money.

Still required before regulated production:

- trusted reverse-proxy/client-IP policy;
- Play Integrity / App Attest and device-abuse strategy;
- MFA enrollment + step-up authentication;
- production KYC provider and signed callbacks;
- production PSP and reconciliation;
- production Plinko ruleset + public authoritative placement/settlement endpoint;
- full Responsible Gaming enforcement at every financial/game command;
- production KMS/HSM/secrets/key rotation;
- risk/fraud controls;
- observability/alerting/SLOs;
- infrastructure/deployment hardening;
- backups/restore/DR exercises;
- full legal/regulatory/licensing work;
- store policy approval for gambling products;
- independent security assessment / penetration testing;
- regulatory certification where required.

---

## 21. How a new development session should resume

When continuing Vanta in a new chat/Codex session:

1. Read `docs/README.md`.
2. Read this file completely.
3. Read `docs/ROADMAP.md`.
4. Read the current phase-specific document/security audit.
5. Inspect `main` and open PRs before assuming a phase status.
6. Never restore an old plan merely because an older document mentions it.
7. Continue from the first incomplete roadmap item.
8. Keep security boundaries and disabled regulated capabilities intact unless the corresponding server/provider work is intentionally being implemented.

This file is the project-context checkpoint intended to prevent loss of decisions across chats and development environments.
