# Vanta Mobile Profile

## Purpose

The Profile feature presents a privacy-minimized, read-only projection of the authenticated player's account state.

## Runtime rules

- The runtime does not fabricate identity, verification or preference data.
- The disconnected provider returns `unavailable` and omits personal data.
- The profile screen displays masked contact values only.
- Full legal name, document number, document images, address, raw phone, raw email and KYC media do not belong to this read model.
- KYC, age verification and account status remain server-authoritative.
- Persistent preference changes require authenticated backend commands in a later integration phase.
- Sign-out remains disabled until the session coordinator can revoke server-side refresh/session state.

## Navigation

Profile exposes implemented entry points to:

- Security Center
- Responsible Gaming
- Support
- Legal and Privacy

Each destination owns its own server-authoritative or versioned contracts. Route availability does not grant security, financial, compliance, support-record or licensing authority to the client.
