# Vanta Payments Boundary

Phase 11 defines payment intent contracts and a tokenized external gateway interface. It intentionally does not register deposit or withdrawal HTTP endpoints.

## Required execution order

A future authenticated payment command must enforce, server-side:

1. authenticated player and wallet ownership;
2. account state and jurisdiction eligibility;
3. KYC/AML requirements;
4. responsible-gaming and configured financial limits;
5. request validation and an idempotency key;
6. durable payment-intent creation;
7. provider interaction through a server-side `Gateway` adapter;
8. authoritative ledger posting only after the correct provider state;
9. reconciliation and retry handling;
10. auditable status transitions and redacted logging.

## Sensitive data

The Vanta application must prefer provider-tokenized payment method references. PAN, CVV, private provider credentials and raw bank authentication secrets must not be written to application logs, navigation state, Redis or the mobile bundle.

## Financial truth

Payment-provider status does not itself replace the ledger. Wallet balances remain derived from durable PostgreSQL financial records. Redis may support transient coordination but is never the source of truth.

## Idempotency

`CreateIntentCommand` requires an idempotency key. The future application service must scope and persist idempotency results so retries cannot create duplicate deposits, withdrawals or ledger entries.
