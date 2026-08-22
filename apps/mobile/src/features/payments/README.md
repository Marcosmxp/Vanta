# Vanta Mobile Payments

Phase 11 introduces deposit and withdrawal UX without giving the mobile client financial authority.

## Runtime behavior

- Wallet actions can open `Deposit` and `Withdrawal` routes.
- The default `PaymentCapabilitySnapshot` is `disconnected`.
- Without authenticated backend capabilities, no payment method or limit is fabricated and confirmation remains disabled.
- Storybook contains deterministic fixtures for visual review only.

## Client responsibilities

The client may:

- collect a user-entered amount;
- select a server-authorized method identifier;
- display server-authorized limits;
- display payment-intent status returned by the backend.

The client must not:

- credit or debit a wallet;
- mark a payment successful locally;
- store PAN/CVV or raw banking credentials;
- bypass KYC/AML, responsible-gaming or jurisdiction controls;
- calculate canonical balances;
- treat navigation state as authorization.

## Provider contract

`PaymentProvider` is an application boundary. A future implementation will call authenticated Vanta APIs, never a payment provider directly from the mobile app with private credentials.

Payment execution requires server-side idempotency, ledger transactions, provider reconciliation, ownership checks and auditable state transitions.
