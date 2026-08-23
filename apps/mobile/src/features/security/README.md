# Vanta Mobile Security Center

## Purpose

The Security Center presents a privacy-minimized projection of authenticated sessions and strong-authentication state.

## Runtime rules

- The disconnected runtime is fail-closed and exposes no executable security mutation.
- The mobile client never stores or displays access tokens, refresh tokens, cookies, TOTP secrets, recovery codes or passkey private material.
- Only masked IP information may be shown.
- Session-detail navigation carries only `sessionId`; the record must be reloaded from the authenticated API.
- Revoking one session or all other sessions requires a server-authoritative, idempotent command.
- MFA enrollment is not considered active until the backend confirms completion.
- Current-session termination requires an explicit reauthentication/session-coordinator path and is not simulated locally.

## Storybook

Storybook fixtures are deterministic visual examples only. They do not represent authenticated runtime state and cannot mutate real sessions.
