# Vanta — Rollback

## 1. Principle

Rollback must restore a known safe state without destroying evidence or corrupting data. Application rollback and database rollback are different operations and must not be treated as one command.

## 2. Application rollback

For code/config regressions without incompatible database changes:
1. identify the last known-good release commit/artifact;
2. stop further rollout;
3. redeploy the known-good artifact/configuration;
4. validate health/readiness and critical smoke tests;
5. monitor error/security signals;
6. record incident/root cause and follow-up.

Do not rewrite Git history to perform an operational rollback.

## 3. Mobile rollback

Native mobile binaries already installed on user devices cannot be assumed to disappear immediately.

Therefore backend/API compatibility should support safe coexistence during rollout/rollback where feasible. Emergency mobile response may require:
- disabling an unsafe feature server-side;
- maintenance mode;
- store release rollback/replacement where platform rules permit;
- minimum-supported-version policy in the future.

`DECISION REQUIRED` before production distribution.

## 4. Database rollback

Current migrations are forward-only embedded SQL migrations. There is no canonical automated down-migration system.

Therefore:
- never run destructive reverse SQL automatically;
- prefer backward-compatible migrations and forward fixes;
- before destructive production migration, document data impact, backup, recovery and compatibility;
- if restore is required, use a validated backup/restore procedure and explicit authorization.

A rollback that restores application code but leaves an incompatible schema is not a successful rollback.

## 5. Configuration rollback

Configuration changes must be versioned/auditable where possible. If a deployment failure is configuration-only:
- restore the previous known-good configuration from the secret/config management system;
- do not copy secrets into Git or incident documents;
- validate environment identity and affected providers.

## 6. Validation after rollback

Confirm:
- expected version/commit is running;
- API health/readiness;
- database/cache connectivity;
- authentication/session behavior;
- critical read flows;
- no migration inconsistency;
- error rate returned to expected baseline;
- financial/provider reconciliation where relevant.

## 7. Production prerequisite

Before production, rollback must be tested in staging using the selected infrastructure/provider. A document alone is not evidence that rollback works.
