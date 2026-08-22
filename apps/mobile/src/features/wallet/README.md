# Vanta Wallet

## Purpose

Phase 10 introduces the read-only wallet experience. The mobile client can present balances and transaction read models, but it is never the financial source of truth.

## Runtime behavior

Until an authenticated financial API is integrated, the application uses `disconnectedWalletSnapshot`:

- no fabricated balance;
- no fabricated transactions;
- deposits and withdrawals remain disabled;
- transaction details cannot be resolved locally.

Storybook fixtures exist only for visual supervision and are not imported by the runtime provider.

## Read models

The wallet UI consumes:

- available balance;
- reserved balance;
- total balance supplied by the backend;
- wallet availability;
- transaction ID;
- transaction kind/direction/status;
- amount and currency;
- timestamps;
- optional server reference IDs;
- optional balance-after value for audit display.

The client does not derive the canonical total balance, reconcile ledger entries, change transaction status, confirm payment completion, or calculate settlement.

## Navigation boundary

`WalletTransactionDetails` receives only an opaque `transactionId`. Full transaction objects are not placed in navigation state.

A future authenticated endpoint must verify that the requested transaction belongs to the authenticated player's wallet. The identifier is not authorization and IDOR protection is mandatory.

## Security requirements

- canonical balances come from the ledger/backend;
- Redis or mobile storage are never financial truth;
- financial writes require server-side authentication and authorization;
- deposits and withdrawals require idempotency;
- KYC, AML, responsible-gaming limits and jurisdiction checks remain server-side;
- logs and analytics must not contain credentials, payment secrets or unnecessary financial PII;
- client-side visibility controls are privacy UX only, not a security boundary.

## Next phase

Phase 11 will add Deposit and Withdraw UX plus provider interfaces. Production execution remains blocked until payment adapters, ledger transactions, idempotency, compliance and reconciliation exist end to end.
