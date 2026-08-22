# Vanta Mobile Navigation

## Route ownership

### Root stack

- `Auth` — onboarding and authentication entry point. This is the default application entry.
- `Kyc` — identity-verification flow owned separately from authentication and the main application shell.
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

### KYC stack

- `Intro`
- `DocumentType`
- `DocumentCapture`
- `Selfie`
- `Processing`
- `Approved`
- `Rejected`
- `Retry`

Only the document category may be passed through navigation. Raw document images, document numbers, selfies, biometric media, provider session secrets, and capture payloads are forbidden in navigation state.

### Main tabs

- `Home`
- `Play` — emphasized primary action.
- `Wallet`
- `Profile`

The custom tab bar is backed by the Vanta `BottomNavigation` design-system component.

## Security boundaries

Navigation never decides whether a player is authenticated, eligible, funded, KYC-approved, allowed to wager, or allowed to withdraw. Those decisions come from trusted application/backend state and server-authoritative APIs.

Route visibility is not authorization. Sensitive backend operations must continue to validate authentication, authorization, account state, responsible-gaming limits, idempotency, and financial invariants server-side.

Credentials, passwords, OTP values, raw KYC media, secrets, canonical balances, RNG state, payout rules, and settlement authority must never be stored in route parameters or navigation state.

The authentication and KYC presentation layers validate UX state only. They do not mint sessions, create local OTPs, approve KYC locally, or grant access to protected backend operations.

## Entry and future coordination

The root navigator still starts at `Auth`. Phase 06 registers `Kyc` as a separate root flow, but intentionally does not create a client-side shortcut from a locally validated OTP into KYC or from a KYC screen into `Main`.

The future trusted authentication/session coordinator will decide among `Auth`, `Kyc`, `Main`, `AccountBlocked`, or another compliance-required flow using authenticated server state.
