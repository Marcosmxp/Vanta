# Phase 20 — Native Device Smoke Test

Use this checklist only with development or preview environments.

**Checkpoint:** 2026-08-25 physical Android test.  
**Legend:** `[x]` validated, `[ ]` pending, `[-]` deliberately unavailable/not applicable yet.

---

## Build evidence

- [x] Android physical-device debug APK exists and installs.
- [x] Active test branch is `feat/phase20-native-builds`.
- [x] API/Metro development environment recorded.
- [ ] Final controlled app version/build/commit metadata displayed inside the app.
- [ ] Final release artifact provenance recorded under new version governance.

## Session flow

- [x] Fresh installed Android debug APK can start without a native crash once Metro is correctly configured.
- [x] Registration works against configured backend.
- [x] Login works.
- [x] Invalid credentials fail safely.
- [x] Logout followed by a new login works.
- [ ] Session persists after a **force-close/reopen** using SecureStore.
- [ ] Background/minimize → foreground preserves authenticated experience over repeated tests.
- [ ] Access-token expiry triggers silent refresh on physical device.
- [ ] Refresh rotation remains coordinated on physical runtime.
- [ ] Logout remote revocation is explicitly verified.
- [ ] Expired/revoked session returns to authentication.
- [ ] Stale login error message is cleared after a later successful attempt.

## Root states

- [ ] Maintenance is validated as server-controlled.
- [ ] AccountBlocked cannot be bypassed through navigation.
- [ ] Offline/error states remain fail-closed for sensitive actions.
- [ ] Background/foreground transitions preserve correct root/session state.

## Integrated features

### Confirmed rendering/integration

- [x] Onboarding.
- [x] Home.
- [x] Wallet balance.
- [x] Empty Wallet transaction state.
- [x] Profile.
- [x] KYC/account status.
- [x] Deposit presentation.
- [x] Plinko protected-mode screen.

### Pending full interaction pass

- [ ] Bet History / Details.
- [ ] Security Center.
- [ ] Responsible Gaming.
- [ ] Support.
- [ ] Legal / Privacy / Regulatory information.
- [ ] Withdrawal presentation.
- [ ] Transaction detail route when a real read-model transaction exists.

## Wallet regression

Previously observed:

```text
Cannot read property 'length' of null
```

Cause:
- API serialized a nil Go slice as `transactions: null`.

Current expected result:
- API/provider/UI normalize empty transactions;
- wallet renders `Sem movimentos`;
- no render crash.

- [x] Fixed behavior observed on Android.
- [ ] Add/confirm automated regression coverage for null/empty transaction payloads.

## Authentication UX regression

Previously observed:
- invalid password message;
- later successful authentication;
- stale invalid-credential copy could remain visible during/around transition.

- [ ] Clear old error state on field edit/new attempt/success.
- [ ] Add regression coverage where practical.

This is a UI-state issue; successful authentication was confirmed.

## Plinko rendering

- [x] Skia board renders on physical Android.
- [x] Protected/unavailable production-action state renders.
- [-] Production game placement intentionally unavailable.
- [ ] Reanimated/Worklets authoritative-result animation validated with a safe test result path if one is provided.
- [ ] Frame behavior/performance recorded on representative Android screen sizes.
- [ ] Reduced-motion behavior defined.

## Deposit/withdraw boundary

- [x] Deposit screen can open.
- [x] No authorized payment method is falsely presented.
- [x] Production payment commit remains blocked.
- [-] Production provider deposit unavailable by design.
- [-] Production withdrawal unavailable by design.

Do not unblock these for smoke-testing convenience.

## Native UX

- [x] Main safe-area/tab layout is usable on tested Android device.
- [x] Home/Wallet/Profile/Plinko can render within current physical-device viewport.
- [ ] Keyboard does not cover critical controls across auth/payment forms.
- [ ] Back navigation cannot bypass protected root states.
- [ ] Accessibility font scaling remains usable.
- [ ] Bottom navigation uses final icons.
- [ ] Bottom navigation/screen transitions are animated consistently.
- [ ] Reduce Motion is respected.
- [ ] Final custom native splash is installed.
- [ ] Generic/stretched Expo-looking launch presentation is removed.
- [ ] Short Vanta launch transition is validated.

## Player-facing copy

- [ ] Remove engineering/debug explanations from ordinary player UI.
- [ ] Replace `ledger`, `read-only projection`, `settlement`, component-level explanations with plain user language.
- [ ] Preserve legally required disclosures at appropriate decision points.
- [ ] Review Portuguese copy for consistency and accessibility.

## Legal Center

- [ ] Terms and Conditions route/document.
- [ ] Privacy Policy.
- [ ] Responsible Gaming information.
- [ ] KYC/identity information.
- [ ] Deposit/withdrawal policy.
- [ ] Game rules.
- [ ] Promotions/bonus rules if applicable.
- [ ] Account closure.
- [ ] Time-out/self-exclusion.
- [ ] Complaints/dispute resolution.
- [ ] 18+/minors information.
- [ ] Operator/regulator/license details shown only when verified.

## Artifact/config review

- [ ] Sensitive session values absent from application logs.
- [ ] Backend-only configuration absent from mobile bundle.
- [x] Preview/production runtime configuration rejects plaintext HTTP by design.
- [ ] Production profile does not enable debug-only behavior.
- [x] Payment/KYC/production game operations remain blocked in current test state.
- [ ] APK inspection completed for embedded secrets/debug metadata.
- [ ] Dependency graph/release build uses controlled lockfile strategy.

## iOS

No physical iPhone is currently available.

- [ ] iOS Prebuild/native configuration validates.
- [ ] macOS CI/simulator path validates.
- [ ] signing/account requirements documented.
- [ ] iOS preview/dev artifact produced where possible.
- [ ] physical iOS device validation performed later.

Do **not** mark physical iOS as complete without a real device.

## Sign-off

Phase 20 is complete only after native runtime checks, session persistence/refresh checks, configuration/artifact review, final launch/native UX, version/release traceability, documentation and required security gates.

Failures and fixes belong in [`phase20-troubleshooting-and-findings.md`](./phase20-troubleshooting-and-findings.md).
