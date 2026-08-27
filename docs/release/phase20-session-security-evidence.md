# Phase 20 — Physical Session Security Evidence

**Status:** IN PROGRESS  
**Scope:** `AUTH-REFRESH-001`, `AUTH-REVOCATION-002`  
**Environment:** local development runtime + physical Android device only

## Objective

Produce reproducible evidence that the physical Android app:

1. silently rotates an expiring access/refresh session without visible re-login; and
2. fails closed after the same device session is revoked remotely.

The evidence procedure must not print, persist or commit access tokens, refresh tokens, token hashes or passwords.

## Existing behavior under test

The mobile session layer refreshes before a protected request when the access token is within the 30-second refresh window, retries once after a 401, and clears the local session when refresh is rejected with 401.

The backend rotates both access and refresh tokens with a refresh-generation compare-and-swap. Refresh mismatch/reuse/race and revoked/expired sessions fail closed.

Remote session revocation is exposed through the authenticated security API.

## Controlled short-TTL runtime

Normal development defaults remain:

```text
access token: 15m
refresh token: 30d / 720h
```

For physical refresh testing only, start a new local runtime with a one-minute access TTL:

```powershell
.\scripts\start-physical-device-dev.ps1 -LanIp <YOUR_LAN_IP> -AccessTokenTtl 1m
```

Then sign in again on Android. Existing sessions retain the expiry timestamps they were originally issued with, so a new login is required after changing the TTL.

After the test, return to the normal development default by starting the launcher without the override or with `-AccessTokenTtl 15m`.

## AUTH-REFRESH-001 — Silent refresh

**Status:** DONE

With the short-TTL runtime active and the physical Android app signed in:

```powershell
.\scripts\observe-physical-session-refresh.ps1
```

The script:

- selects an active Android session from local PostgreSQL;
- reads only session id, refresh generation and timestamps;
- masks the session id in terminal output;
- never queries token values or token hashes;
- waits until the mobile 30-second refresh window opens;
- asks the tester to open/refresh a protected screen;
- passes only if `refresh_generation` increases and `access_expires_at` advances.

Recommended protected screens:

```text
Wallet
Profile
Security
```

### Acceptance

- physical app remains authenticated;
- protected request succeeds;
- `refresh_generation` increases;
- access expiry advances;
- no token/credential appears in terminal/log evidence.

### Physical evidence — 2026-08-26/27

Environment/evidence metadata:

```text
Device: physical Android handset (model not recorded)
Android version: not recorded
Vanta release: 0.1.0-alpha.1
Android versionCode: 2
Source commit under test: 26a0288495f57d89c65d6d1d8e0b629cc14646fc
LAN/API target: 192.168.1.70:8080
Access TTL: 1m
Refresh TTL: 720h
Session id (masked): session_...37f2
```

Three consecutive rotations were observed on the same physical Android session:

```text
Run 1
Generation:           1 -> 2
Access expiry before: 2026-08-26 23:37:32Z
Access expiry after:  2026-08-26 23:38:22Z
Last seen UTC:         2026-08-26 23:37:22Z
Result:                PASS

Run 2
Generation:           2 -> 3
Access expiry before: 2026-08-26 23:38:22Z
Access expiry after:  2026-08-26 23:38:59Z
Last seen UTC:         2026-08-26 23:37:59Z
Result:                PASS

Run 3
Generation:           3 -> 4
Access expiry before: 2026-08-26 23:38:59Z
Access expiry after:  2026-08-26 23:40:04Z
Last seen UTC:         2026-08-26 23:39:04Z
Result:                PASS
```

The tester explicitly confirmed after the successful runs that the physical Vanta app remained logged in and did not request visible re-authentication. This completes the physical silent-refresh acceptance criteria.

Final result: **PASS / DONE**.

## AUTH-REVOCATION-002 — Remote revocation

**Status:** TESTING

Keep the physical Android app signed in, then run:

```powershell
.\scripts\test-physical-session-revocation.ps1 -LanIp <YOUR_LAN_IP>
```

The script prompts interactively for the same account email/password, creates a temporary helper session, lists other active Android sessions, and revokes the chosen physical session through:

```text
DELETE /v1/security/sessions/{sessionID}
```

The password is entered as `SecureString`, plaintext exists only transiently in process memory for the login request, and session tokens are never printed. The temporary helper session is logged out in `finally` where possible.

After the script confirms server-side status `revoked`, open a protected screen on the phone or restart the app so bootstrap must validate the persisted session.

### Acceptance

- security API returns HTTP 204 for the owned Android session;
- subsequent security snapshot reports that session as `revoked`;
- physical app cannot continue using the revoked access token;
- refresh is rejected;
- local session is cleared;
- app returns to authentication rather than leaving stale authorized UI.

### Physical evidence — 2026-08-26/27

The same Android session used for silent-refresh evidence was later observed as:

```text
Session id (masked): session_...37f2
Refresh generation: 4
Revoked at:          2026-08-26 23:46:20.250244Z
Revoke reason:       player-security-center
```

The temporary PowerShell helper session created by the revocation harness was independently observed as:

```text
Device label: Vanta PowerShell revocation probe
Platform:     windows
Created at:   2026-08-26 23:45:52.969190Z
Revoked at:   2026-08-26 23:46:20.311030Z
Reason:       player-logout
```

The helper logout occurred about 61 ms after the Android session was marked `player-security-center`. This matches the harness control flow: helper login -> targeted `DELETE /v1/security/sessions/{sessionID}` -> verification -> helper logout in `finally`.

After the targeted Android revocation, the tester closed/reopened Vanta and the physical app returned to the introduction/authentication flow instead of restoring stale authenticated state. This confirms the physical fail-closed behavior after remote revocation.

A temporary suspicion that process close itself caused session loss was rejected: the database shows the Android session had already been deliberately revoked by the security-center endpoint before the app was reopened.

### Remaining evidence for final closure

The database and physical behavior establish targeted revocation plus fail-closed client behavior. Final `Done` status still requires retained terminal evidence from the harness (or one controlled rerun) showing both:

```text
HTTP 204 for the targeted revocation
Authenticated /v1/security snapshot reports target status = revoked
```

No token values, token hashes or passwords are required for that evidence.

## Evidence record

```text
AUTH-REFRESH-001
Technical rotation evidence: PASS (3 consecutive rotations recorded above)
Physical no-visible-relogin confirmation: YES
Final result: PASS / DONE

AUTH-REVOCATION-002
Target session id (masked): session_...37f2
Database revoke reason: player-security-center
Physical returned to authentication: YES
Harness/helper correlation: YES
API revocation 204 retained in terminal evidence: PENDING
Security snapshot revoked retained in terminal evidence: PENDING
Physical result: PASS
Final status: TESTING
```

## Safety / cleanup

- never paste token values into this file;
- never commit account passwords or runtime secrets;
- restore normal access TTL after the controlled refresh test;
- keep PostgreSQL/Redis loopback-only as defined by the development Compose model;
- do not use these development scripts against staging/production.
