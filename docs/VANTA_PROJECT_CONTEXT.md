# Vanta — Master Project Context

**Purpose:** recoverable project memory for Vanta. A new ChatGPT/Codex session should be able to read this file and continue without relying on old chat history.

**Last consolidated:** 2026-08-25 during Phase 20 on `feat/phase20-native-builds` / PR #24.

---

## 1. Product identity and current state

- Official product name: **Vanta**.
- Repository: `Marcosmxp/Vanta`.
- Default branch: `main`.
- Active Phase 20 branch: `feat/phase20-native-builds`.
- Active PR: **#24 — Native MVP Builds and Device Validation**.
- Phases 01–19 are complete/merged on `main`.
- Phase 20 is **IN PROGRESS** and is not yet safe to merge.
- First Vanta Original: **Plinko**.
- Possible later games: Crash, Mines, Dice and other server-authoritative games.
- Product direction: premium mobile gaming product with fintech-grade financial UX and security, not a visually noisy generic casino.
- Current regulated boundary: production game actions, live payment execution, production KYC upload/liveness, production MFA/step-up and licensing claims remain intentionally blocked.

The former product name **AURABET** is obsolete. Historical files using that name do not override current Vanta documents.

### Current native-version reality

The repository currently has inconsistent version declarations:
- `apps/mobile/app.json`: marketing version `0.0.1`, Android `versionCode: 1`, iOS `buildNumber: 1`;
- root/mobile `package.json`: `0.0.0`.

This is recognized technical debt. Release/version policy is now defined in `docs/release/versioning-and-release-governance.md`. Phase numbering is project management and must not be used as the software version.

---

## 2. Permanent engineering rules

These rules remain in force unless explicitly replaced by an ADR:

1. Security is an architectural requirement from day one.
2. Mobile is always an **untrusted client**.
3. Financial truth and production game outcomes are **server-authoritative**.
4. PostgreSQL is canonical persistent truth for financial/regulatory state.
5. Redis is ephemeral only: cache, rate limiting and coordination; never financial truth.
6. No production secret, authoritative game secret, privileged credential, database credential, provider credential or admin credential belongs in the client.
7. No fabricated production financial/KYC/license state.
8. Client state cannot approve authentication, KYC, MFA, Responsible Gaming, payments, settlement or account privilege.
9. Financial mutation requires idempotency, transactional posting and auditability.
10. Route visibility is not authorization; ownership is derived from the authenticated principal.
11. Financial/game security must remain valid even if the released client is inspected, modified or automated.
12. Commits, branches, files, types and modules use professional descriptive names and Conventional Commits.
13. Code-first design + Storybook remains the primary workflow; paid Figma is not a dependency.
14. A phase is not complete until required CI/security gates pass and documentation is current.
15. No feature is called production-ready merely because its UI exists.

---

## 3. Product goals

### Primary goal

Build Vanta into a secure, trustworthy and commercially viable gaming platform whose user experience is simple while financial, security and regulatory complexity stays on the server.

### Product objectives

- frictionless account/session experience;
- premium, recognizable visual identity;
- clear wallet and transaction experience;
- server-authoritative games;
- strong Responsible Gaming controls;
- legal/regulatory transparency;
- measurable unit economics;
- controlled game mathematics and financial exposure;
- reproducible releases with exact version/build provenance;
- ability to expand jurisdiction by jurisdiction rather than pretending one authorization covers all markets.

### Success principles

- **player-facing copy explains what the user can do**, not internal architecture;
- technical terms such as ledger, settlement, read model and server-authoritative belong in engineering/audit documentation except where legally required;
- security controls should be strong without unnecessarily forcing repeated password login;
- blocked capabilities should explain what is unavailable in plain language, not expose implementation details.

---

## 4. Visual and UX direction

Approved visual language:
- premium dark technological minimalism;
- obsidian/graphite surfaces;
- Vanta red accent;
- fintech-style wallet/account treatment;
- immersive game surfaces;
- restrained decorative assets;
- avoid cheap neon/casino clutter;
- semantic green only for positive/success state.

Approved palette remains:

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

### Bottom navigation

Canonical tabs remain:

```text
Home / Jogar / Carteira / Perfil
```

