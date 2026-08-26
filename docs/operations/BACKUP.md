# Vanta — Backup and Restore

## 1. Current state

The development PostgreSQL Docker volume preserves local data across container recreation, but **a Docker volume is not a production backup strategy**.

Production backup provider, schedule, retention, RPO and RTO are currently `DECISION REQUIRED`.

## 2. Data requiring backup strategy

At minimum evaluate:
- PostgreSQL canonical database;
- future private object/file storage if introduced;
- environment/configuration metadata needed for recovery;
- release/build provenance and repository source;
- provider configuration that is not reproducible from code.

Redis is ephemeral and must not contain canonical financial truth requiring backup.

## 3. Production backup requirements

Before production define:
- provider/mechanism;
- automated frequency;
- retention periods;
- encryption at rest/in transit;
- geographic/account isolation where appropriate;
- access controls;
- monitoring for backup failure;
- restore procedure;
- restore-test cadence;
- RPO/RTO approved from business/regulatory requirements.

Do not invent RPO/RTO numbers before the operational/business requirement is known.

## 4. Database backup principles

Backups must be consistent with PostgreSQL and capable of recovering canonical ledger, player, security, Responsible Gaming, legal and audit state.

Production backup credentials must be separate/protected and must not be stored in source control.

## 5. Restore procedure design

A production restore procedure should include:
1. declare/contain incident;
2. select recovery point with evidence;
3. provision isolated recovery target when possible;
4. restore database;
5. validate schema migration version;
6. run integrity/readiness checks;
7. validate ledger/account consistency as applicable;
8. validate authentication/security state implications;
9. reconcile external providers when enabled;
10. authorize traffic cutover;
11. monitor and document.

## 6. Restore testing

A backup is not considered operationally proven until a restore test succeeds.

Restore tests must not overwrite production merely to validate a backup. Prefer isolated staging/recovery environments and sanitized/safely controlled data handling.

## 7. Destructive operations

Before `DROP`, `TRUNCATE`, mass `DELETE`, destructive schema change or irreversible data migration in a production-like environment:
- stop;
- document impact;
- confirm backup/recovery point;
- define rollback/forward-fix strategy;
- require explicit approval.

## 8. Repository and configuration

GitHub source/version history is important recovery material but is not a database backup. Environment secrets must be recoverable through the selected secret-management process, not copied into backup documentation.
