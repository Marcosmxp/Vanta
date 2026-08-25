# Vanta Plinko — Server Boundary

## Purpose

This package owns deterministic game-domain rules and cryptographically secure drop generation for Plinko. It is intentionally not exposed as a public wager endpoint yet.

Canonical math/risk specification: [`../../../../docs/architecture/game-math-financial-risk-engine.md`](../../../../docs/architecture/game-math-financial-risk-engine.md).

## Security model

The mobile client is untrusted. It may render a board and animate a server-authorized path, but it must never decide:

- RNG output
- result slot
- multiplier
- payout
- wallet balance
- bet acceptance
- settlement
- operator exposure limits

`SecureEngine` uses `crypto/rand` and fails closed when entropy cannot be read.

## Probability model

For the current engine, each row produces one fair Left/Right binary outcome. With `n` rows, final slot `k` is the number of Right moves and has theoretical probability:

```text
P(K = k) = C(n, k) / 2^n
```

Production payout math must calculate RTP/house edge from this exact distribution and the versioned multiplier table.

## Rulesets

Production payout math must arrive through a versioned `Ruleset`. The repository does not contain a production-approved multiplier table in the current closed MVP.

A future production ruleset must pass theoretical calculation, automated tests, simulation, bankroll/exposure review and jurisdiction-specific certification/review where required before `ProductionApproved` is enabled.

Tests may use fixtures only; test multipliers are not product configuration.

## Future wager flow

The eventual authenticated endpoint will execute this order inside trusted backend boundaries:

1. Authenticate player/session.
2. Validate account, KYC, jurisdiction and Responsible Gaming state.
3. Validate idempotency key and request limits.
4. Load the exact active approved ruleset/version/hash.
5. Validate stake, max payout and aggregate exposure before acceptance.
6. Reserve stake/risk capacity through trusted transactional boundaries.
7. Durably accept the wager.
8. Generate the secure Plinko path on the server.
9. Resolve the result slot and multiplier from the accepted ruleset.
10. Calculate payout with checked integer arithmetic.
11. Persist bet/result/ruleset/audit data and settle the ledger atomically/outbox-assisted.
12. Release exposure reservation and return the authoritative result to mobile for animation only.

The system must not learn the authoritative outcome and then decide whether the wager is financially convenient to accept.

Until Phase 25 game-math/risk and Phase 26 wager/settlement prerequisites are completed, no production public `POST /v1/games/plinko/bets` path should be opened.