New product decision:
- use **icons + labels**, not text-only tabs;
- active indicator/pill should animate between tabs;
- icon/label feedback should be subtle and accessible;
- `Jogar` may remain emphasized but must not visually overpower all other navigation.

### Motion system

Vanta should not feel static. Motion becomes a design-system concern:

```text
motion/
├── durations
├── easing
├── screenTransitions
├── bottomNavigation
├── pressFeedback
├── cards
├── feedbackStates
├── gameMotion
└── reducedMotion
```

Guideline:
- navigation: subtle and fast;
- microinteractions: tactile, restrained;
- game outcomes: more expressive;
- reading/financial/legal decisions: minimal motion;
- respect Android/iOS Reduce Motion preferences.

Typical navigation motion target: approximately 200–300 ms with small fade/translation rather than large sliding effects.

### Assets and branding

The base UI is structurally good but still reads as prototype without brand assets. Add selectively:
- final logo/app icon;
- Android adaptive icon;
- correct native splash;
- game thumbnails/artwork;
- onboarding/state illustrations where useful;
- consistent icon family;
- Vanta Original game assets.

Do not add imagery merely to fill space.

### App launch experience

The generic/stretched Expo-looking startup experience is not acceptable for public UX.

Desired flow:

```text
native Vanta splash
→ short Vanta brand animation
→ authenticated Home or Auth/Onboarding
```

Requirements:
- native splash uses correct scaling and Vanta background;
- no white flash, stretched artwork or technical Expo branding;
- JS intro should be short (roughly 600–900 ms maximum) and must not delay the user unnecessarily;
- session bootstrap can occur behind the launch transition;
- Android system splash behavior must be respected.

---

## 5. Mobile architecture

Technology:
- React Native + TypeScript;
- Expo;
- React Navigation;
- TanStack Query;
- React Hook Form + Zod;
- React Native Reanimated;
- React Native Skia;
- Expo SecureStore;
- Storybook;
- Vitest.

Sensitive tokens must remain in secure storage, not AsyncStorage/MMKV/navigation/logs/analytics.

Root state supports Auth, KYC, Main, SessionExpired, AccountBlocked and Maintenance.

Opaque route IDs are permitted; full security/financial/KYC records must not be copied through navigation params.

---

## 6. Session UX and authentication

A player **must not be forced to log in again simply because the app was minimized, closed or restarted** while a valid session exists.

Current implementation provides:
- SecureStore session persistence;
- short-lived access token;
- rotating refresh token;
- server-side token hashes;
- replay/race detection;
- remote session revocation;
- single-flight refresh on mobile.

Current default token TTLs:
- access token: 15 minutes;
- refresh token: 30 days.

Required UX:

```text
minimize → return authenticated
close app → reopen → restore session
expired access token → silent refresh
revoked/expired refresh → reauthenticate
```

Sensitive operations should later use **step-up authentication**, not full password login on every app open. Candidate actions include withdrawal, password/email/phone changes, disabling MFA and changing payment destinations.

Future security work should include passkeys/biometrics/MFA where appropriate. Biometric unlock may protect local access after inactivity, but does not replace server authorization.

---

## 7. Backend architecture

- Go modular monolith;
- REST APIs; realtime only where justified;
- PostgreSQL;
- Redis ephemeral controls;
- transactional outbox direction;
- Docker;
- GitHub Actions;
- OpenTelemetry direction;
- IaC/Terraform direction;
- explicit trusted-proxy policy before reverse-proxy production deployment.

Domain boundaries include identity/auth, identity/security, player/profile, KYC, wallet, ledger, betting/history, games/plinko, payments, compliance/legal, Responsible Gaming, support, platform/status and future risk/fraud/audit/notifications.

Do not split into microservices without operational evidence.

---

## 8. Financial architecture

Canonical financial concepts:

```text
wallets
ledger_accounts
ledger_transactions
ledger_entries
bets
settlement state
```

Rules:
- immutable/double-entry-style ledger;
- no mutable `users.balance` as financial truth;
- entries balance per financial transaction;
- ownership checked server-side;
- posting is transactional;
- idempotency at command boundaries;
- concurrent overspend prevention;
- provider success does not directly become canonical wallet balance;
- reconciliation + ledger posting own final financial effect.

---

## 9. Game mathematics and operator economics

