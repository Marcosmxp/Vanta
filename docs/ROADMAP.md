# Vanta Roadmap

**Canonical execution roadmap.** If an older plan conflicts with this file, this file wins for planned/in-progress work unless current merged code/migrations prove a newer completed state.

**Last consolidated:** 2026-08-25 during Phase 20.  
**Strategic source:** [`VANTA_PRODUCT_BUSINESS_STRATEGY.md`](./VANTA_PRODUCT_BUSINESS_STRATEGY.md).  
**Active branch:** `feat/phase20-native-builds`.  
**Active PR:** #24.

This roadmap converts the Vanta product/business strategy into sequenced technical, security, regulatory and commercial execution. A software phase is not a product version and phase completion is not automatically authorization to operate with real money.

---

## 1. Status legend

- `COMPLETE / MERGED` — implemented, validated and integrated into `main`.
- `IN PROGRESS` — active branch/PR; not yet canonical completed state on `main`.
- `NEXT` — first sequenced work after the active phase.
- `PLANNED` — ordered future work.
- `PROVIDER DEPENDENT` — requires a selected external provider/contract/account.
- `JURISDICTION DEPENDENT` — cannot be completed generically; requires a selected market and current legal/regulatory evidence.
- `BLOCKED` — intentionally unavailable until prerequisites are evidenced.

---

## 2. Strategic execution rules

All future phases must preserve this priority order:

```text
1. Player funds / identity / account security
2. Legal and regulatory boundaries
3. Game integrity and mathematical correctness
4. Player experience and accessibility
5. Unit economics and operating discipline
6. Product, marketing and geographic scale
```

A lower-level goal must not be achieved by weakening a higher-level requirement.

Permanent examples:
- do not weaken KYC or Responsible Gaming to improve conversion;
- do not change accepted game outcomes to reduce operator losses;
- do not put financial/game authority into the mobile client to simplify implementation;
- do not enter a jurisdiction only because a tax headline appears attractive;
- do not scale paid acquisition before retention and LTV/CAC are understood;
- do not call an APK, App Store listing or license application a completed commercial business.

---

## 3. Program map

The roadmap is divided into four maturity bands:

```text
FOUNDATION             Phases 01–19   COMPLETE
NATIVE ALPHA           Phase 20       IN PROGRESS
PRODUCTION READINESS   Phases 21–30   PLANNED
COMMERCIAL PROOF       Phases 31–33   BLOCKED/PLANNED
```

High-level dependency chain:

```text
Phase 20 Native Alpha
        ↓
21 Production Platform
        ↓
22 Identity / Device Trust
        ↓
23 KYC / AML ─────┐
24 Payments ──────┼────→ 28 Regulatory / Certification
25 Game Math/Risk ┤                 ↓
26 Game Pipeline ─┘          29 Independent Security
        ↓                          ↓
27 Fraud / Operations ─────→ 30 Store + Launch Readiness
                                   ↓
                            31 Controlled Pilot
                                   ↓
                            32 Unit Economics Proof
                                   ↓
                            33 Expansion
```

Some provider/regulatory work can run in parallel, but no downstream gate may be bypassed because another stream is slow.

---

# 4. Completed foundation — Phases 01–19

| Phase | Status | Outcome |
|---|---|---|
| 01 | COMPLETE / MERGED | Monorepo, Expo/Go bootstrap, CI/CodeQL, security baseline |
| 02 | COMPLETE / MERGED | Design-system foundations |
| 03 | COMPLETE / MERGED | Storybook + reusable component library |
| 04 | COMPLETE / MERGED | Typed navigation shell/root states |
| 05 | COMPLETE / MERGED | Splash/onboarding/auth UX foundation |
| 06 | COMPLETE / MERGED | KYC UX/provider boundary |
| 07 | COMPLETE / MERGED | Home |
| 08 | COMPLETE / MERGED | Plinko visual + server outcome foundation; approved palette |
| 09 | COMPLETE / MERGED | Bet History/Details |
| 10 | COMPLETE / MERGED | Wallet UX/read models |
| 11 | COMPLETE / MERGED | Deposit/withdraw UX/contracts; execution blocked |
| 12 | COMPLETE / MERGED | Profile |
| 13 | COMPLETE / MERGED | Security Center |
| 14 | COMPLETE / MERGED | Responsible Gaming |
| 15 | COMPLETE / MERGED | Support + Legal + Privacy + Regulatory surfaces |
| 16 | COMPLETE / MERGED | System states |
| 17 | COMPLETE / MERGED | Executable PostgreSQL/Redis/Go backend |
| 18 | COMPLETE / MERGED | Mobile ↔ backend integration |
| 19 | COMPLETE / MERGED | Tests, security hardening, dependency audit/regression gates |

