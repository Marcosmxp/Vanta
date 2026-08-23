# Vanta Support Backend

This package defines privacy-minimized support read models and guarded request commands.

## Rules

- Support requests are authenticated and ownership-checked server-side.
- Request creation is idempotent and audit logged when handlers are enabled.
- The mobile client must never submit passwords, OTPs, access/refresh tokens, recovery codes, card PAN/CVV, private keys or raw KYC media as support content.
- Ticket identifiers are opaque. A request-details handler must verify the authenticated player owns the request to prevent IDOR.
- Support staff access must use least privilege and separate administrative authorization.
- Logs should contain correlation/request identifiers rather than message bodies whenever possible.
- Attachments are intentionally outside Phase 15; any future attachment pipeline needs malware scanning, MIME validation, size limits and protected storage.

## Phase 15 scope

No public support mutation endpoint is registered in this phase. The command contract exists so the mobile UI cannot become the authority for ticket creation or status.