A core decision is that operator margin means **positive long-run mathematical expectation**, never user-specific outcome changes.

For each game/ruleset:

```text
RTP = Σ(probability_i × payout_i)
House Edge = 1 - RTP
```

Requirements before production game activation:
- theoretical RTP calculation;
- payout table versioning;
- volatility/variance model;
- probability of extreme outcomes;
- max bet and max payout;
- bankroll model;
- risk-of-ruin analysis;
- aggregate exposure;
- Monte Carlo/stress simulation;
- confidence/tolerance checks against theoretical RTP;
- immutable association between each historical result and exact ruleset/math version.

The result must never be changed after acceptance to protect operator exposure. Risk protection occurs **before acceptance** through limits/exposure controls.

Low/medium/high risk modes may change distribution/variance while each has a deliberately approved RTP.

Game math configuration must go through calculation + simulation + review before production deployment.

---

## 10. Plinko architecture

Plinko remains server-authoritative.

Server:
1. authenticate player;
2. verify account/KYC/jurisdiction/RG policy;
3. verify ruleset/stake;
4. evaluate exposure/limits;
5. reserve funds transactionally;
6. generate authoritative outcome;
7. resolve slot/multiplier/payout;
8. settle ledger;
9. persist result/audit;
10. return authorized result.

Mobile:
- collect allowed inputs;
- request action;
- animate returned result;
- refresh authoritative wallet/history.

Current boundary: visual Plinko exists and is validated on Android, but production game placement remains disabled.

---

## 11. Security posture

Assume the released app can be inspected, modified and automated. Therefore compromising the client must not allow changes to balance, identity approval, Responsible Gaming controls, authoritative game outcome, settlement, payment confirmation, withdrawal authorization or another player's data.

Implemented foundations include:
- bcrypt password hashing;
- AES-256-GCM PII encryption;
- HMAC-SHA256 lookup protection;
- cryptographically random opaque tokens;
- server-side token hashes;
- refresh rotation/replay protection;
- rate limiting;
- security headers;
- SecureStore;
- ownership checks;
- CodeQL;
- dependency audits;
- race-enabled backend tests;
- `go vet` and `govulncheck`.

Before production, add/validate:
- MFA/passkeys and recovery;
- Play Integrity / App Attest;
- device-risk signals;
- step-up authentication;
- KMS/HSM and key rotation;
- supply-chain/release signing hardening;
- immutable security/audit trails;
- fraud/risk monitoring;
- independent penetration test;
- incident response and revocation playbooks.

CI dependency installation should move to a committed lockfile + frozen installation for controlled production releases.

---

## 12. Legal, policy and regulatory UX

Legal documents should be accessible **inside the app** through a Legal Center, while canonical versions may also live on the web/backend.

Expected surfaces where applicable:
- Terms and Conditions;
- Privacy Policy;
- Responsible Gaming policy;
- KYC/identity information;
- deposits/withdrawals policy;
- game rules;
- promotions/bonus rules;
- account closure;
- time-out/self-exclusion;
- complaints/dispute resolution;
- operator/support contact;
- minors/18+ information;
- data-protection rights;
- verified operator/license/regulator details only when real.

Do not overload Home/Wallet/Plinko with engineering text. Legal/compliance disclosures appear at the correct decision points.

No unverified licensing claim is allowed.

---

## 13. Business strategy

Vanta should not assume the correct first commercial model is immediately becoming a full multi-jurisdiction B2C operator.

Strategic path to evaluate:

```text
A. Vanta Technology / Vanta Originals
   → build game/platform technology

B. B2B distribution
   → supply games/technology to licensed operators

C. one carefully selected B2C jurisdiction
   → obtain required local authorization and operating stack

D. jurisdiction-by-jurisdiction expansion
   → reuse technology while keeping legal entities/licensing correct
```

Key business metrics:
- GGR;
- NGR;
- deposit conversion;
- retention D30/D90/D365;
- CAC;
- LTV;
- LTV/CAC;
- promo cost;
- payment cost;
- fraud loss;
- gaming tax;
- corporate tax;
- contribution margin;
- operational cost;
- bankroll/exposure utilization.

### Tax and asset-protection boundary

Only **lawful** tax planning and asset protection are acceptable.