Completed-state references remain in [`PHASE_HISTORY.md`](./PHASE_HISTORY.md).

---

# 5. Phase 20 — Native MVP Builds and Device Validation

**Status:** IN PROGRESS  
**Branch:** `feat/phase20-native-builds`  
**PR:** #24

## Objective

Raise Vanta from an integrated functional prototype to a **controlled native alpha** with reproducible builds, stable session behavior, coherent product UX and traceable release metadata — without opening regulated production capabilities.

## 20.1 Native/runtime baseline

### Validated on physical Android

- Docker Desktop + WSL2 local runtime;
- PostgreSQL / Redis / Go API healthy;
- API reachable through development LAN;
- Metro reachable from physical Android;
- installable APK;
- onboarding;
- registration/login;
- authenticated Home;
- Profile/KYC state;
- Wallet balance + empty history;
- Deposit presentation with execution blocked;
- Plinko protected mode;
- logout → login.

### Known Phase 20 fixes already made

- PostgreSQL 18 volume layout;
- Windows/Docker diagnostics;
- physical-device Metro host path;
- Metro cache recovery path;
- mobile/backend password minimum alignment;
- Wallet `transactions: null` crash;
- one useful Android debug artifact instead of redundant APK variants.

### Open functional debt

- [ ] clear stale invalid-credentials UI after a later successful login/new attempt;
- [ ] align all password helper/policy copy;
- [ ] complete remaining integrated-screen interaction pass.

## 20.2 Session persistence evidence

Alpha requirements:

```text
minimize → resume authenticated
force-close/reopen → restore SecureStore session
expired access token → silent refresh
revoked/expired refresh → reauthenticate
logout → local clear + remote revocation
```

Evidence required:
- [ ] background/foreground;
- [ ] force-close/reopen;
- [ ] access-token expiry + silent refresh;
- [ ] refresh rotation still valid after restart;
- [ ] remote revocation/expiry path;
- [ ] logout remote revocation.

## 20.3 Product copy cleanup

- [ ] remove ordinary player-facing implementation language such as ledger/read-model/component/settlement explanations;
- [ ] blocked features explain what is unavailable and why in plain language;
- [ ] Portuguese terminology is consistent;
- [ ] engineering/security details remain in technical documentation;
- [ ] required legal/safety disclosures remain present at relevant decision points.

## 20.4 Native identity and launch experience

- [ ] final Vanta app icon;
- [ ] Android adaptive icon;
- [ ] correct iOS icon assets;
- [ ] Vanta native splash with correct scaling;
- [ ] remove stretched/generic Expo-looking launch state;
- [ ] no white flash;
- [ ] short branded transition without artificial delay;
- [ ] session bootstrap integrates cleanly with launch flow.

## 20.5 Navigation and shared motion

- [ ] bottom navigation uses icon + label;
- [ ] animated active indicator/pill;
- [ ] subtle icon/label touch feedback;
- [ ] consistent screen transitions;
- [ ] shared duration/easing/motion tokens;
- [ ] button/card microinteractions;
- [ ] expressive motion reserved for games/outcomes;
- [ ] restrained motion on legal/financial reading surfaces;
- [ ] Reduce Motion support.

## 20.6 Accessibility/native layout

- [ ] safe areas;
- [ ] keyboard avoidance;
- [ ] common font scaling;
- [ ] touch-target sanity;
- [ ] screen-size/responsive checks;
- [ ] error/loading/empty states usable with accessibility settings.

## 20.7 Legal Center alpha completeness

Review/add placeholders/read-only content where applicable without fabricating production operator/license data:
- [ ] Terms and Conditions;
- [ ] Privacy;
- [ ] Responsible Gaming;
- [ ] identity/KYC information;
- [ ] deposits/withdrawals information;
- [ ] game rules;
- [ ] promotion/bonus rules;
- [ ] account closure;
- [ ] time-out/self-exclusion;
- [ ] complaints/disputes;
- [ ] 18+/minors;
- [ ] data-protection rights;
- [ ] verified operator/regulator/license details only when real.

## 20.8 Version/build/release provenance

