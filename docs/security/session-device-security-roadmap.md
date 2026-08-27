# Vanta — Session, Step-Up and Device Security Roadmap

**Status:** canonical session/security design.  
**Last consolidated:** 2026-08-25 during Phase 20.  
**Scope:** mobile session persistence, token lifecycle, revocation, MFA/passkeys, step-up authentication, local app lock and device-risk signals.

This document separates **current implementation** from **target production policy**. Do not present planned controls as already implemented.

---

## 1. Product requirement

A player must **not** be forced to enter email/password again merely because Vanta was minimized, force-closed or reopened while the server session is still valid.

The intended routine experience is:

```text
first successful login
      ↓
secure session persisted on device
      ↓
minimize / close / reopen
      ↓
restore session silently
      ↓
refresh access credential when required
      ↓
continue to authenticated app
```

Reauthentication is required when:
- no valid session exists;
- refresh/session lifetime has expired;
- the server revoked the session;
- refresh replay/credential compromise is detected;
- account/security policy explicitly requires fresh authentication.

Sensitive commands may require **step-up authentication** without forcing full password login on every app open.

---

## 2. Current mobile implementation

Current code under `apps/mobile/src/core/session/` implements:
- `SecureStore` session persistence;
- bootstrap restoration on application start;
- session structure validation before use;
- proactive access refresh near expiry;
- single-flight refresh coordination so concurrent API calls do not independently rotate the same refresh token;
- retry with a newly refreshed access token after an authenticated `401` path;
- local clearing on expiry/logout;
- remote logout attempt before local session removal.

### Secure local storage

The current store key is versioned (`vanta.auth.session.v1`). The token pair is stored with:

```text
SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY
```

This deliberately avoids normal portable backup/restore behavior for the credential material.

Stored session fields include:
- access token;
- access expiry;
- refresh token;
- refresh expiry;
- session ID;
- player ID.

Malformed/invalid stored data is cleared instead of being trusted.

### Bootstrap behavior

On app startup:
1. load stored session;
2. if absent → anonymous;
3. if refresh expired → clear session;
4. if access token remains valid → authenticated;
5. if access is near expiry → refresh silently;
6. if refresh cannot be completed and a session still exists → unavailable/error handling rather than inventing authentication state.

The mobile client currently uses a 30-second access-refresh skew so a token is refreshed before it expires during a request.

### Single-flight refresh

Only one refresh promise may be active at a time inside the mobile session provider. Other callers reuse the same refresh operation.

This is important because the backend deliberately rotates refresh credentials and treats suspicious reuse/races fail-closed.

---

## 3. Current backend token policy

Current default configuration:

```text
Access token TTL:  15 minutes
Refresh token TTL: 30 days
```

Configuration currently permits:
- access TTL between 1 minute and 1 hour;
- refresh TTL between 1 hour and 90 days.

These values are configuration boundaries, not final regulatory policy.

### Current refresh behavior

Backend session state includes:
- access-token hash + expiry;
- refresh-token hash + expiry;
- refresh generation;
- session/player IDs;
- device label/platform;
- masked IP projection;
- MFA-used/trust fields for security read models;
- created/last-seen/revoked timestamps.

Phase 19 hardened refresh rotation with atomic compare-and-swap on expected token hash + generation. Reuse/mismatch is treated as compromise/replay and causes fail-closed session revocation.

---

## 4. Phase 20 session acceptance tests

These are required before Phase 20 is complete.

### S20-01 — Background/foreground

```text
login
→ minimize app
→ wait
→ foreground
→ user remains authenticated
```

Expected:
- no password prompt;
- no duplicate session creation;
- normal API access works;
- refresh occurs silently if required.

### S20-02 — Force-close/reopen

```text
login
→ force-close process
→ reopen Vanta
```

Expected:
- stored session is loaded from SecureStore;
- player reaches authenticated destination without login if refresh is valid;
- no token appears in visible logs/navigation.

### S20-03 — Access expiry

Allow/force access credential to expire while refresh remains valid.

Expected:
- refresh rotates silently;
- request succeeds with new access token;
- no visible login screen;
- new token pair replaces old SecureStore record atomically enough for normal client behavior.

### S20-04 — Refresh expiry

Expected:
- stored session is cleared;
- player is routed to authentication/session-expired UX;
- protected API calls do not continue using stale credentials.

### S20-05 — Server revocation

Revoke the session from Security Center/server.

Expected:
- future access/refresh fails;
- local session transitions to expired/anonymous according to route policy;
- no client-only mechanism can restore revoked authority.

### S20-06 — Logout

Expected:
- server revocation attempted;
- local secure storage always cleared;
- query/cache state cleared;
- if remote revocation cannot be confirmed, UI may report that fact without restoring the local session.

### S20-07 — Concurrent API requests near expiry

Expected:
- one refresh operation;
- no refresh-token race storm;
- requests reuse the newly issued access token.

---

## 5. Target production session policy

