# Vanta Mobile Navigation

## Route ownership

### Root stack

- `Auth` — onboarding and authentication entry point. This is now the default application entry.
- `Main` — authenticated application shell.
- `SessionExpired` — security interruption that forces reauthentication.
- `AccountBlocked` — non-dismissible account security state.

### Auth stack

- `Splash`
- `OnboardingOne`
- `OnboardingTwo`
- `OnboardingThree`
- `Eligibility`
- `Welcome`
- `Login`
- `CreateAccount`
- `Verification`
- `ForgotPassword`
- `ResetPassword`

The onboarding and form screens live under `features/auth`; the navigator only owns route composition and transitions.

### Main tabs

- `Home`
- `Play` — emphasized primary action.
- `Wallet`
- `Profile`

The custom tab bar is backed by the Vanta `BottomNavigation` design-system component.

## Security boundaries

Navigation never decides whether a player is authenticated, eligible, funded, KYC-approved, allowed to wager, or allowed to withdraw. Those decisions come from trusted application/backend state and server-authoritative APIs.

Route visibility is not authorization. Sensitive backend operations must continue to validate authentication, authorization, account state, responsible-gaming limits, idempotency, and financial invariants server-side.

Credentials, passwords, OTP values, secrets, canonical balances, RNG state, payout rules, and settlement authority must never be stored in route parameters or navigation state.

Phase 05 validates form shape locally for UX only. It does not mint sessions, persist passwords, create local OTPs, or grant access to protected backend operations.

## Entry behavior

The root navigator starts at `Auth`. Splash transitions into onboarding, then age eligibility and the Welcome screen. `Main` remains available as a route for the future trusted authentication coordinator, but the Phase 05 forms do not navigate to it after local validation alone.
