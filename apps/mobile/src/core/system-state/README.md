# Vanta System States

Phase 16 standardizes Loading, Empty, Offline, Error and Maintenance behavior across the mobile application.

## Semantics

- `loading` — a trusted request is in progress. Sensitive data is not guessed or reconstructed while waiting.
- `empty` — the trusted source answered successfully and there is no data to display.
- `offline` — network/service connectivity is unavailable. Sensitive write operations remain blocked until connectivity and server state are re-established.
- `error` — a request or read-model validation failed. The client does not assume the requested operation succeeded.
- `maintenance` — trusted platform availability indicates that one or more Vanta services are intentionally unavailable.

## Security rules

- A UI state is never authorization.
- Financial, betting, KYC, security and responsible-gaming commands must fail closed when authoritative backend state is unavailable.
- Cached presentation data must not be treated as canonical balance, settlement, KYC status, session status or protection state.
- Maintenance is driven by trusted platform/bootstrap state, not a client-controlled toggle.
- Offline/error messages must not expose internal hostnames, stack traces, provider secrets or infrastructure topology.
- Retry buttons repeat safe reads or idempotent commands only; retry UI does not create its own success state.

## Connectivity

Phase 16 defines the offline presentation boundary but intentionally does not add a network-monitoring dependency. Connectivity detection can be wired during client/server integration using a platform-compatible provider without changing feature-level state presentation.