Before controlled alpha:
- [ ] one canonical product-version source;
- [ ] SemVer prerelease line;
- [ ] monotonic Android `versionCode` / iOS `buildNumber`;
- [ ] version + build + Git SHA + date + channel + environment captured;
- [ ] version/build visible in About/Profile;
- [ ] Git tag/release/changelog process defined;
- [ ] dependency lockfile strategy normalized;
- [ ] release-oriented installs use frozen dependency resolution.

See [`release/versioning-and-release-governance.md`](./release/versioning-and-release-governance.md).

## 20.9 Artifact/security inspection

- [ ] APK reviewed for secrets/tokens/backend-only configuration;
- [ ] no session credentials in logs;
- [ ] HTTPS enforced outside development;
- [ ] production profile cannot inherit debug-only behavior;
- [ ] no production payment/game/KYC endpoint accidentally opened;
- [ ] exact artifact ↔ commit/build provenance recorded.

## 20.10 iOS validation without local iPhone

- [ ] Expo/native iOS config validated;
- [ ] macOS CI/simulator path established;
- [ ] Apple signing/account requirements documented;
- [ ] dev/preview artifact where feasible;
- [ ] physical iOS remains explicitly unvalidated until TestFlight/cloud/borrowed hardware evidence exists.

## 20.11 Phase 20 exit gate — Controlled Native Alpha

Phase 20 closes only when:
1. reproducible Android artifact exists;
2. physical Android core runtime is stable;
3. persistent session + silent refresh evidence passes;
4. no known critical native/runtime crash remains;
5. core integrated screens pass smoke tests;
6. native launch branding no longer looks broken/generic;
7. normal player copy is no longer dominated by engineering terminology;
8. version/build provenance is controlled;
9. artifact/config/log security review passes;
10. iOS build path is validated and external blockers are explicit;
11. prior security gates remain green;
12. blocked regulated capabilities remain blocked;
13. canonical docs are current.

**Phase 20 completion means native alpha quality, not production authorization.**

---

# 6. Production-readiness program — Phases 21–30

## Phase 21 — Production Platform, Environments and Observability

**Status:** NEXT after Phase 20

### Objective

Create a production-grade technical environment before adding live providers or money flows.

### Deliverables
- staging and production topology;
- managed PostgreSQL/Redis selection and network isolation;
- production TLS/edge configuration;
- explicit trusted-proxy/client-IP policy;
- OpenTelemetry traces/metrics/logs;
- SLOs/alerts/dashboards;
- production secrets/KMS strategy;
- key rotation procedures;
- backups + restore tests;
- disaster-recovery targets/playbook;
- IaC/Terraform direction implemented;
- deployment/rollback strategy;
- audit-log retention strategy;
- production release pipeline/supply-chain controls.

### Exit gate

A controlled staging environment can be deployed, observed, rolled back and restored without embedding production secrets in source/client artifacts.

---

## Phase 22 — Identity, Device Trust, MFA, Passkeys and Step-up

**Status:** PLANNED

### Objective

Upgrade account security for money-bearing and high-risk operations while preserving low-friction routine sessions.

### Deliverables
- MFA enrollment/challenge;
- passkeys where platform/product fit is validated;
- secure recovery process;
- Play Integrity;
- App Attest;
- root/jailbreak/device-risk signals as risk inputs;
- new-device detection/notification;
- step-up authorization policy;
- password/security-event session invalidation policy;
- refresh idle + absolute session lifetime policy;
- sensitive-action reauthentication evidence;
- revoke current/other/all sessions policy.

### Exit gate

High-risk actions can require stronger proof without forcing password login on every ordinary app launch.

---

## Phase 23 — Production KYC / AML / Eligibility

**Status:** PLANNED / PROVIDER DEPENDENT / JURISDICTION DEPENDENT

### Deliverables
- selected provider + contractual/security review;
- document/selfie/liveness integration;
- signed callbacks/webhooks;
- replay/idempotency protection;
- KYC-media/data-retention policy;
- age/identity verification;
- sanctions/PEP/AML workflow where applicable;
- manual review/escalation;
- audit evidence;
- account-state enforcement at every relevant command boundary.

### Exit gate

KYC/AML state is authoritative, auditable and enforceable server-side; the mobile app cannot self-approve identity.

---

## Phase 24 — Payments, Withdrawals and Reconciliation

**Status:** PLANNED / PROVIDER DEPENDENT / JURISDICTION DEPENDENT

