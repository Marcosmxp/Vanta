# Phase 20 — Native MVP Builds and Device Validation

**Status:** IN PROGRESS on `feat/phase20-native-builds` / PR #24.  
**Last consolidated:** 2026-08-25.

Phase 20 turns the integrated Vanta MVP into traceable native Android/iOS development and preview artifacts and validates native runtime behavior. It does **not** authorize production operation.

---

## Native/release baseline

- Expo SDK 57 / React Native 0.86 / React 19.2.3.
- Application name: `Vanta`.
- Android application ID: `com.marcosmxp.vanta`.
- iOS bundle identifier: `com.marcosmxp.vanta`.
- Native URL scheme: `vanta`.
- Canonical source: root `version.json`.
- Current release identity: `0.1.0-alpha.1`.
- Native marketing version: `0.1.0`.
- Android `versionCode`: `2`.
- iOS `buildNumber`: `2`.
- Release channel: `alpha`.

The earlier active drift (`0.0.0` package metadata versus `0.0.1` Expo metadata) has been normalized. Historical `v0.0.0.1` references remain history only and are not a release scheme.

Use:

```text
pnpm release:sync
pnpm release:check
```

See [`versioning-and-release-governance.md`](./versioning-and-release-governance.md).

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

The current `.github/workflows/native-android.yml` intentionally produces **one Android artifact** for the physical-device development path.

Artifact identity is derived from canonical release metadata and Git SHA:

```text
vanta-<release>-build-<number>-android-physical-debug-<short-sha>
```

The uploaded artifact contains:
- a versioned installable APK;
- `build-metadata.json` with non-secret provenance;
- `IDENTITY.txt` with release/build/commit identity.

Pipeline:
1. checkout;
2. Node/pnpm/Java setup;
3. validate canonical version/release configuration;
4. install workspace dependencies;
5. install Skia native binaries;
6. resolve Expo public config;
7. clean Android prebuild;
8. `:app:assembleDebug`;
9. generate build provenance;
10. upload the versioned artifact bundle.

The workflow currently embeds a development LAN API address for the physical-device debug artifact. This is temporary development configuration, not a portable staging/production strategy.

Do not add emulator + physical + release APK variants merely to increase artifact count. Additional artifacts require a concrete test/release purpose.

---

## Dependency reproducibility status

The repository still lacks root `pnpm-lock.yaml`.

Therefore JavaScript installs are not yet fully reproducible and current workflows temporarily retain:

```text
pnpm install --no-frozen-lockfile
```

Required follow-up before controlled production release:
1. generate the lockfile with the pinned workspace/toolchain;
2. review/commit it;
3. change CI/native workflows to `--frozen-lockfile`;
4. treat lockfile changes as mandatory when dependency declarations change.

Do not fabricate the lockfile manually.

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
- unnecessary multi-APK workflow iteration;
- uncontrolled/inconsistent early release metadata.

The version-metadata inconsistency is now normalized through root `version.json`; dependency lockfile reproducibility remains open.

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

## Native UX/product polish in Phase 20 scope

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
- complete dependency lock/frozen install strategy;
- document signing handling;
- identify exact app version/build/commit for every distributed artifact;
- add in-app About/version/build presentation;
- create a release tag only after the intended artifact passes its gates.

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
- [x] canonical versioning source established.
- [x] active version declarations normalized.
- [x] Android artifact build provenance implemented.
- [x] changelog/PR release governance introduced.
- [ ] generate/commit `pnpm-lock.yaml`.
- [ ] switch JS installs to frozen-lockfile mode.
- [ ] final Phase 20 CI/security evidence.
- [ ] create first controlled alpha tag/GitHub Release after validation.

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
