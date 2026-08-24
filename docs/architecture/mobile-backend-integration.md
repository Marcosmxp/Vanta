# Mobile ↔ Backend Integration

Phase 18 connects the React Native application to the executable Go API introduced in Phase 17.

## Trust model

The mobile application is an untrusted presentation client. It may collect user intent, render authoritative read models and request commands, but it is never the source of truth for identity, KYC, balances, betting results, payment settlement, responsible-gaming enforcement or session revocation.

## Session lifecycle

- Login and registration are performed by `/v1/auth/login` and `/v1/auth/register`.
- Access and refresh credentials are opaque values issued by the server.
- Credentials are stored only with `expo-secure-store` using device-only Keychain/Keystore accessibility.
- Access credentials are short-lived.
- Refresh rotation is single-flight on the client so concurrent requests cannot independently reuse an old refresh generation.
- A protected request that receives `401` may refresh once and retry with the newly issued access credential.
- Failed/expired refresh clears the local session and the authenticated query cache.
- Logout requests server-side session revocation and then clears device credentials. No token is stored in AsyncStorage, MMKV, React Navigation params, logs or analytics.

## Integrated API surfaces

Authenticated:

- Profile
- KYC status
- Wallet and wallet transaction projection
- Bet history and bet details
- Security sessions and revocation
- Responsible Gaming limits, time-out and self-exclusion
- Support requests

Public/versioned:

- Platform availability
- Legal, privacy and regulatory information

## Navigation coordinator

The root coordinator uses trusted server state before entering authenticated UI:

1. secure-session bootstrap;
2. platform availability check;
3. authenticated profile/account-status check;
4. blocked accounts remain outside `Main`;
5. maintenance is selected only from the backend status contract.

Route visibility is still not authorization. Every protected endpoint derives the player from the authenticated principal and performs its own ownership/policy checks.

## Idempotency

Mutating Responsible Gaming and Support commands use cryptographically random UUID-based idempotency keys generated for each user-confirmed command. The client never uses a static key and does not infer success without the server response/refetched snapshot.

## Deliberately disconnected operations

The following remain fail-closed because Phase 17 intentionally exposes no safe execution endpoint/provider boundary for them:

- real-money Plinko bet placement;
- deposit execution;
- withdrawal execution;
- MFA enrollment;
- KYC document/liveness upload;
- password recovery/reset and OTP verification.

The mobile UI must not simulate successful execution for these operations.

## Configuration

`EXPO_PUBLIC_VANTA_API_URL` is public binary configuration, not a secret. Non-development builds reject non-HTTPS API URLs. Database credentials, Redis credentials, encryption keys and provider secrets remain server-side only.
