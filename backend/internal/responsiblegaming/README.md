# Vanta Responsible Gaming Backend

This package defines server-authoritative responsible-gaming read models and command contracts.

## Enforcement rules

- Betting, deposits and other regulated operations must evaluate the current protection state server-side before execution.
- The mobile application only requests changes; it never decides whether a limit is active, when an increase becomes effective, or whether a restriction has ended.
- Limit increases may require a jurisdiction/provider-defined cooling-off period. The backend resolves the policy and returns the authoritative `EffectiveAt` timestamp.
- More restrictive changes may be applied immediately when permitted by policy; this decision is server-side.
- Time-out options and self-exclusion options are server-provided policy identifiers. The client must not invent durations.
- There is deliberately no client-facing command in this package to cancel an active time-out or revoke self-exclusion early.
- Self-exclusion state disables mutable protection capabilities in the read model.
- Commands are idempotent and must be authenticated, ownership-checked and audit logged when handlers are added.

## Data boundaries

No wallet balance, ledger mutation authority, KYC document data, authentication secret or payment credential belongs in this package.

The PostgreSQL-backed domain state is authoritative. Redis may cache enforcement decisions or propagate state changes but must never become the source of truth.

## Phase 14 scope

This phase intentionally does not register public mutation endpoints. Handlers will be enabled only when authentication, persistence, audit and cross-domain enforcement are wired end to end.
