# Player Profile Read Model

This package defines the privacy-minimized projection used by authenticated profile surfaces.

## Included

- opaque player ID
- display name
- masked email and/or masked phone
- country code
- membership timestamp
- age-verification state
- KYC state
- account state
- language and communication preference state
- high-level responsible-gaming protection state

## Excluded

The profile projection must not become a replica of KYC or identity-storage systems. It intentionally excludes:

- legal identity documents
- document numbers
- raw document/selfie media
- full legal address
- raw email/phone when masked values are sufficient
- authentication secrets and session tokens
- fraud/risk internal notes
- financial balances or ledger data

Handlers exposing this projection must authenticate the player and scope the projection to that player's account. Route visibility is not authorization.
