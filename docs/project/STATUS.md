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
- controlled release metadata and native artifact workflow established.

### Canonical foundation established

- root `AGENTS.md` operating contract;
- `PROJECT`, `MVP`, `REQUIREMENTS`;
- `STATUS`, `BACKLOG`, `TECH_DEBT`, `RISKS`;
- engineering `ARCHITECTURE`, `COMPONENTS`, `DATABASE`, `CODING_STANDARDS`, `DEPENDENCIES`, `GIT_WORKFLOW`;
- quality `TESTING` and `PRODUCTION_READINESS`;
- canonical `SECURITY_MODEL` and `DATA_PRIVACY`;
- operations `ENVIRONMENTS`, `DEPLOYMENT`, `ROLLBACK`, `BACKUP`, `OBSERVABILITY`, `INCIDENT_RESPONSE`, `EXTERNAL_SERVICES`;
- documentation index/precedence for future Codex sessions.

### FOUNDATION-005 quality/governance enforcement

Completed on the Phase 20 branch:

- repository hygiene CI gate for code/config whitespace and tracked secret-like files;
- critical mobile tests for session timing, SecureStore persistence, locale selection and API null-collection regressions;
- Android source SHA separated from CI merge SHA in provenance;
- Android APK inspection for server-only configuration/secret-like files;
- PR template aligned with scope, database, dependency, environment, release, accessibility, testing and self-review rules;
- CI/CodeQL/Android concurrency cancels superseded runs;
- Actions checkout/setup runtimes updated where changed;
- dependency-health evidence records 2 moderate advisories without hiding them via broad upgrades;
- repository ruleset `main-protection` (`21597647`) active for `refs/heads/main`.

Final FOUNDATION-005 evidence on source HEAD `f8eeecf51d275aaea23efbcc7dbceb20e967465e`:

- CI: success;
- CodeQL: success;
- Native Android MVP: success;
- Repository hygiene: success;
- Mobile validation: success;
- Go tests: success;
- Analyze javascript-typescript: success;
- Analyze go: success.

The active `main` ruleset requires pull requests and the five repository/security checks above, uses strict status-check policy, blocks branch deletion and non-fast-forward/force-push changes, and does not require an impossible self-approval in the current solo workflow.

## Completed in current Phase 20 branch

- canonical release identity `0.1.0-alpha.1` / native build `2`;
- deterministic pnpm lockfile/frozen installs;
- versioned Android artifact pipeline;
- Android physical-device development runtime;
- registration/login against local Go/PostgreSQL/Redis stack;
- Home/Profile/Wallet integration;
- Wallet/Legal/Support/Responsible Gaming null-collection crash fixes plus regression-test coverage;
- force-close/reopen SecureStore session persistence evidence;
- player-facing localization foundation (`pt-BR`, `en`, `es`) and locale-policy tests;
- localization of core player journeys in progress;
- navbar icon/motion foundation;
- stale auth error/password-helper improvements;
- canonical product/project/engineering/security/privacy/quality/operations documentation foundation;
- repository/PR quality-gate foundation;
- source-SHA provenance and APK security inspection validated in the native pipeline;
- `main` repository governance ruleset active.

## In progress

- complete product copy/localization cleanup across remaining screens;
- verify true silent access-token refresh with protected request after access expiry;
- remote session revocation/expiry evidence;
- final native icon/splash/launch experience;
- broader accessibility/native layout validation;
- Legal Center completeness/content review;
- iOS CI/build/simulator path;
- scoped dependency-health remediation for current moderate/peer/transitive warnings;
- broader mobile regression coverage beyond the current critical foundation.

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
2. complete iOS build-path evidence;
3. continue critical mobile regression coverage without broad test-framework churn;
4. keep CI/CodeQL/native build green;
5. do not merge PR #24 until documented Phase 20 exit criteria are satisfied;
6. after Phase 20, implement/test production-readiness controls incrementally rather than opening regulated capabilities prematurely.

## Status update rule

GitHub Actions is the authoritative source for the pass/fail state of the latest commit. This file records milestone capability/state and must not claim a specific HEAD is green without corresponding workflow evidence.
