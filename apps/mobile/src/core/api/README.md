# Mobile API transport

This module is the only low-level HTTP transport for Vanta mobile runtime calls.

- `EXPO_PUBLIC_VANTA_API_URL` is public configuration only.
- Non-development builds require HTTPS.
- Bearer credentials are supplied only by `SessionProvider` and are never logged or placed in navigation state.
- JSON error responses preserve the safe public `requestId` for support correlation.
- `204` is treated as a successful command with no local state mutation; callers refetch authoritative read models.
- Protected requests may perform one coordinated refresh/retry through `SessionProvider`.
- Financial, KYC and betting operations remain unavailable when the server does not expose a safe endpoint.