The final numbers are security/product policy and may vary by jurisdiction/risk tier. Current recommended baseline to evaluate:

```text
Access credential
  short-lived: ~15 minutes

Refresh idle window
  current default: 30 days

Absolute session lifetime
  target design: explicit server-side cap
  candidate planning ceiling: up to 90 days

Sensitive command strong-auth freshness
  short policy window (command/risk dependent)
```

### Important distinction

The current rotating refresh TTL can behave as a sliding lifetime. A true **absolute session lifetime** is a separate requirement and should be enforced against original session creation/security policy, not merely by limiting the next refresh token's TTL.

Before production, the session model should explicitly represent/enforce:
- idle lifetime;
- absolute lifetime;
- last strong-authentication time;
- authentication assurance/factor used;
- device/risk state;
- revocation reason;
- security-policy version if useful for audit.

---

## 6. Local app lock vs server session

A local biometric/PIN screen is **not the same thing as server authentication**.

Vanta may later protect the visible app after inactivity with Face ID/Touch ID/Android biometrics without destroying the underlying valid server session.

Desired separation:

```text
Server session valid
        │
        ├── app recently active → show app
        │
        └── local inactivity threshold reached
              → biometric/local unlock
              → same server session continues
```

If local biometric unlock fails/cannot be used, policy may require full server reauthentication depending on risk.

Do not store a reusable password or custom insecure local PIN substitute merely to implement this UX.

An inactivity threshold should remain configurable/product-tested rather than hard-coded prematurely. Financial/security screens may use stricter behavior than ordinary browsing.

---

## 7. Step-up authentication

### Definition

Step-up means an already authenticated player proves a stronger/recent factor before a high-risk operation.

It should produce a **server-verifiable authorization event**, not only a local boolean.

### Candidate operations requiring step-up

| Operation | Step-up expectation |
|---|---|
| Routine app reopen | No, if valid session exists |
| View Home/Profile/Wallet | Usually no |
| Change password | Yes |
| Change email/phone | Yes |
| Enroll/remove MFA/passkey | Yes |
| Disable strong factor | Strong step-up + recovery controls |
| Add/change withdrawal destination | Yes |
| Withdrawal | Yes, policy/risk dependent |
| High-value/high-risk withdrawal | Stronger/recent factor required |
| Revoke other sessions | Usually yes for high-risk context |
| Account closure/security-sensitive identity change | Yes |
| Administrative privilege operation | Separate stronger admin policy |

Final regulatory/provider requirements may be stricter.

### Step-up properties

A successful challenge should be:
- bound to the authenticated player/session;
- short-lived;
- scoped to an action/class of actions;
- one-time or replay-resistant where appropriate;
- audited;
- invalidated by relevant session/security events.

Do not send a generic permanent `mfa=true` client flag and trust it forever.

---

## 8. MFA/passkey strategy

### Preferred direction

Where platform/backend support permits, prioritize phishing-resistant authenticators such as passkeys for strong authentication.

Possible factor portfolio:
- passkey/platform authenticator;
- TOTP authenticator app as fallback/compatibility option;
- recovery mechanism designed separately;
- SMS only if a specific provider/regulatory/product requirement justifies its weaker security properties.

### Enrollment

Enrollment should require:
- an existing authenticated session;
- recent strong authentication as policy matures;
- server-generated challenge/enrollment state;
- confirmation before marking factor active;
- recovery path provisioning where appropriate;
- audit event/security notification.

### Factor removal/reset

Must be treated as a high-risk security event.

Requirements:
- strong reauthentication/recovery verification;
- cooldown/notification where appropriate;
- revocation or risk re-evaluation of existing sessions;
- no silent downgrade through a weak support flow.

---

## 9. Account recovery

Recovery is often more dangerous than login and must not become the easiest bypass.

Production recovery design must address:
- lost password;
- lost MFA device;
- lost passkey/device;
- changed phone/email;
- compromised email;
- stolen authenticated device;
- support/manual recovery.

Principles:
- do not reveal whether an account exists unnecessarily;
- recovery tokens are high-value credentials;
- short expiry and one-time use;
- rate limiting and abuse monitoring;
- security notifications;
- revoke/rotate sessions when compromise is plausible;
- manual recovery decisions are audited and least-privilege.

Support tickets must never accept passwords, OTPs, recovery codes or raw secret material as a normal recovery mechanism.

---

## 10. Device trust and attestation

Planned production signals:
- Google Play Integrity;
- Apple App Attest / DeviceCheck as appropriate;
- app/version/signature integrity;
- root/jailbreak indicators;
- emulator/device-farm signals;
- impossible device/session changes;
- suspicious velocity/location/device patterns.

### Policy rule

Device signals are **risk inputs**, not sole authorization truth.

A failed/missing attestation may trigger:
- stronger step-up;
- lower financial limits;
- additional review;
- blocked sensitive action when policy requires it.

Core API authorization, KYC, Responsible Gaming, ledger correctness and server RNG must remain secure even when device attestation is absent or bypassed.