### Deliverables
- selected PSP/acquirer/payment-method adapters;
- hosted/tokenized handling; no PAN/CVV storage by Vanta;
- deposit intents;
- withdrawal destinations + ownership validation;
- signed/replay-safe provider callbacks;
- idempotent provider event processing;
- reconciliation;
- canonical ledger posting;
- chargeback/refund handling;
- payment fraud controls;
- withdrawal step-up;
- provider outage/retry/reconciliation playbooks.

### Exit gate

A provider success/failure cannot mutate canonical money outside the transactional reconciliation + ledger pipeline.

---

## Phase 25 — Game Mathematics and Financial Risk Engine

**Status:** PLANNED

### Objective

Establish the quantitative authority that determines whether a game configuration is fair, approved and financially survivable **before** production wagering is opened.

### 25.1 Mathematical specification

For every Plinko ruleset/risk mode:
- exact outcome probabilities;
- payout table;
- theoretical RTP;
- house edge;
- variance/volatility;
- expected value;
- max multiplier;
- tail/extreme probability;
- allowed stake range.

### 25.2 Validation framework

- analytical calculation;
- deterministic unit/property tests;
- Monte Carlo simulation;
- convergence/tolerance checks;
- confidence/statistical diagnostics where appropriate;
- stress/tail scenarios;
- independent review/certification where required;
- immutable version/hash of approved math configuration.

### 25.3 Financial risk model

- bankroll assumptions;
- max stake;
- max payout;
- aggregate exposure;
- payout concentration;
- drawdown;
- risk of ruin;
- VaR/Expected Shortfall where useful;
- reserve thresholds;
- concurrency/load stress;
- operator risk limits defined before accepting an action.

### Critical invariant

Once a wager/action is accepted, its authorized outcome must not be changed to protect operator exposure. Risk controls reject/limit **before acceptance**.

### Exit gate

No production game ruleset exists without approved/versioned math + risk evidence.

---

## Phase 26 — Production Plinko Betting and Settlement Pipeline

**Status:** PLANNED / BLOCKED by Phases 23–25 where applicable

### Objective

Implement live-capable Plinko command processing on top of approved identity, financial and mathematical controls.

### Command boundary

```text
authenticate
→ eligibility/KYC/jurisdiction
→ Responsible Gaming
→ wallet/balance
→ approved ruleset
→ stake limits
→ exposure limits
→ idempotent reservation
→ authoritative CSPRNG outcome
→ payout calculation from approved ruleset
→ transactional settlement
→ immutable bet/ledger/audit
→ response
```

### Deliverables
- authenticated placement endpoint;
- idempotency keys;
- duplicate/replay protection;
- transactional reservation/settlement;
- failure recovery;
- concurrent request tests;
- authoritative result persistence;
- exact ruleset/math version on every bet;
- monitoring and audit events;
- client only animates the server-authorized result.

### Exit gate

Production-like Plinko settlement survives retries, concurrency and partial failures without double-spend, duplicate settlement or client authority.

---

## Phase 27 — Fraud, Risk Operations and Admin Platform

**Status:** PLANNED

This is operational/behavioral risk and is distinct from Phase 25 quantitative game-math risk.

### Deliverables
- fraud/risk signals;
- account/payment/device behavior monitoring;
- manual review queues;
- protected admin console;
- least-privilege roles;
- separation of duties;
- immutable admin/audit trails;
- player/session/payment/game risk views;
- case management;
- operational incident actions;
- escalation/runbooks.

### Exit gate

Sensitive operational actions are attributable, least-privilege, reviewable and cannot silently rewrite financial/game history.

---

## Phase 28 — Jurisdiction Selection, Regulatory Readiness and Certification

**Status:** PLANNED / JURISDICTION DEPENDENT

### Objective

Choose the initial commercial model/market based on current legal, financial and provider evidence rather than assumptions.

### Required before committing to a B2C market

- current legal opinion;
- eligible operator/legal entity structure;
- licensing path/cost/timeline;
- game/platform certification requirements;
- gaming duty/tax model;
- corporate tax/permanent-establishment analysis;
- KYC/AML requirements;
- Responsible Gaming requirements;
- player-fund/segregation/guarantee requirements;
- reporting/audit obligations;
- advertising rules;
- complaints/dispute process;
- data-protection requirements;
- banking/PSP feasibility;
- Apple/Google distribution feasibility;
- support/operations capability;
- required startup/working capital.

For Portugal, verify current SRIJ requirements directly at decision time.

### Exit gate

Vanta has a documented, evidence-backed launch jurisdiction/model. No UI may claim a license/operator authorization until the real data exists.

