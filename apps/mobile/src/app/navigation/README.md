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

### Main stack

- `Tabs` — the main bottom-tab application shell.
- `BetHistory` — read-only list of authenticated-player bets.
- `BetDetails` — read-only detail route receiving only an opaque `betId`.
- `WalletTransactionDetails` — read-only financial detail route receiving only an opaque `transactionId`.
- `Deposit` — guarded deposit-intent UX.
- `Withdrawal` — guarded withdrawal-intent UX.
- `SecurityCenter` — session/device and strong-authentication overview.
- `SecuritySessionDetails` — security detail route receiving only an opaque `sessionId`.
- `ResponsibleGaming` — Phase 14 navigation boundary.
- `Support` — Phase 15 navigation boundary.
- `Legal` — Phase 15 legal/privacy navigation boundary.

Betting history, wallet details, payment flows, security screens and profile destinations sit above the tab navigator so they can be opened from authenticated surfaces without becoming permanent tabs.

### Main tabs

- `Home`
- `Play` — emphasized primary action.
- `Wallet`
- `Profile` — privacy-minimized account overview and entry point for account-control surfaces.

The custom tab bar is backed by the Vanta `BottomNavigation` design-system component.

## Security boundaries

Navigation never decides whether a player is authenticated, eligible, funded, KYC-approved, allowed to wager, allowed to deposit, allowed to withdraw, or authorized to mutate account security. Those decisions come from trusted application/backend state and server-authoritative APIs.

Route visibility is not authorization. Sensitive backend operations must continue to validate authentication, authorization, account state, KYC/AML, jurisdiction, responsible-gaming limits, idempotency, payment state, session ownership, step-up authentication and financial invariants server-side.

Credentials, passwords, OTP values, raw KYC media, full legal identity data, tokens, cookies, session secrets, TOTP secrets, recovery codes, canonical balances, payment secrets, RNG state, payout rules, and settlement authority must never be stored in route parameters or navigation state.

Bet details carry only `betId`; wallet transaction details carry only `transactionId`; security-session details carry only `sessionId`. Deposit and withdrawal routes carry no financial record or authorization state. Profile destination routes carry no identity record or privilege state. Future handlers must perform authenticated ownership checks for every opaque identifier to prevent IDOR.

The authentication, KYC, payment, profile and security presentation layers validate or present UX state only. They do not mint sessions, approve KYC, alter account privileges, revoke sessions locally, mark MFA active locally, credit balances, authorize withdrawals, confirm provider settlement or grant access to protected backend operations.

## Entry and future coordination

The root navigator still starts at `Auth`. The trusted authentication/session coordinator will eventually decide among `Auth`, `Kyc`, `Main`, `AccountBlocked`, or another compliance-required flow using authenticated server state.
