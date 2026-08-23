# Vanta Mobile Responsible Gaming

The Responsible Gaming feature presents server-authoritative protection state and lets the player request stronger controls through authenticated backend commands.

## Runtime rules

- The disconnected runtime is fail-closed and exposes no fabricated limits, options or active protections.
- Deposit, loss, wager and session limits are projections of backend policy/state; the mobile app does not derive enforcement locally.
- Time-out and self-exclusion options come from the server as opaque policy option IDs.
- Limit increase timing is never calculated by the client. Any cooling-off/effective timestamp comes from the backend.
- The client must not offer early cancellation of time-out or self-exclusion.
- A successful button press is not proof that a restriction changed. The UI must reload the authoritative snapshot after the backend command completes.
- Betting/payment authorization continues to happen server-side even if this screen is not open.

## Privacy and security

No credentials, wallet secrets, KYC records, payment credentials or privileged enforcement state are stored in navigation params.

## Phase 14

The screens are wired against a provider boundary. Runtime mutations remain disabled until authenticated persistence, audit logging and cross-domain enforcement are integrated.
