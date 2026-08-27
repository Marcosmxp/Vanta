# Phase 20 — Physical Session Security Evidence

**Status:** DONE  
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

For physical refresh testing only, a one-minute access TTL was used. The runtime was subsequently returned to the normal 15-minute development access TTL before the final remote-revocation run.

## AUTH-REFRESH-001 — Silent refresh

**Status:** DONE

### Acceptance

- physical app remains authenticated;
- protected request succeeds;
- `refresh_generation` increases;
- access expiry advances;
- no token/credential appears in terminal/log evidence.

### Physical evidence — 2026-08-26/27

```text
Vanta release:        0.1.0-alpha.1
Android versionCode:  2
LAN/API target:       192.168.1.70:8080
Access TTL:           1m
Refresh TTL:          720h
Session id (masked):  session_...37f2
```

Three consecutive rotations were observed on the same physical Android session:

```text
Run 1
Generation:           1 -> 2
Access expiry before: 2026-08-26 23:37:32Z
Access expiry after:  2026-08-26 23:38:22Z
Last seen UTC:        2026-08-26 23:37:22Z
Result:               PASS

Run 2
Generation:           2 -> 3
Access expiry before: 2026-08-26 23:38:22Z
Access expiry after:  2026-08-26 23:38:59Z
Last seen UTC:        2026-08-26 23:37:59Z
Result:               PASS

Run 3
Generation:           3 -> 4
Access expiry before: 2026-08-26 23:38:59Z
Access expiry after:  2026-08-26 23:40:04Z
Last seen UTC:        2026-08-26 23:39:04Z
Result:               PASS
```

The tester explicitly confirmed that the physical Vanta app remained logged in and did not request visible re-authentication during the successful rotations.

Final result: **PASS / DONE**.

## AUTH-REVOCATION-002 — Remote revocation

**Status:** DONE

The controlled harness creates a temporary helper session, targets an active Android session through:

```text
DELETE /v1/security/sessions/{sessionID}
```

and only prints `Server status: revoked` after both of these checks have succeeded:

1. the targeted DELETE returned HTTP 204; and
2. a subsequent authenticated `/v1/security` snapshot reported the selected session as `revoked`.

The helper password is entered as `SecureString`; tokens are kept only in process memory and are not printed.

### Earlier correlated run

The first Android session used for refresh evidence was later observed as:

```text
Session id (masked): session_...37f2
Refresh generation: 4
Revoked at:          2026-08-26 23:46:20.250244Z
Revoke reason:       player-security-center
```

The matching temporary helper session was observed as:

```text
Device label: Vanta PowerShell revocation probe
Platform:     windows
Created at:   2026-08-26 23:45:52.969190Z
Revoked at:   2026-08-26 23:46:20.311030Z
Reason:       player-logout
```

The helper logout occurred about 61 ms after the Android revocation, matching the harness control flow: helper login -> targeted security-center DELETE -> verification -> helper logout in `finally`.

A temporary suspicion that closing the Android process itself caused session loss was rejected because the database showed that the Android session had already been deliberately revoked by the security-center endpoint.

### Final controlled rerun — 2026-08-27

The tester signed in again under the normal development TTL and executed the revocation harness against the fresh physical Android session.

Retained terminal output included:

```text
Session: session_...65a7
Server status: revoked
```

Because the harness reaches these lines only after validating the HTTP 204 response and the authenticated post-revocation security snapshot, the server-side acceptance criteria are satisfied for `session_...65a7`.

Physical-device behavior after revocation:

1. the tester opened the Profile area;
2. closed Vanta from Android recent apps;
3. reopened Vanta;
4. Vanta did not restore authenticated access;
5. Vanta displayed the security state `Sessão expirada` / `Reauthentication required` with a `Voltar a autenticar` action;
6. the tester selected `Voltar a autenticar`;
7. Vanta returned to the introduction/authentication flow and did not grant access to protected content.

This completes the physical fail-closed acceptance criteria for remote revocation.

### Acceptance status

```text
Target session id (masked):            session_...65a7
API targeted revocation HTTP 204:      YES (validated by successful harness completion)
Security snapshot reports revoked:     YES (validated by successful harness completion)
Server status printed as revoked:      YES
Stale authenticated UI restored:       NO
Security re-authentication gate shown: YES
Returned to introduction/auth flow:    YES
Physical result:                       PASS
Final status:                          DONE
```

## Final result

Both physical session-security gates in this evidence scope are complete:

```text
AUTH-REFRESH-001:    PASS / DONE
AUTH-REVOCATION-002: PASS / DONE
```

## Safety / cleanup

- never paste token values into this file;
- never commit account passwords or runtime secrets;
- normal development access TTL is 15m after the controlled refresh test;
- keep PostgreSQL/Redis loopback-only as defined by the development Compose model;
- do not use these development scripts against staging/production.
