# Wallet Read Model

This package defines validated financial projections for the Vanta wallet. It does not implement the ledger or expose public HTTP routes.

## Source of truth

Future wallet projections must be built from the authoritative PostgreSQL ledger domain. The mobile client, Redis caches, payment-provider callbacks and request payloads are never canonical balance sources.

## Required future flow

```text
Authenticated player
        ↓
Wallet query service
        ↓
player ↔ wallet ownership check
        ↓
Ledger-backed projection
        ↓
validated Wallet read model
        ↓
Mobile read-only presentation
```

## Mutation boundary

Deposits, withdrawals, wagers, payouts, refunds and adjustments must mutate money only through transactional ledger operations. They require idempotency, auditability and server-side policy checks.

No financial mutation endpoint is registered by Phase 10.

## Security expectations

- wallet IDs and transaction IDs are opaque identifiers, not authorization tokens;
- read endpoints must be scoped to the authenticated player to prevent IDOR;
- amounts use integer minor units;
- logs must not leak payment credentials or unnecessary financial PII;
- caches can accelerate reads but cannot become financial truth;
- production responses must reflect committed ledger state and an explicit projection timestamp.
