# Vanta Bet History

## Purpose

This feature presents server-authoritative betting history and individual bet details. It is a read-only projection layer; it never settles, mutates or reconstructs canonical bets.

## Read model

The mobile contract exposes:

- `betId`
- game
- status
- currency
- stake
- payout when available
- multiplier when available
- placed/settled timestamps
- Plinko ruleset identity
- rows, risk and result slot for Plinko detail

Monetary values remain integer minor units. Multipliers remain basis points (`10_000 = 1.00x`).

## Runtime behavior

Until authenticated backend integration exists, the application uses `disconnectedBetHistorySnapshot`, which contains no fabricated bets. The detail route receives only `betId`; it does not place an entire bet record in navigation state.

The future provider will load:

- paginated history from an authenticated read endpoint
- one canonical bet detail by `betId`

## Security and financial boundaries

- Navigation parameters contain only opaque bet IDs.
- The mobile client cannot change bet status.
- The mobile client cannot calculate canonical payout or settlement.
- The mobile client must not infer missing settlement values.
- History data must be scoped to the authenticated player server-side.
- Backend authorization must prevent IDOR access to another player's bet.
- Read responses must not contain RNG secrets, private seeds or internal fraud/risk metadata.
- Financial values shown by the UI are projections of backend state, never the ledger source of truth.

## Backend contract

`backend/internal/betting/history` defines the matching read-model invariants without registering a public endpoint in this phase. Public read handlers should only be added once authenticated player identity and persistence are available.
