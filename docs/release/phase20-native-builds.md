# Phase 20 — Native MVP Builds and Device Validation

**Status:** IN PROGRESS on `feat/phase20-native-builds`.

Phase 20 turns the integrated Vanta MVP into reproducible native Android/iOS development and preview artifacts. It does not authorize real-money operation and must not open any mutation surface that is still provider, regulatory or security blocked.

## Native baseline

- Expo SDK 57 / React Native 0.86 / React 19.2.3.
- Application name: `Vanta`.
- Android application ID: `com.marcosmxp.vanta`.
- iOS bundle identifier: `com.marcosmxp.vanta`.
- Native URL scheme: `vanta`.
- Native marketing version: `0.0.1`.
- Android versionCode: `1`.
- iOS buildNumber: `1`.
- Product milestone label remains **MVP v0.0.0.1**; the native store-facing version uses the platform-compatible three-component value `0.0.1`.

Expo SDK 57 currently targets Android API 36 / Android 7+ and iOS 16.4+; native builds should use the SDK-appropriate toolchain rather than pinning older platform targets locally.

## Build profiles

`apps/mobile/eas.json` defines:

| Profile | EAS environment | Vanta public environment | Android artifact | Purpose |
|---|---|---|---|---|
| `development` | `development` | `development` | APK | Internal development/runtime validation |
| `preview` | `preview` | `staging` | APK | Internal production-like validation |
| `production` | `production` | `production` | AAB default | Future store-oriented build only |

`EXPO_PUBLIC_VANTA_API_URL` is deliberately not committed in `eas.json`. It must be injected through the corresponding EAS environment or a local ignored `.env` file. `EXPO_PUBLIC_*` values are public build-time configuration and must never contain credentials or privileged secrets.

The mobile runtime already fails closed when the API URL is missing or when a staging/production URL does not use HTTPS.

## Android native CI

`.github/workflows/native-android.yml` performs a clean native generation and Android debug build on Phase 20 changes:

1. install the pinned Node/pnpm toolchain;
2. validate release configuration;
3. resolve Expo public configuration;
4. run a clean Android Expo Prebuild;
5. compile `:app:assembleDebug` with Java 17;
6. upload `app-debug.apk` as a short-lived GitHub Actions artifact.

The CI development artifact uses `http://10.0.2.2:8080`, which is an Android-emulator development address only. It is not a staging or production endpoint and must not be reused for a production-like build.

## EAS environment setup required before remote builds

Create the following public variables in the relevant EAS environments:

```text
development:
  EXPO_PUBLIC_VANTA_API_URL=<reachable development API URL>

preview:
  EXPO_PUBLIC_VANTA_API_URL=<HTTPS staging API URL>

production:
  EXPO_PUBLIC_VANTA_API_URL=<HTTPS production API URL>
```

The values are not secrets, but the build/environment separation is security-sensitive. Database URLs, Redis URLs, PII keys, provider credentials, signing private keys and backend session secrets must never use `EXPO_PUBLIC_*`.

## Build commands

From `apps/mobile`:

```bash
# Validate Expo configuration
pnpm exec expo config --type public

# Generate native projects locally when needed
pnpm exec expo prebuild --clean

# EAS internal Android build
npx eas-cli@latest build --platform android --profile preview

# EAS internal iOS build (requires Apple signing/device setup as applicable)
npx eas-cli@latest build --platform ios --profile preview
```

EAS project linking and platform signing credentials are external account operations. They must not be fabricated or committed to source control.

## Security boundaries that remain closed

Phase 20 must preserve the Phase 19 posture. In particular, it must not enable:

- real-money Plinko placement or settlement;
- deposit/withdraw execution;
- payment-provider callbacks;
- production KYC document/liveness upload or callbacks;
- MFA enrollment or withdrawal step-up;
- fabricated licensing/operator state;
- client-side canonical wallet, settlement, KYC or Responsible Gaming decisions.

## Remaining Phase 20 work

- [x] native app identifiers and build numbers normalized;
- [x] native URL scheme defined;
- [x] development/preview/production build profiles defined;
- [x] source-controlled release-config validation added;
- [x] Android clean Prebuild + debug APK CI added;
- [ ] validate the first Android workflow run and inspect the artifact;
- [ ] add/approve final Vanta icon, Android adaptive icon and splash assets;
- [ ] validate SecureStore/Reanimated/Worklets/Skia on installed Android runtime;
- [ ] run the full device smoke-test checklist;
- [ ] link the Expo/EAS project and configure public environment values;
- [ ] create a preview Android EAS artifact;
- [ ] validate iOS Prebuild/native configuration;
- [ ] produce an iOS simulator/development/preview artifact where Apple signing constraints permit;
- [ ] inspect native artifacts/logging for sensitive data;
- [ ] publish MVP release notes and final Phase 20 evidence;
- [ ] update canonical roadmap/context and mark Phase 20 complete only after exit criteria pass.

## Exit rule

A generated APK alone does not complete Phase 20. Completion requires native runtime validation, security checks, documentation, and explicit evidence that all regulated mutation surfaces remain blocked.
