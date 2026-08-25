# Vanta Roadmap

**Canonical roadmap.** If an older plan conflicts with this file, this file wins unless current `main` code/migrations prove a newer completed state.

**Last consolidated:** 2026-08-25 during Phase 20.

## Status legend

- `COMPLETE / MERGED` — implemented, validated and integrated into `main`.
- `IN PROGRESS` — active branch/PR, not yet canonical in `main`.
- `NEXT` — next planned work.
- `PLANNED` — sequenced future work.
- `BLOCKED` — unavailable until prerequisites exist.

---

# Completed MVP foundation

| Phase | Status | Outcome |
|---|---|---|
| 01 | COMPLETE / MERGED | Monorepo, Expo/Go bootstrap, CI/CodeQL, security baseline |
| 02 | COMPLETE / MERGED | Design-system foundations |
| 03 | COMPLETE / MERGED | Storybook + reusable component library |
| 04 | COMPLETE / MERGED | Typed navigation shell/root states |
| 05 | COMPLETE / MERGED | Splash/onboarding/auth UX foundation |
| 06 | COMPLETE / MERGED | KYC UX/provider boundary |
| 07 | COMPLETE / MERGED | Home |
| 08 | COMPLETE / MERGED | Plinko visual + server outcome foundation; approved red palette |
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

Phase 19 canonical `main` merge checkpoint:

```text
b12c56928eba8e79f1c48a2361683e1e1746e224
```

Historical detail: [`PHASE_HISTORY.md`](./PHASE_HISTORY.md).

---

# Phase 20 — Native MVP Builds and Device Validation

**Status:** IN PROGRESS  
**Branch:** `feat/phase20-native-builds`  
**PR:** #24

## Objective

Produce reproducible Android/iOS native MVP builds, validate real native runtime behavior and raise the product from functional prototype to controlled alpha quality without opening any regulated capability that remains blocked.

Phase 20 is **not** production launch.

## 20.1 Native configuration/build baseline

Current implemented:
- Android/iOS application identifiers;
- URL scheme;
- Expo build profiles;
- Android debug APK CI;
- physical-device LAN helper;
- development API/Metro routing.

Still required:
- normalize versioning;
- final icon/adaptive icon;
- final custom native splash;
- build provenance;
- iOS build path;
- artifact inspection.

## 20.2 Android physical-device validation

Validated:
- Docker Desktop/WSL2 runtime;
- PostgreSQL/Redis/API health;
- API reachable on LAN;
- Metro reachable on physical Android;
- installed APK;
- onboarding;
- register/login;
- Home;
- Profile/KYC status;
- Wallet;
- Deposit presentation;
- Plinko protected-mode rendering;
- logout followed by login.

Resolved during testing:
- PostgreSQL 18 volume path;
- Metro host/dev-client connection;
- stale Metro-cache runtime failure;
- registration password minimum mismatch;
- Wallet `transactions: null` crash;
- excessive multi-artifact Android workflow.

Open:
- stale login error UI;
- password helper/policy consistency;
- persistent session after force-close;
- silent token refresh evidence;
- remote revocation evidence;
- remaining integrated-screen interaction pass.

See:
- [`release/phase20-native-builds.md`](./release/phase20-native-builds.md)
- [`release/phase20-device-smoke-test.md`](./release/phase20-device-smoke-test.md)
- [`release/phase20-troubleshooting-and-findings.md`](./release/phase20-troubleshooting-and-findings.md)

## 20.3 Session UX

Required alpha behavior:
- minimize → no login;
- close/reopen → restore SecureStore session;
- access-token expiry → silent refresh;
- revoked/expired refresh → authentication.

Routine reopening must not require a password.

Future high-risk actions use step-up authentication.

Exit evidence:
- [ ] force-close/reopen;
- [ ] background/foreground;
- [ ] access expiry/refresh;
- [ ] revocation/expiry;
- [ ] logout remote revocation.

## 20.4 Native product polish

