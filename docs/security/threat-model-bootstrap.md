# Backend threat model

This document records the security assumptions that must remain true as Vanta grows.

## Trust boundaries

### Mobile client

Treat every value from the mobile application as attacker-controlled, including bet amount, selected game configuration, wallet identifiers, timestamps, device metadata, route state and locally cached data. UI visibility never grants authorization.

### Public API

The Go API is the first trusted enforcement boundary. It authenticates bearer credentials, validates resource ownership, applies request limits, rejects malformed JSON and owns state-changing application commands.

### PostgreSQL

PostgreSQL is the durable source of truth for identity, sessions, KYC status, wallet/ledger, bets, responsible-gaming state, support, legal configuration, idempotency, outbox and audit data.

### Redis

Redis is non-authoritative. Phase 17 uses it for authentication throttling and permits future ephemeral cache/coordination uses only. Loss or corruption of Redis must never change canonical balances, settlements, KYC decisions or responsible-gaming restrictions.

## Phase 17 controls implemented

- opaque access tokens with short TTLs;
- opaque rotating refresh tokens;
- only token hashes persisted;
- refresh-token reuse/mismatch causes defensive revocation;
- bcrypt password hashing;
- AES-256-GCM protection for selected PII and support message bodies;
- HMAC-SHA256 lookup keys for searchable PII;
- Redis-backed authentication throttling that fails closed;
- strict/size-limited JSON request decoding;
- server-generated request IDs;
- authenticated ownership checks for player-scoped resources;
- PostgreSQL migrations applied before HTTP traffic is accepted;
- immutable double-entry ledger records;
- serializable ledger posting with per-player locking;
- ledger idempotency and negative-balance rejection;
- Responsible Gaming policy options loaded from PostgreSQL;
- cooling-off decisions enforced server-side;
- time-out/self-exclusion cannot be ended by mobile commands;
- presentation-safe health/platform-status responses;
- security headers and no-store responses;
- logs exclude request bodies, bearer tokens, refresh tokens and support message bodies;
- non-root/read-only local API container;
- PostgreSQL/Redis integration tests in CI.

## Abuse cases that remain in scope

1. Client submits a negative, malformed, replayed or out-of-policy bet.
2. Client modifies displayed balance and attempts to spend forged state.
3. Concurrent commands attempt to overspend a wallet.
4. Attacker steals/replays bearer or refresh credentials.
5. Attacker enumerates opaque IDs to attempt IDOR.
6. High-rate authentication or future betting requests attempt resource exhaustion.
7. Sensitive data is accidentally logged, committed or returned in error payloads.
8. Compromised mobile builds attempt to infer/control RNG outcomes.
9. Payment-provider callbacks are forged or replayed.
10. KYC/provider callbacks attempt unauthorized state transitions.

## Deliberately closed boundaries

Phase 17 does not expose production money mutation for Plinko, deposits or withdrawals. It also does not expose payment-provider or KYC-provider callback endpoints. These surfaces remain closed until provider authentication, reconciliation, idempotency, audit, Responsible Gaming/KYC enforcement and settlement invariants are complete.

## Required controls before real-money Plinko

- authenticated/active player session;
- KYC and age eligibility;
- jurisdiction authorization;
- active Responsible Gaming restrictions and limit checks;
- transactional wallet reservation through the ledger;
- approved/versioned Plinko ruleset;
- cryptographically secure server-side RNG;
- atomic bet record + ledger settlement;
- idempotent command handling;
- replay protection;
- audit/outbox events;
- concurrency and failure-injection tests;
- no client-side payout authority.
