# Vanta Plinko — Mobile Boundary

## Runtime responsibility

The mobile client renders the Plinko experience and animates an already-authorized result. It is not a trusted game engine.

The production client must never generate or decide:

- RNG output
- left/right path
- result slot
- multiplier
- payout
- canonical wallet balance
- bet acceptance
- settlement

## Provider contract

`PlinkoProvider` is the only intended entry point for live game data. A production implementation will call authenticated Vanta APIs and return a versioned ruleset plus server-authoritative bet results.

`PlinkoGameScreen` validates result shape before rendering so malformed/inconsistent responses fail closed visually. This validation is defensive rendering only and is not authorization.

## Disconnected runtime

Until authentication, wallet, ledger and betting APIs are integrated:

- the app displays the real Plinko UI shell;
- the board uses a 12-row visual preview geometry;
- multipliers remain unavailable (`—`);
- stake entry and the bet button are disabled;
- no local result is generated.

## Storybook preview

Storybook contains a deterministic preview provider solely for UI supervision and animation review. The fixture multipliers/results are test data and must never be promoted to product configuration.

## Production integration requirements

Before enabling live betting, the API path must enforce authentication, KYC/jurisdiction, responsible-gaming limits, wallet/ledger reservation, idempotency, approved versioned rulesets, secure server RNG, immutable audit records and atomic settlement semantics.