---

## 11. Session/device risk events

The future risk model should consider events such as:
- new device;
- new country/region where legally meaningful;
- rapid IP/ASN changes;
- failed refresh replay;
- multiple credential failures;
- changed security factors;
- recovery event;
- high-value financial action;
- device-integrity anomaly;
- many simultaneous active sessions;
- previously revoked/suspicious device signal.

Risk outcomes can include:
- allow;
- allow + notify;
- require step-up;
- restrict a sensitive operation;
- revoke session(s);
- manual review.

Do not silently change game odds or outcomes as a fraud/security response.

---

## 12. Session revocation matrix

### Revoke current session
- explicit logout;
- refresh-token replay/mismatch;
- session expiry;
- detected compromise requiring fail-closed action.

### Revoke other/all sessions depending on policy
- password reset after suspected compromise;
- account recovery;
- MFA/passkey reset/removal;
- player chooses “log out all devices”;
- security team incident action;
- credential/key compromise affecting sessions.

### May preserve session with step-up instead
- ordinary password change initiated from a trusted strongly authenticated session, if policy permits;
- low-risk profile change.

The exact rule should be documented/tested rather than implemented inconsistently across endpoints.

---

## 13. Security Center target UX/read model

Player-facing Security Center may show:
- device label;
- platform;
- approximate/masked location/IP-derived context where privacy/legal policy permits;
- created/last-active time;
- current session marker;
- trust/security state in plain language;
- ability to revoke another owned session;
- ability to revoke all other sessions;
- MFA/passkey enrollment status;
- recent security events where useful.

Never expose:
- access/refresh tokens;
- raw token hashes;
- private keys;
- TOTP secret after enrollment;
- recovery codes except through their deliberate one-time recovery UX;
- full raw IP unless specifically justified.

---

## 14. Server/API requirements for Phase 22

Likely server capabilities:

```text
POST /auth/step-up/challenges
POST /auth/step-up/verify

GET  /security/factors
POST /security/passkeys/enroll/...
POST /security/totp/enroll/...
DELETE /security/factors/:id

GET  /security/sessions
DELETE /security/sessions/:id
POST /security/sessions/revoke-others

POST /auth/recovery/...
```

Exact API shape must be designed with replay/idempotency/CSRF-like mobile/API considerations and provider/platform capabilities. These examples are architectural placeholders, not implemented routes.

---

## 15. Audit requirements

Record security events such as:
- session created;
- refresh rotated;
- replay detected;
- session revoked + reason;
- login failure/success risk metadata;
- factor enrolled/removed;
- step-up challenge success/failure;
- recovery initiated/completed;
- device trust/attestation result summary;
- high-risk action allowed/denied;
- security notification delivery outcome where operationally relevant.

Avoid storing excessive raw device fingerprints or personal data without a defined fraud/security purpose and retention basis.

---

## 16. Tests required before sensitive production use

### Unit/integration
- session expiry boundaries;
- absolute lifetime;
- concurrent refresh;
- stolen/replayed refresh token;
- factor enrollment lifecycle;
- step-up replay/expiry/scope;
- cross-player session IDOR;
- recovery token replay;
- revocation propagation;
- password/factor change session policy;
- attestation failure policy.

### Mobile/native
- SecureStore survives process restart as intended;
- credentials do not appear in logs/screenshots/navigation state;
- biometric local lock does not create a second insecure credential store;
- revoked session cannot be restored from local cache;
- offline/unavailable state does not fabricate authenticated authority.

### Adversarial review
- API requests independent of official app;
- modified device/client;
- rapid concurrent operations;
- recovery/MFA downgrade attempts;
- stolen token scenario.

---

## 17. Current decisions vs open decisions

### Decided
- closing/minimizing Vanta must not cause routine login;
- SecureStore remains the sensitive mobile session store;
- access tokens are short-lived;
- refresh credentials rotate and are server-revocable;
- sensitive commands use step-up rather than universal repeated login;
- device attestation is defense-in-depth/risk input;
- client state is never financial/security authority.

### Still open for deliberate production decision
- exact absolute session lifetime;
- exact idle timeout by risk/jurisdiction;
- local biometric lock threshold;
- passkey/TOTP provider/library details;
- recovery policy and manual-review flow;
- SMS factor availability;
- exact high-value withdrawal thresholds;
- device-risk scoring thresholds;
- session revocation matrix after each security event.

Open decisions should be resolved before the relevant production phase, not guessed inside feature code.

---

## 18. References

- [`phase20-security-architecture.md`](./phase20-security-architecture.md)
- [`phase19-security-audit.md`](./phase19-security-audit.md)
- [`../ROADMAP.md`](../ROADMAP.md)
- `apps/mobile/src/core/session/SessionProvider.tsx`
- `apps/mobile/src/core/session/secureSessionStore.ts`
- `backend/internal/identity/auth/`
- `backend/internal/identity/security/`
