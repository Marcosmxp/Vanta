# Phase 20 — Native MVP Builds and Device Validation

**Status:** IN PROGRESS on `feat/phase20-native-builds` / PR #24.  
**Last consolidated:** 2026-08-25.

Phase 20 turns the integrated Vanta MVP into reproducible native Android/iOS development and preview artifacts and validates native runtime behavior. It does **not** authorize production operation.

---

## Native baseline

- Expo SDK 57 / React Native 0.86 / React 19.2.3.
- Application name: `Vanta`.
- Android application ID: `com.marcosmxp.vanta`.
- iOS bundle identifier: `com.marcosmxp.vanta`.
- Native URL scheme: `vanta`.
- Current Expo marketing version: `0.0.1`.
- Android versionCode: `1`.
- iOS buildNumber: `1`.

Version fields are currently inconsistent with root/mobile package versions and historical milestone naming. This is explicit Phase 20 debt. See [`versioning-and-release-governance.md`](./versioning-and-release-governance.md).

---

## Build profiles

`apps/mobile/eas.json` defines development/preview/production profiles.

Rules:
- no production secrets committed to Git;
- API URL/environment injected explicitly;
- `EXPO_PUBLIC_*` values are public build-time configuration and cannot contain privileged secrets;
- staging/production API must use HTTPS;
- signing credentials remain outside source control.

---

## Android native CI — current shape

The current `.github/workflows/native-android.yml` intentionally produces **one Android artifact**:

```text
Job:
Android physical-device debug APK

Artifact:
vanta-android-physical-device-debug-apk
```

Pipeline:
1. checkout;
2. Node/pnpm/Java setup;
3. install workspace dependencies;
4. install Skia native binaries;
5. validate native release config;
6. resolve Expo public config;
7. clean Android prebuild;
8. `:app:assembleDebug`;
9. upload the APK.

The workflow currently embeds a development LAN API address for the current physical-device test artifact. This is temporary development configuration, not a portable staging/production strategy.

Do not add emulator + physical + release APK variants merely to increase artifact count. Additional artifacts require a concrete test/release purpose.

---

## Physical Android development runtime

The Windows development helper:

```powershell
.\scripts\start-physical-device-dev.ps1 -LanIp <LAN_IP>
```

does the following:
- ensures Docker/pnpm availability;
- opens Private/LocalSubnet firewall rules for API 8080 and Metro 8081 when elevated;
- binds only the development API to the selected LAN address;
- starts PostgreSQL/Redis/API through Compose;
- waits for `/health`;
- starts Metro in a separate PowerShell window.

Runtime:

```text
API:   http://<LAN_IP>:8080
Metro: http://<LAN_IP>:8081
```

PostgreSQL and Redis are not intended to be exposed to the phone/LAN.

Phone and workstation must be on the same trusted development network.

---

## Metro/dev-build caveat

Current repository start commands use `expo start --dev-client`, but `expo-dev-client` is not currently an explicit mobile dependency.

The installed Android debug APK was successfully connected by setting Android React Native Dev Settings:

```text
Debug server host & port for device:
<LAN_IP>:8081
```

QR/deep-link behavior should not be treated as canonical until the dev-build approach is deliberately normalized.

Do not require Expo Go or ADB for the current Wi-Fi path.

---

## Android validation completed so far

Validated on a physical Android device:
- APK starts and loads the JS bundle;
- onboarding renders;
- account registration;
- login;
- authenticated Home;
- Profile;
- server-backed KYC/account state;
- Wallet after empty-transaction fix;
- Deposit presentation;
- Plinko rendering in protected mode;
- logout and subsequent login.

Observed backend wallet state:
- available balance can render as zero from authoritative API;
- empty transaction list renders without crash.

Production payment/game execution remains blocked as designed.

---

## Issues discovered during Phase 20

See [`phase20-troubleshooting-and-findings.md`](./phase20-troubleshooting-and-findings.md) for detail.

Major findings:
- PostgreSQL 18 volume mount incompatibility;
- Windows Docker/WSL2 setup requirement;
- physical-device Metro/dev-client mismatch;
- Metro cache/runtime `EventEmitter` error;
- account password minimum mismatch;
- Wallet `transactions: null` crash;
- stale login-error UI;
- unnecessary multi-APK workflow iteration.

