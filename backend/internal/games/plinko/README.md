# Vanta Plinko — Server Boundary

## Purpose

This package owns deterministic game-domain rules and cryptographically secure drop generation for Plinko. It is intentionally not exposed as a public wager endpoint yet.

## Security model

The mobile client is untrusted. It may render a board and animate a server-authorized path, but it must never decide:

- RNG output
- result slot
- multiplier
- payout
- wallet balance
- bet acceptance
- settlement

`SecureEngine` uses `crypto/rand` and fails closed when entropy cannot be read.

## Rulesets

Production payout math must arrive through a versioned `Ruleset`. The repository does not contain a production-approved multiplier table in Phase 08.

A future production ruleset must be reviewed/certified for the target jurisdiction before `ProductionApproved` is enabled. Tests use fixtures only; test multipliers are not product configuration.

## Future wager flow

The eventual authenticated endpoint will execute this order inside trusted backend boundaries:

1. Authenticate player/session.
2. Validate account, KYC, jurisdiction and responsible-gaming state.
3. Validate idempotency key and request limits.
4. Load the exact approved ruleset/version.
5. Reserve the stake through the ledger transaction boundary.
6. Generate the secure Plinko path on the server.
7. Resolve the result slot and multiplier from the same ruleset.
8. Calculate payout with checked integer arithmetic.
9. Persist bet/result/audit data and settle the ledger atomically/outbox-assisted.
10. Return the authoritative result to mobile for animation only.

Until the identity, wallet and ledger modules exist, no public `POST /v1/games/plinko/bets` handler is registered.
