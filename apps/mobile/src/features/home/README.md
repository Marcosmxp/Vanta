# Vanta Home

## Purpose

The Home feature is the authenticated landing experience for wallet visibility, game discovery, recent activity, and responsible-gaming messaging.

## Data boundary

The mobile client is a read-only consumer of financial and account state.

`HomeProvider` is the integration boundary for the future authenticated API. Production implementations must source wallet and activity data from trusted backend services.

Until that integration exists, the app uses `disconnectedHomeSnapshot`, which intentionally contains:

- no fabricated balance
- no fabricated deposits or withdrawals
- no fabricated bets or settlements
- static product metadata only for the featured Plinko game

## Financial rules

Never derive or persist canonical balance from Home UI state. The client may format values returned by the server, but it must not become the source of truth for:

- available balance
- pending balance
- deposits
- withdrawals
- bet stakes
- payouts
- settlement state

Those values must remain backed by the server-side ledger and trusted APIs.

## Navigation

Home CTAs navigate only to existing application areas:

- Wallet summary -> `Wallet`
- Featured Plinko -> `Play`
- Profile control -> `Profile`

Navigation does not authorize any operation.

## Responsible gaming

The Home experience surfaces responsible-gaming messaging early. Limits, self-exclusion, pauses, eligibility and other restrictions must be enforced server-side and cannot rely on client presentation state.
