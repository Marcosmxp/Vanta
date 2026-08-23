# Vanta Identity Security

## Purpose

This package defines server-authoritative read models and command contracts for authenticated session and strong-authentication controls.

## Security boundaries

- Access tokens, refresh tokens, cookies, session secrets and cryptographic material never appear in read models.
- Raw IP addresses are not required by the mobile surface; only masked values may be projected.
- TOTP secrets, passkey private material and recovery codes are excluded from the security snapshot.
- Session revocation and MFA enrollment are server-side commands and require authenticated player ownership checks.
- Revocation commands are idempotent.
- The current mobile route is not an authorization boundary.
- Redis may assist with revocation/cache propagation but cannot replace canonical session state and audit records.

## Future integration

Before public mutation endpoints are registered, the identity module must provide authenticated session ownership, refresh-token rotation/revocation, audit logging, rate limiting and step-up authentication for sensitive changes.