---

## Phase 29 — Independent Security, Resilience and Production Assessment

**Status:** PLANNED

### Deliverables
- independent mobile/API/infrastructure penetration test;
- threat-model review;
- authentication/session review;
- financial/game command review;
- provider webhook/reconciliation review;
- cloud/IaC/secrets review;
- backup/restore/DR exercise;
- dependency/supply-chain review;
- remediation;
- independent retest;
- production security evidence package.

### Exit gate

No unresolved critical/high issue that invalidates the intended production threat model remains accepted without explicit documented risk ownership and legal/regulatory compatibility.

---

## Phase 30 — Store, Release and Launch Readiness

**Status:** PLANNED / BLOCKED by prior production gates

### Deliverables
- Apple/Google gambling-app policy review;
- age/jurisdiction/geolocation distribution controls;
- production signing/key custody;
- privacy/store metadata;
- release approvals/separation of duties;
- production build provenance;
- staged rollout;
- rollback/kill-switch capability where appropriate;
- incident communications;
- support readiness;
- on-call/operational readiness;
- final go/no-go checklist.

### Exit gate

A production build can be distributed only to permitted users/markets with controlled rollback, support and incident processes.

**Phase 30 does not itself prove profitable unit economics.**

---

# 7. Commercial proof program — Phases 31–33

## Phase 31 — Controlled Production Pilot

**Status:** BLOCKED until all applicable production, provider, security and regulatory gates pass

### Objective

Launch with deliberately constrained capital, geography, product scope and acquisition rather than immediately scaling.

### Pilot constraints to define before launch
- jurisdiction(s);
- player cohort/availability;
- approved games;
- maximum stake/payout/exposure;
- operator bankroll/reserves;
- payment limits;
- marketing budget;
- incident/rollback thresholds;
- stop-loss / risk escalation rules;
- customer-support capacity.

### Pilot KPIs
- crash-free sessions;
- API/platform availability;
- payment success/failure/reconciliation;
- KYC conversion;
- first-deposit conversion;
- retention;
- GGR/NGR;
- Responsible Gaming activity;
- fraud/chargeback loss;
- support contacts;
- game RTP observed vs approved expectations;
- operator exposure/drawdown;
- security/fraud incidents.

### Exit gate

Pilot remains operationally safe and produces enough clean data to evaluate unit economics. A pilot can be stopped even if technically stable when economics or risk are unacceptable.

---

## Phase 32 — Unit Economics and Commercial Model Validation

**Status:** PLANNED after sufficient pilot evidence

### Objective

Determine whether Vanta has a scalable business, not merely functioning software.

### Required metrics
- registration → verified player conversion;
- verified → depositor conversion;
- D30 / D90 / D365 retention as data matures;
- betting frequency;
- ARPU/ARPPU;
- GGR;
- NGR;
- CAC by channel;
- LTV by cohort;
- LTV/CAC;
- CAC payback;
- promotions/bonuses cost;
- payment/provider cost;
- gaming taxes;
- corporate/compliance/support allocation;
- fraud/chargeback loss;
- contribution margin;
- bankroll/exposure efficiency.

### Scaling rule

Do not materially increase paid acquisition while LTV/CAC, contribution margin, fraud cost or retention remain unknown/structurally negative.

An internal planning benchmark such as `LTV/CAC >= 3x` may be used as a starting target, but real thresholds must reflect the actual market, capital cost and growth strategy.

### Business-model decision

Use real evidence to decide whether the next expansion is primarily:
- Vanta Originals B2B distribution;
- direct B2C growth;
- hybrid B2B + selected B2C;
- technology/platform licensing.

### Exit gate

There is an evidence-backed commercial model with defined acceptable acquisition economics, contribution margin and capital/risk requirements.

---

## Phase 33 — Portfolio, Geographic and Organizational Expansion

**Status:** PLANNED / BLOCKED until Phase 32 evidence supports scale

### New-game gate

Every additional Vanta Original requires:
- product thesis;
- approved/versioned mathematics;
- risk/exposure model;
- server-authoritative settlement;
- certification where required;
- accessibility/UX quality;
- monitoring;
- evidence that portfolio expansion is more valuable than polishing existing games.

### New-jurisdiction gate

Every market requires:
- current legal/tax/regulatory analysis;
- licensing/entity decision;
- provider/banking feasibility;
- Responsible Gaming/KYC/AML implementation;
- distribution controls;
- support/operations readiness;
- unit-economics model;
- capital plan.