Potential future group design may separate:
- holding company;
- technology/IP company;
- licensed operating companies per jurisdiction;
- investment/treasury vehicles where legally appropriate.

Goals are liability isolation, governance, investment readiness and lawful tax efficiency — never concealment of beneficial ownership, income or assets.

Every jurisdiction decision must be validated with specialist gaming, corporate and tax counsel. There is no assumption that one authorization automatically covers all European markets.

---

## 14. Release/version governance

The project now requires:
- SemVer product versions;
- prerelease channels (`alpha`, `beta`, `rc`);
- monotonically increasing Android `versionCode` and iOS `buildNumber`;
- Git tags matching releases;
- changelog/release notes;
- build metadata containing version, build, commit SHA, date, environment/channel;
- one canonical version source rather than several manually divergent values;
- Conventional Commits and descriptive branches.

See `docs/release/versioning-and-release-governance.md`.

---

## 15. Phase 20 live Android validation — 2026-08-25

The physical-device flow was made operational on Windows/Android.

Validated:
- Docker Desktop/WSL2 backend runtime;
- PostgreSQL/Redis/API healthy;
- API reachable from local LAN;
- Metro reachable from physical device;
- Vanta onboarding renders;
- account creation works after password-policy alignment;
- login works;
- Home renders authenticated state;
- Profile/KYC state renders from backend;
- Wallet renders backend balance after null-transaction fix;
- Deposit flow opens but production provider execution remains blocked;
- Plinko screen renders in protected mode;
- logout → login again works.

Still pending:
- force-close/reopen persistent-session evidence;
- silent access-token expiry/refresh evidence;
- remote logout-revocation evidence;
- full Security/RG/Support/Legal interaction smoke tests;
- final icons/splash/motion/copy polish;
- artifact secret inspection;
- iOS compile/simulator path;
- iOS physical-device validation;
- final version/release normalization.

No iPhone is currently available for local physical testing. Do not claim physical iOS validation. Use macOS CI/simulator/build validation and later TestFlight/cloud/borrowed-device testing.

---

## 16. Phase 20 failures and fixes

A detailed record is maintained in `docs/release/phase20-troubleshooting-and-findings.md`.

Important cases:
- PostgreSQL 18 Docker data mount incompatibility;
- Windows Docker/WSL2 startup prerequisites;
- physical-device Metro host/QR/dev-client mismatch;
- stale Metro cache runtime error;
- registration password-policy mismatch;
- Wallet API returning `transactions: null`;
- stale login error message after a later successful authentication;
- workflow initially producing unnecessary multiple APK variants, later reduced to one Android physical-device debug APK.

These are retained as engineering history because they can recur.

---

## 17. CI quality gates

Mobile:
- dependency audit;
- TypeScript typecheck;
- Vitest boundary tests;
- Android app/Storybook export validation.

Backend:
- module graph verification;
- formatting;
- PostgreSQL/Redis integration;
- race-enabled tests;
- vet;
- vulnerability scan;
- API build;
- container/Compose validation.

Static:
- CodeQL JS/TS;
- CodeQL Go.

A green CI run is required but is not regulatory certification.

---

## 18. Current roadmap state

- Phase 01–19: **COMPLETE / MERGED**.
- Phase 20: **IN PROGRESS** on PR #24.
- Phase 20 must not merge until native/runtime/security/documentation exit criteria pass.
- Post-MVP phases cover production infrastructure, device trust/MFA, KYC/AML, payments, game math + production game pipeline, risk/fraud/admin, regulatory readiness, independent security assessment, store readiness and regulated launch.

See `docs/ROADMAP.md` for sequencing.

---

## 19. Resume instructions for a new development session

Read in this order:

1. `docs/README.md`;
2. this file completely;
3. `docs/context/2026-08-25-phase20-strategy-checkpoint.md`;
4. `docs/VANTA_PRODUCT_BUSINESS_STRATEGY.md`;
5. `docs/ROADMAP.md`;
6. `docs/PHASE_HISTORY.md`;
7. current phase-specific release/security docs;
8. inspect `main`, the active branch and open PRs before assuming status.

Then continue from the first incomplete roadmap/Phase 20 exit item.

Never restore an old plan merely because an older PDF, screenshot or chat mentioned it.
