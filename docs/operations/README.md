# Vanta — Operations Documentation

This directory contains canonical operating procedures and readiness requirements. It does not imply that production infrastructure already exists.

## Read order

1. [`ENVIRONMENTS.md`](./ENVIRONMENTS.md) — local/development/preview/production boundaries and current status.
2. [`DEPLOYMENT.md`](./DEPLOYMENT.md) — current deployment/build paths and future controlled production sequence.
3. [`ROLLBACK.md`](./ROLLBACK.md) — application/config/database rollback principles.
4. [`BACKUP.md`](./BACKUP.md) — backup/restore requirements and current gaps.
5. [`OBSERVABILITY.md`](./OBSERVABILITY.md) — logging, metrics, tracing and alerting strategy.
6. [`INCIDENT_RESPONSE.md`](./INCIDENT_RESPONSE.md) — severity, containment, recovery and post-incident workflow.
7. [`EXTERNAL_SERVICES.md`](./EXTERNAL_SERVICES.md) — current/future external service register without secrets.

## Related canonical records

- Release/version rules: `docs/release/versioning-and-release-governance.md`.
- Current native build state: `docs/release/phase20-native-builds.md`.
- Production gate: `docs/quality/PRODUCTION_READINESS.md`.
- Security model: `docs/security/SECURITY_MODEL.md`.
- Privacy inventory: `docs/security/DATA_PRIVACY.md`.
- Database rules: `docs/engineering/DATABASE.md`.

## Current operational status

```text
Local development      ACTIVE
Native alpha builds    ACTIVE
Preview/staging        PARTIAL / infrastructure not complete
Production             BLOCKED
```

Do not add a runbook merely to fill a directory. Add a runbook when a recurring/high-risk operational procedure has enough concrete infrastructure to make commands accurate and testable.
