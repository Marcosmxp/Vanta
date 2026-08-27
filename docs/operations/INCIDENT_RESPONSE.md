# Vanta — Incident Response

## 1. Purpose

Provide a repeatable response for availability, security, data-integrity, financial, provider and release incidents without improvising destructive changes under pressure.

## 2. Workflow

```text
Detect
↓
Classify
↓
Contain
↓
Preserve evidence
↓
Diagnose
↓
Recover
↓
Validate
↓
Monitor
↓
Document
↓
Prevent recurrence
```

## 3. Severity

### SEV1 — Critical
Examples:
- confirmed compromise of production secrets/accounts;
- unauthorized financial mutation or ledger-integrity concern;
- exposure of sensitive player data;
- Responsible Gaming protection bypass with material impact;
- widespread production outage with no safe workaround.

### SEV2 — High
Examples:
- critical player/security/payment feature unavailable;
- major authentication/session failure;
- provider/reconciliation failure with contained financial risk.

### SEV3 — Medium
- partial degradation;
- non-critical feature outage;
- elevated errors with safe fallback.

### SEV4 — Low
- minor defect with limited operational impact.

Severity may be raised as evidence changes.

## 4. Initial response

For significant incidents:
- stop unsafe rollout/change activity;
- capture exact environment/version/build/commit;
- preserve relevant logs/request IDs/timestamps;
- do not post secrets or personal data into public issues/chats;
- enable safe maintenance/feature blocking where available;
- revoke credentials/sessions only when justified by the affected boundary;
- avoid destructive database commands as a first response.

## 5. Security incident containment

Depending on evidence, containment may include:
- revoke affected sessions/tokens;
- rotate compromised secret/key through the managed process;
- disable provider integration/feature;
- restrict traffic/endpoint;
- deploy known-safe code/config;
- preserve evidence before cleanup.

Never rotate a key by committing the new value to Git.

## 6. Financial/data-integrity incident

If canonical money/ledger integrity may be affected:
- stop the affected mutation path;
- preserve database/provider evidence;
- do not manually edit ledger history to make balances appear correct;
- identify impacted transaction IDs/idempotency keys;
- reconcile against provider/ledger truth when available;
- use reviewed compensating entries/processes rather than mutating immutable history.

## 7. Recovery

Recovery uses documented deployment/rollback/backup procedures:
- `DEPLOYMENT.md`;
- `ROLLBACK.md`;
- `BACKUP.md`.

Recovery is complete only after validation, not when the process merely starts again.

## 8. Validation

Confirm as applicable:
- health/readiness;
- authentication/session state;
- affected authorization boundary;
- database integrity/migration state;
- wallet/ledger consistency;
- provider reconciliation;
- Responsible Gaming protections;
- current release identity;
- error/alert levels normalized.

## 9. Communication

Production communication channels, legal/regulatory notification thresholds and responsible contacts are `DECISION REQUIRED` and jurisdiction dependent.

Do not make regulatory breach-notification claims from engineering assumptions. Qualified legal/compliance review is required when applicable.

## 10. Post-incident review

Record:
- timeline;
- impact;
- root cause/contributing factors;
- detection gap;
- containment/recovery actions;
- what worked/failed;
- regression tests;
- automation/runbook/documentation updates;
- follow-up backlog IDs.

Avoid blame-oriented retrospectives. Focus on system/process prevention and evidence.
