# Vanta — Project Status

**Last updated:** 2026-08-26  
**Current controlled release:** `0.1.0-alpha.1`  
**Current milestone:** Phase 20 — Native MVP Builds and Device Validation  
**Active branch/PR:** `feat/phase20-native-builds` / PR #24

## Current state

Vanta has completed Phases 01–19 on `main`. Phase 20 is raising the integrated MVP to a reproducible, testable native alpha.

The deterministic JavaScript baseline is complete:

- Node `22.13.0` baseline aligned locally and in CI;
- pnpm `10.15.0` baseline aligned locally and in CI;
- root `pnpm-lock.yaml` committed;
- local frozen install validated;
- CI frozen install validated;
- Native Android frozen install validated;
- CI green;
- CodeQL green;
- Native Android build green.

## Completed in current Phase 20 branch

- canonical release identity `0.1.0-alpha.1` / native build `2`;
- deterministic pnpm lockfile/frozen installs;
- versioned Android artifact pipeline;
- Android physical-device development runtime;
- registration/login against local Go/PostgreSQL/Redis stack;
- Home/Profile/Wallet integration;
- wallet empty-collection crash fix;
- Legal/Support/Responsible Gaming empty-collection crash fix;
- force-close/reopen SecureStore session persistence evidence;
- player-facing localization foundation (`pt-BR`, `en`, `es`);
- localization of core player journeys in progress;
- navbar icon/motion foundation;
- stale auth error/password-helper improvements;
- root `AGENTS.md` AI/developer operating contract;
- Phase 20 release documentation updated for reproducible baseline.

## In progress

- complete product copy/localization cleanup across remaining screens;
- verify true silent access-token refresh with protected request after access expiry;
- remote session revocation/expiry evidence;
- final native icon/splash/launch experience;
- broader accessibility/native layout validation;
- artifact provenance correction for PR source SHA;
- artifact/config secret inspection;
- Legal Center completeness/content review;
- iOS CI/build/simulator path.

## Blocked by deliberate production gates

- production real-money wager/settlement;
- live PSP payment execution/reconciliation;
- production KYC/AML provider;
- production MFA/passkey/step-up;
- device trust/risk controls where applicable;
- final jurisdiction configuration/licensing/certification;
- approved game math/bankroll/exposure controls;
- independent production security assessment;
- production secrets/KMS/signing/operations readiness.

## Known critical issues

No confirmed P0 issue is currently recorded in the repository audit baseline.

Open P1/P2 work is tracked in `BACKLOG.md`, `TECH_DEBT.md`, `RISKS.md` and the current Phase 20 release/troubleshooting documents.

## Next priorities

1. finish Phase 20 session evidence and product/native polish gates;
2. correct source-SHA artifact provenance and inspect artifact/config for secrets;
3. complete iOS build-path evidence;
4. keep CI/CodeQL/native build green;
5. do not merge PR #24 until documented Phase 20 exit criteria are satisfied;
6. after Phase 20, proceed into production-readiness roadmap rather than opening real-money features prematurely.

## Baseline health

| Area | Status |
|---|---|
| Git working baseline | GREEN after local sync/clean verification |
| JavaScript dependency reproducibility | GREEN |
| Mobile typecheck/tests/bundles | GREEN in latest baseline CI |
| Backend tests/vet/vulnerability/container checks | GREEN in latest baseline CI |
| CodeQL | GREEN |
| Android native build | GREEN |
| Physical Android core smoke | PARTIAL / continuing |
| iOS build path | PENDING |
| Production readiness | BLOCKED / intentionally incomplete |

## Status update rule

Update this file at meaningful milestone/checkpoint changes, not after every small commit. Do not mark production capabilities complete without evidence from the full authoritative/provider/regulatory boundary.