Required:
- [ ] final app icon;
- [ ] Android adaptive icon;
- [ ] correct Vanta native splash;
- [ ] remove stretched/generic Expo-looking launch;
- [ ] short Vanta app-entry animation;
- [ ] no white flash;
- [ ] safe-area/keyboard checks;
- [ ] accessibility font scaling;
- [ ] Reduce Motion support.

## 20.5 Navigation/motion

Required:
- [ ] icons + labels in bottom navigation;
- [ ] animated active indicator;
- [ ] subtle icon/label feedback;
- [ ] consistent screen transitions;
- [ ] shared motion tokens/durations/easing;
- [ ] tactile button/card states;
- [ ] preserve restrained motion for financial/legal reading.

Game animation may be more expressive than application navigation.

## 20.6 Copy/content cleanup

Normal users should not see engineering architecture explanations.

Required:
- [ ] remove player-facing `ledger`, `read-only projection`, component/settlement explanations;
- [ ] rewrite blocked states in plain language;
- [ ] review Portuguese copy consistency;
- [ ] keep detailed server/security wording in technical/audit docs;
- [ ] keep legally required disclosures at relevant flows.

## 20.7 Legal Center completeness

Review/add where applicable:
- [ ] Terms;
- [ ] Privacy;
- [ ] Responsible Gaming;
- [ ] KYC/identity information;
- [ ] deposit/withdraw policy;
- [ ] game rules;
- [ ] promotion/bonus rules;
- [ ] account closure;
- [ ] self-exclusion/time-out;
- [ ] complaints/disputes;
- [ ] 18+/minors;
- [ ] data-protection rights;
- [ ] operator/license/regulator only when verified.

## 20.8 Versioning/release governance

Current repository version declarations are inconsistent.

Before Phase 20 completion:
- [ ] define one canonical version source;
- [ ] adopt SemVer prerelease line;
- [ ] increment Android/iOS build numbers monotonically;
- [ ] capture version/build/Git SHA/date/channel/environment;
- [ ] show version/build in About/Profile;
- [ ] define Git tag/release/changelog process;
- [ ] normalize dependency lock/frozen release installs.

See [`release/versioning-and-release-governance.md`](./release/versioning-and-release-governance.md).

## 20.9 Android artifact security

- [ ] inspect APK for secrets/tokens/backend-only configuration;
- [ ] verify production profile rejects debug behavior;
- [ ] verify HTTPS outside development;
- [ ] verify no production endpoint is accidentally opened;
- [ ] verify logs do not contain session credentials;
- [ ] record exact artifact commit/build.

## 20.10 iOS without a local iPhone

No physical iPhone is currently available.

Approach:
- [ ] validate iOS Expo/native configuration;
- [ ] macOS CI/simulator build path;
- [ ] document Apple signing/account requirements;
- [ ] create dev/preview artifact where possible;
- [ ] later TestFlight/cloud/borrowed physical-device validation.

Do not claim physical iOS validation without a device.

## 20.11 Phase 20 exit criteria

Phase 20 can be marked complete only when:

1. Android native artifact builds reproducibly.
2. Physical Android core runtime is stable.
3. session persistence + silent refresh are validated.
4. no known critical native/runtime crash remains.
5. core integrated screens pass the smoke test.
6. native launch branding is no longer generic/broken.
7. version/build provenance is controlled.
8. artifact/config/log security review passes.
9. iOS build path is validated and external blockers are explicit.
10. Phase 19 security gates remain green.
11. blocked production capabilities remain blocked.
12. canonical docs are current.

PR #24 must not merge merely because an APK exists.

---

# Post-MVP / regulated roadmap

## Phase 21 — Production environment + observability

**Status:** PLANNED

- staging/production deployment;
- managed PostgreSQL/Redis design;
- OpenTelemetry;
- alerts/SLOs;
- secrets/KMS;
- backup/restore/DR;
- IaC;
- trusted reverse-proxy/client-IP policy;
- controlled release pipeline.

## Phase 22 — Device trust + MFA/passkeys/step-up

**Status:** PLANNED

