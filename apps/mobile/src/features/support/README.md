# Vanta Mobile Support

The Support feature presents server-provided help topics, official contact channels and the authenticated player's own requests.

## Runtime rules

- Disconnected runtime is fail-closed and does not fabricate support channels or tickets.
- Ticket detail navigation carries only opaque `requestId`.
- The authenticated backend must verify ticket ownership before returning detail data.
- Request submit becomes available only when the backend advertises the capability.
- The client never treats a local submit as proof that a ticket exists.
- Do not submit passwords, OTPs, tokens, recovery codes, private keys, PAN/CVV or raw KYC media.
- Attachments are intentionally excluded from Phase 15.

## Storybook

Fixtures are visual-only and cannot create or mutate real support requests.