The Wallet crash and major runtime blockers above have known fixes. The stale login-error UI and full password-copy alignment remain open.

---

## Player-session expectations

Phase 20 must validate this UX:

```text
minimize app
→ return authenticated

force-close app
→ reopen
→ restore SecureStore session

expired access token
→ refresh silently

revoked/expired refresh
→ return to authentication
```

Requiring password login after a normal minimize/restart is a failure unless security policy intentionally revoked/expired the session.

High-risk actions will later use step-up authentication, not routine full re-login.

---

## Native UX/product polish added to Phase 20 scope

Before alpha-quality native experience is considered complete, validate/implement:

- final app icon;
- Android adaptive icon;
- custom Vanta native splash;
- removal of stretched/generic Expo-looking launch presentation;
- short Vanta branded app-entry transition;
- bottom-navigation icons;
- bottom-navigation/screen motion foundation;
- reduced-motion support;
- player-facing copy cleanup;
- About/version/build display;
- Legal Center completeness/navigation.

These changes do not open regulated production capabilities.

---

## iOS path

There is no local physical iPhone available for current testing.

Phase 20 iOS goal therefore is:
- validate Expo/iOS native configuration;
- build/compile through macOS CI/EAS as available;
- use simulator where appropriate;
- document Apple signing/account requirements;
- later validate via TestFlight/cloud/borrowed physical device.

Do not mark physical iOS validation as complete without actual device evidence.

---

## Security boundaries that remain closed

Phase 20 must not enable:
- production game placement/settlement;
- payment execution;
- provider callbacks;
- production KYC document/liveness upload/callbacks;
- fabricated KYC approval;
- fabricated licensing/operator state;
- production MFA/withdrawal step-up until implemented;
- client-side canonical wallet/game/RG decisions.

---

## Artifact/release security

Before Phase 20 closes:
- inspect APK/config/logs for tokens/secrets;
- verify backend-only configuration absent from bundle;
- verify HTTPS rule outside development;
- verify production profile does not enable dev behavior;
- normalize dependency/release provenance;
- document signing handling;
- identify exact app version/build/commit for artifacts.

Release governance:
- [`versioning-and-release-governance.md`](./versioning-and-release-governance.md).

---

## Remaining Phase 20 work

### Build/runtime
- [x] Android physical-device debug APK pipeline.
- [x] Physical Android can load Metro/API over LAN.
- [x] PostgreSQL/Redis/API local runtime healthy.
- [x] Native Skia board renders.
- [ ] normalize dev-client/debug-binary strategy.
- [ ] validate silent access-token refresh on physical runtime.
- [ ] validate force-close/reopen SecureStore session restoration.
- [ ] validate remote revocation evidence.

### Product/UX
- [ ] fix stale login-error presentation.
- [ ] align all password helper/policy copy.
- [ ] replace technical player-facing copy.
- [ ] bottom-navigation icons.
- [ ] navigation/motion design-system foundation.
- [ ] final app icon/adaptive icon.
- [ ] final native splash/launch animation.
- [ ] About/version/build display.
- [ ] Legal Center content/navigation review.

### Security/release
- [ ] artifact secret/log inspection.
- [ ] normalize versioning source and build provenance.
- [ ] move release dependency installation toward locked/frozen graph.
- [ ] final Phase 20 CI/security evidence.

### iOS
- [ ] iOS Prebuild/config validation.
- [ ] macOS CI/simulator/build path.
- [ ] Apple signing/account steps documented.
- [ ] physical iOS validation when device access exists.

---

## Exit rule

A generated APK alone does not complete Phase 20.

Completion requires:
1. stable Android native runtime;
2. documented iOS build path;
3. persistent/silent session behavior validated;
4. no critical native crashes;
5. core integrated screens validated;
6. artifact/config security review;
7. version/release traceability;
8. native branding/launch UX no longer generic/broken;
9. documentation current;
10. regulated production capabilities still blocked.

Do not merge PR #24 until these exit conditions are satisfied or any explicit external iOS/account blocker is documented and accepted.
