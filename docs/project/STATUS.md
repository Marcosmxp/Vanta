# Vanta — Project Status

**Last updated:** 2026-08-26  
**Current controlled release:** `0.1.0-alpha.1`  
**Current milestone:** Phase 20 — Native MVP Builds and Device Validation  
**Active branch/PR:** `feat/phase20-native-builds` / PR #24

## Current state

Vanta has completed Phases 01–19 on `main`. Phase 20 is raising the integrated MVP to a reproducible, testable native alpha while the repository is being professionalized for continuous AI-assisted development.

### Deterministic baseline

- Node `22.13.0` aligned locally and in CI;
- pnpm `10.15.0` aligned locally and in CI;
- root `pnpm-lock.yaml` committed;
- local/CI/native frozen installs validated;
- CI green;
- CodeQL green;
- Native Android build green.

### Canonical foundation established

- root `AGENTS.md` operating contract;
- `PROJECT`, `MVP`, `REQUIREMENTS`;
- `STATUS`, `BACKLOG`, `TECH_DEBT`, `RISKS`;
- engineering `ARCHITECTURE`, `COMPONENTS`, `DATABASE`, `CODING_STANDARDS`, `DEPENDENCIES`, `GIT_WORKFLOW`;
- quality `TESTING` and `PRODUCTION_READINESS`;
- canonical `SECURITY_MODEL` and `DATA_PRIVACY` engineering inventory;
- operations `ENVIRONMENTS`, `DEPLOYMENT`, `ROLLBACK`, `BACKUP`, `OBSERVABILITY`, `INCIDENT_RESPONSE`, `EXTERNAL_SERVICES`;
- documentation index/precedence updated for future Codex sessions.

These documents deliberately distinguish implemented development/alpha behavior from future production requirements. They do not claim that production hosting, providers, KMS, backups, monitoring or regulatory authorization already exist.

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
- repository-level AI/developer operating contract;
- canonical product/project/engineering/security/privacy/quality/operations documentation foundation;
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
- production secrets/KMS/signing;
- staging/production infrastructure selection;
- implemented/tested production backup/restore, observability, rollback and incident tooling.

## Known critical issues

No confirmed P0 issue is currently recorded in the repository audit baseline.

Open P1/P2 work is tracked in `BACKLOG.md`, `TECH_DEBT.md`, `RISKS.md`, `quality/PRODUCTION_READINESS.md` and current Phase 20 release/troubleshooting documents.

## Next priorities

1. finish Phase 20 session evidence and product/native polish gates;
2. correct source-SHA artifact provenance and inspect artifact/config for secrets;
3. complete iOS build-path evidence;
4. keep CI/CodeQL/native build green;
5. do not merge PR #24 until documented Phase 20 exit criteria are satisfied;
6. after Phase 20, implement/test production-readiness controls incrementally rather than opening regulated capabilities prematurely.

## Baseline health

| Area | Status |
|---|---|
| Git working baseline | GREEN after local sync/clean verification |
| JavaScript dependency reproducibility | GREEN |
| Mobile typecheck/tests/bundles | GREEN in latest baseline CI |
| Backend tests/vet/vulnerability/container checks | GREEN in latest baseline CI |
| CodeQL | GREEN |
| Android native build | GREEN |
| Canonical AI/project/engineering/security/operations docs | GREEN / established |
| Security/privacy model documentation | GREEN / implementation gaps tracked separately |
| Physical Android core smoke | PARTIAL / continuing |
| iOS build path | PENDING |
| Staging infrastructure | BLOCKED / not selected |
| Production readiness | BLOCKED / intentionally incomplete |

## Status update rule

Update this file at meaningful milestone/checkpoint changes, not after every small commit. Do not mark production capabilities complete without evidence from the full authoritative/provider/regulatory/operational boundary.