- Play Integrity;
- App Attest;
- device-risk signals;
- MFA enrollment;
- passkeys where appropriate;
- account recovery;
- step-up policy for withdrawals/security changes;
- new-device/security notifications;
- session absolute/idle lifetime policy.

## Phase 23 — Production KYC/AML provider

**Status:** PLANNED / PROVIDER DEPENDENT

- provider adapter;
- document/selfie/liveness;
- signed callbacks;
- replay protection;
- verified media policy;
- sanctions/PEP/AML workflows where required;
- audit/manual review.

## Phase 24 — Payments + reconciliation

**Status:** PLANNED / PROVIDER DEPENDENT

- payment provider adapters;
- hosted/tokenized payment methods;
- signed/replay-safe webhooks;
- idempotent processing;
- destination ownership;
- reconciliation;
- immutable ledger posting;
- chargeback/fraud handling;
- withdrawal step-up.

## Phase 25 — Game Mathematics, Exposure and Production Plinko

**Status:** PLANNED

This phase must be completed before production Plinko is considered safe.

### 25.1 Game-math specification

For each approved Plinko ruleset/risk profile:
- exact probabilities;
- payout table;
- theoretical RTP;
- house edge;
- variance/volatility;
- max multiplier/tail probability;
- approved stake range.

### 25.2 Statistical validation

- deterministic math tests;
- Monte Carlo simulation;
- convergence/tolerance;
- stress/tail scenarios;
- version/hash configuration;
- independent review/certification where required.

### 25.3 Financial risk

- max stake;
- max payout;
- bankroll assumptions;
- risk of ruin;
- drawdown;
- aggregate exposure;
- reserves/limits;
- failure/concurrency stress.

Risk controls apply before acceptance. Authorized results are not changed afterward to protect operator exposure.

### 25.4 Production game pipeline

- authenticated action endpoint;
- KYC/jurisdiction/RG checks;
- exposure check;
- idempotent reservation;
- authoritative outcome;
- transactional settlement;
- immutable ledger/result/audit;
- duplicate/replay protection;
- monitoring.

## Phase 26 — Risk, fraud and operational admin

**Status:** PLANNED

- fraud/risk signals;
- manual review;
- admin console;
- least-privilege roles;
- immutable audit;
- player/session/payment/game risk views;
- incident tooling.

This phase is operational fraud/risk and is distinct from mathematical game/exposure design in Phase 25.

## Phase 27 — Regulatory readiness and certification

**Status:** PLANNED / JURISDICTION DEPENDENT

- choose initial B2C jurisdiction only after legal/economic analysis;
- operator/legal entity;
- licensing;
- approved terms/privacy/rules;
- Responsible Gaming verification;
- complaints/support process;
- data-protection review;
- reporting/audit;
- game/platform certification.

For Portugal, verify current SRIJ requirements directly.

No `licensed` UI state without verified real license data.

## Phase 28 — Independent security assessment

**Status:** PLANNED

- independent mobile/API/infrastructure pentest;
- threat-model review;
- remediation;
- retest;
- evidence package.

## Phase 29 — Store/release readiness

**Status:** PLANNED

- Apple/Google policy review;
- distribution/jurisdiction controls;
- age/location requirements;
- production signing;
- privacy/store metadata;
- staged rollout/rollback;
- incident/update policy.

## Phase 30 — Regulated production launch

**Status:** BLOCKED until technical, provider, game-math, financial-risk, security, store and regulatory prerequisites are evidenced.

Launch readiness requires evidence, not only code completion.

---

# Parallel business workstream

This is not a software phase number, but it must proceed before commercial launch.

See [`VANTA_PRODUCT_BUSINESS_STRATEGY.md`](./VANTA_PRODUCT_BUSINESS_STRATEGY.md).

Evaluate:
- B2B Vanta Originals/technology vs first B2C operation;
- initial jurisdiction;
- GGR/NGR model;
- LTV/CAC;
- payment/fraud/compliance costs;
- gaming/corporate tax;
- required capital;
- lawful entity/holding structure;
- license/certification cost;
- banking/provider feasibility.

Do not choose a jurisdiction only because a headline tax rate looks low.
