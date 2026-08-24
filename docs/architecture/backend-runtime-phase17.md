# Phase 17 backend runtime

## Runtime topology

```text
Mobile client
    |
    | HTTPS / bearer access token
    v
Go API
    |---------------- PostgreSQL (canonical state)
    |
    `---------------- Redis (ephemeral controls only)
```

The API is a modular monolith. Domain packages own contracts and persistence boundaries while the platform layer owns configuration, HTTP middleware, database/cache connections, migrations, IDs, PII protection and rate limiting.

## Startup sequence

1. Validate environment configuration.
2. Connect and ping PostgreSQL.
3. Acquire the migration advisory lock and apply embedded SQL migrations.
4. Connect and ping Redis.
5. Initialize PII encryption/lookup protection.
6. Construct repositories and application services.
7. Register public and authenticated routes.
8. Start accepting HTTP traffic.

A failure in any required startup dependency prevents the API from accepting traffic.

## PostgreSQL authority

PostgreSQL owns canonical state for:

- players and credentials;
- sessions;
- KYC status;
- wallets and ledger;
- bets/history;
- responsible-gaming protection;
- payment intents (schema only in Phase 17);
- support requests;
- legal/compliance configuration;
- idempotency records;
- outbox events;
- audit events.

## Financial model

Wallet balances are derived from ledger entries. The ledger uses immutable transactions/entries, double-entry balancing, serializable application transactions, per-player transaction locking, idempotency and non-negative wallet checks.

System/clearing accounts may have no wallet owner. Player wallet accounts are checked against the authenticated player before posting.

## Session model

Registration creates player, credentials, wallet, wallet ledger accounts, KYC state and responsible-gaming state transactionally. Login creates an opaque access/refresh session. Only token hashes are stored.

Refresh rotates both access and refresh credentials. Reuse of a previous refresh generation is rejected and the session is revoked defensively.

## Redis boundary

Redis may be used for:

- request/authentication throttling;
- caches of non-canonical reads;
- short-lived coordination/locks where loss is safe.

Redis must never contain the only copy of a balance, settlement, bet result, KYC decision or responsible-gaming restriction.

## Deliberately closed Phase 17 boundaries

Phase 17 does not expose real-money mutation endpoints for Plinko, deposits or withdrawals. It also does not implement provider callbacks for payment or KYC vendors. These remain closed until provider adapters, settlement/reconciliation and all enforcement dependencies are integrated.

## Phase 18 integration target

The mobile providers will consume the real HTTP API while preserving server authority. Secure mobile token storage and the session/bootstrap coordinator become part of that integration; client navigation state remains non-authoritative.
