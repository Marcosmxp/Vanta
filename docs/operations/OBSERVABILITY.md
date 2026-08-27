# Vanta — Observability

## 1. Objective

Observability must make failures diagnosable without exposing secrets or sensitive player data. It should answer:
- is the service available?;
- which release/environment is affected?;
- what operation failed?;
- how often?;
- what player/system boundary is impacted?;
- is financial/security integrity at risk?

## 2. Current baseline

Already present:
- `/health` liveness;
- `/health/ready` PostgreSQL/Redis readiness;
- `/v1/platform/status` presentation-safe platform state;
- structured Go logging foundation;
- request IDs;
- HTTP status/duration logging;
- CI/CodeQL/build evidence;
- release/version/build metadata.

Centralized production logs, metrics, traces, alerting and crash/error tracking are not yet selected.

## 3. Logging standard

Useful fields where relevant:
- timestamp;
- severity;
- environment;
- service/version/build;
- request ID/correlation ID;
- event name;
- safe resource identifier;
- result/status/error code;
- duration.

Never log:
- passwords;
- access/refresh tokens;
- OTP/recovery data;
- secret/private keys;
- raw payment credentials;
- raw KYC documents;
- full sensitive support/PII payloads.

## 4. Metrics to introduce before production

At minimum evaluate:
- API request rate/latency/error rate;
- health/readiness failures;
- database pool/connectivity/latency;
- Redis availability for security-critical throttling;
- authentication success/failure/rate-limit events;
- silent refresh success/failure;
- session revocation anomalies;
- wallet/ledger mutation/reconciliation failures;
- payment/KYC callback failures when integrated;
- Responsible Gaming enforcement failures;
- game settlement/exposure/risk exceptions;
- mobile crash-free sessions/users when telemetry is selected.

Do not invent SLO numbers before load/pilot evidence and operational requirements exist.

## 5. Tracing/correlation

Provider and financial workflows should eventually carry correlation/request identifiers across API, provider callbacks and internal audit records where safe.

Tracing tools must be configured to redact request bodies/headers that may contain credentials or PII.

## 6. Alerting

Production alert rules should focus on actionable safety/availability conditions rather than noisy dashboards.

Likely alert classes:
- API unavailable/readiness failing;
- authentication/security anomaly;
- database unavailable;
- financial settlement/reconciliation exception;
- provider callback failure/replay anomaly;
- Responsible Gaming enforcement failure;
- backup failure;
- elevated error/crash rate.

Owner/escalation destinations are `DECISION REQUIRED` before production.

## 7. Analytics vs observability

Operational observability is not product behavioral tracking. Any product analytics SDK or event collection requires separate privacy/product review and should collect only necessary data.

## 8. Production selection criteria

Do not automatically add a paid service. Evaluate:
- required capabilities;
- privacy/data residency;
- access controls;
- redaction;
- retention;
- cost at expected volume;
- mobile + Go support;
- alert integrations;
- export/vendor-lock-in implications.

Selected production tooling: `UNKNOWN / DECISION REQUIRED`.
