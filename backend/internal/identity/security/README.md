# Vanta Identity Security

## Purpose

This package defines server-authoritative read models and command contracts for authenticated session and strong-authentication controls.

Canonical session/step-up/device-security design: [`../../../../docs/security/session-device-security-roadmap.md`](../../../../docs/security/session-device-security-roadmap.md).

## Security boundaries

- Access tokens, refresh tokens, cookies, session secrets and cryptographic material never appear in read models.
- Raw IP addresses are not required by the mobile surface; only masked/minimized values may be projected.
- TOTP secrets, passkey private material and recovery codes are excluded from the security snapshot.
- Session revocation and future MFA enrollment are server-side commands and require authenticated player ownership checks.
- Revocation commands are idempotent.
- The current mobile route is not an authorization boundary.
- Redis may assist with revocation/cache propagation but cannot replace canonical session state and audit records.
- A local biometric app unlock must not be mistaken for server-side strong authentication.
- Sensitive future operations require a server-verifiable recent step-up event according to policy.

## Current state

Current runtime provides session listing/revocation foundations and authenticated ownership checks. Full MFA/passkey enrollment, step-up challenge verification and recovery remain future Phase 22 work and must not be represented as production-ready.

## Future integration

Before sensitive public mutation endpoints are opened, the identity/security domain must provide:
- authenticated session ownership;
- refresh-token rotation/revocation;
- audit logging;
- rate limiting;
- explicit idle/absolute session policy;
- strong-factor enrollment lifecycle;
- replay-resistant step-up authentication;
- secure account recovery;
- device-risk/attestation integration where required;
- security notifications for relevant high-risk events.

Routine app reopen should continue using the valid secure session rather than forcing repeated password login.
