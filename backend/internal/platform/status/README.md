# Vanta Platform Status

This package defines the public, presentation-safe availability read model used by clients to distinguish operational, degraded and maintenance states.

## Security boundaries

- Internal hostnames, database/cache/provider health, stack traces, exception messages, deployment identifiers and infrastructure topology must not be exposed through this read model.
- `IncidentID` is a public correlation identifier, not an internal alert or tracing secret.
- Maintenance routing in the mobile application is presentation only. Backend handlers remain responsible for rejecting unavailable or unsafe operations server-side.
- A client-visible operational state never authorizes betting, payments, withdrawals, KYC, account changes or any other protected operation.
- Maintenance/degraded status should be produced by trusted platform configuration/health coordination, not by client-controlled input.

## Phase 16 scope

Phase 16 defines the contract and UI boundary only. It does not register a public status endpoint or introduce an external incident-management provider.
