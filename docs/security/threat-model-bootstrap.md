# Bootstrap threat model

This document records the security assumptions that must remain true as Vanta grows.

## Trust boundaries

### Mobile client

Treat every value from the mobile application as attacker-controlled, including bet amount, selected game configuration, wallet identifiers, timestamps, device metadata, and locally cached state.

### Public API

The API is the first trusted enforcement boundary. It must authenticate requests, validate authorization, enforce rate limits, reject malformed input, and create idempotent commands for state-changing operations.

### Financial persistence

PostgreSQL is the durable source of truth. Financial mutations must be transactional and represented by auditable ledger records.

### Redis

Redis is non-authoritative. Loss or corruption of Redis must not alter canonical balances, settlements, or transaction history.

## Initial abuse cases

1. Client submits a negative, malformed, replayed, or out-of-policy bet.
2. Client modifies the displayed balance and attempts to spend the forged value.
3. A request is replayed to settle or deposit twice.
4. An attacker attempts high-rate betting or authentication requests.
5. Sensitive tokens are accidentally logged or committed.
6. A compromised mobile build attempts to infer or control RNG outcomes.
7. Concurrent requests attempt to overspend the same wallet funds.

## Required controls before financial features

- authenticated player identity
- explicit authorization checks
- idempotency keys
- transactional wallet reservation
- immutable ledger entries
- cryptographically secure server-side RNG
- rate limiting
- audit logging with sensitive-field redaction
- request size and timeout limits
- tests for concurrent and replay scenarios
