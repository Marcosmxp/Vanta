# Phase 20 — Native Device Smoke Test

Use this checklist only with development or preview environments.

## Build evidence

- [ ] Record commit SHA, platform, device/emulator, OS version and build number.
- [ ] Record the build profile and API environment used.

## Session flow

- [ ] Fresh install starts without a native crash.
- [ ] Registration and login work against the configured backend.
- [ ] Invalid credentials fail safely.
- [ ] Session persists after app restart using SecureStore.
- [ ] Access-token refresh works once and refresh rotation remains coordinated.
- [ ] Logout clears the local session and revokes it remotely.
- [ ] Expired/revoked sessions return to reauthentication.

## Root states

- [ ] Maintenance is controlled by server state.
- [ ] AccountBlocked cannot be bypassed through navigation.
- [ ] Offline/error states remain fail-closed for sensitive actions.
- [ ] Background/foreground transitions preserve correct session state.

## Integrated features

- [ ] Home.
- [ ] Wallet.
- [ ] Bet History / Details.
- [ ] Profile.
- [ ] Security Center.
- [ ] Responsible Gaming.
- [ ] Support.
- [ ] Legal / Privacy / Regulatory information.
- [ ] KYC status.

## Plinko rendering

- [ ] Skia initializes without runtime errors.
- [ ] Reanimated/Worklets initialize correctly.
- [ ] Board layout is correct on target screen sizes.
- [ ] Authoritative-result animation is smooth.
- [ ] Real-money wager placement remains unavailable.

## Native UX

- [ ] Safe areas render correctly.
- [ ] Keyboard does not cover critical form controls.
- [ ] Back navigation cannot bypass protected root states.
- [ ] Common accessibility font scaling remains usable.

## Artifact/config review

- [ ] Sensitive session values do not appear in application logs.
- [ ] Backend-only configuration is not present in the mobile bundle.
- [ ] Preview/production API configuration requires HTTPS.
- [ ] Production profile does not enable debug-only behavior.
- [ ] Blocked payment, production KYC and real-money game operations remain blocked.

## Sign-off

Phase 20 is complete only after the native build, runtime checks, configuration review and documentation all pass. Record failures in the Phase 20 pull request with the affected commit/build artifact.
