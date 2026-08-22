# Vanta Mobile Navigation

## Route ownership

### Root stack

- `Auth` — authentication and onboarding entry point.
- `Main` — authenticated application shell.
- `SessionExpired` — security/session interruption presented modally.
- `AccountBlocked` — non-dismissible account security state.

### Auth stack

- `Welcome`
- `Login`

These are structural placeholders only. Phase 05 replaces them with the production authentication and onboarding flow.

### Main tabs

- `Home`
- `Play` — emphasized primary action.
- `Wallet`
- `Profile`

The custom tab bar is backed by the Vanta `BottomNavigation` design-system component.

## Security boundaries

Navigation never decides whether a player is authenticated, eligible, funded, KYC-approved, allowed to wager, or allowed to withdraw. Those decisions come from trusted application/backend state and server-authoritative APIs.

Route visibility is not authorization. Sensitive backend operations must continue to validate authentication, authorization, account state, responsible-gaming limits, idempotency, and financial invariants server-side.

No credentials, secrets, canonical balances, RNG state, payout rules, or settlement authority belong in route parameters or navigation state.

## Current bootstrap behavior

Until Phase 05 introduces the authentication coordinator, the root navigator starts at `Main` so the application shell can be developed and reviewed independently. The `Auth` stack already exists and is ready to become the real entry flow.