### Organizational/corporate scaling

Evaluate lawful structures only when justified by real operations:

```text
Vanta Holding
├── Vanta Technology / IP
├── Licensed Operator — Market A
├── Licensed Operator — Market B
└── Treasury / investment structures where lawful and appropriate
```

Objectives may include liability isolation, governance, investment/M&A readiness and lawful tax efficiency. They must not conceal beneficial ownership, income or assets.

### Exit principle

Scale only where incremental product/market complexity produces risk-adjusted value.

---

# 8. Parallel business workstreams

These workstreams run alongside technical phases but cannot override technical/security/regulatory gates.

## B1 — Market and competitor intelligence

Maintain dated research on:
- successful operator entry strategies;
- game/product differentiation;
- acquisition/retention models;
- market concentration;
- operator margins;
- B2B game-supplier economics;
- player preferences and distribution channels.

## B2 — Jurisdiction and tax model

For candidate markets, maintain a current model covering:
- gaming duty;
- corporate tax;
- license/application/guarantee/certification costs;
- VAT/other applicable treatment;
- required capital/reserves;
- permanent establishment;
- transfer pricing where relevant;
- beneficial ownership/substance requirements;
- compliance/support staffing.

Never choose a jurisdiction from tax rate alone.

## B3 — Capital and bankroll plan

Before live money:
- development/runway capital;
- licensing/provider setup capital;
- player-fund obligations;
- operating reserves;
- game payout exposure;
- withdrawal liquidity;
- marketing budget;
- contingency/incident reserve.

## B4 — B2B vs B2C decision

Evaluate using evidence:
- time to revenue;
- license burden;
- distribution access;
- margin;
- customer acquisition burden;
- capital intensity;
- provider dependencies;
- compliance complexity;
- brand control;
- IP value.

No assumption that B2B or B2C is automatically superior.

## B5 — Corporate and asset-protection planning

Only after a real operating/commercial need exists, obtain specialist advice on:
- holding structure;
- IP ownership;
- operating entities;
- shareholder agreements;
- treasury/investment separation;
- insurance;
- succession/governance;
- lawful tax efficiency.

No concealment, sham substance or undeclared ownership/assets.

---

# 9. Program-level KPIs

## Native/product quality
- crash-free sessions;
- startup time;
- screen/API error rate;
- session restore success;
- silent refresh success;
- accessibility defects;
- support tickets caused by UX confusion.

## Security
- auth abuse rate;
- token replay/revocation events;
- dependency/security findings;
- mean time to remediate;
- suspicious-device events;
- fraud loss;
- privileged/admin action audit coverage.

## Financial/game integrity
- ledger reconciliation exceptions;
- duplicate/idempotency violations;
- observed vs theoretical RTP diagnostics;
- exposure utilization;
- max drawdown;
- risk limit breaches;
- settlement latency/failures.

## Compliance/Responsible Gaming
- KYC completion/failure/manual-review rates;
- self-exclusion/time-out enforcement failures: target zero;
- limit-enforcement failures: target zero;
- jurisdiction/age control failures: target zero;
- complaint resolution metrics.

## Commercial
- conversion;
- retention;
- GGR/NGR;
- CAC;
- LTV;
- LTV/CAC;
- CAC payback;
- contribution margin;
- fraud/payment/promotion costs;
- support/compliance cost per active player.

---

# 10. Current execution order

As of this checkpoint:

```text
NOW
Phase 20 — finish controlled native alpha

THEN
Phase 21 — production platform/observability
Phase 22 — identity/device trust/MFA/step-up
Phase 23 — KYC/AML
Phase 24 — payments/reconciliation
Phase 25 — game mathematics/financial risk
Phase 26 — production Plinko pipeline
Phase 27 — fraud/admin operations
Phase 28 — jurisdiction/regulatory/certification
Phase 29 — independent security assessment
Phase 30 — store/release/launch readiness
Phase 31 — controlled production pilot
Phase 32 — unit economics validation
Phase 33 — evidence-led expansion
```

Provider, legal and business research should begin early enough to avoid discovering fatal constraints after the technology is complete, but no later phase is considered passed until its own evidence exists.

---

# 11. Immediate next action

Continue **Phase 20** from the first unresolved exit criterion in [`release/phase20-device-smoke-test.md`](./release/phase20-device-smoke-test.md).

Do not open production betting, payments, KYC/AML or licensing claims merely to accelerate the roadmap.