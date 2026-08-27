# Changelog

All notable Vanta release changes are tracked here.

The format is inspired by Keep a Changelog and release identifiers follow the governance in `docs/release/versioning-and-release-governance.md`.

## [Unreleased]

### Added
- Player-facing localization for Home, Wallet, authentication and Plinko in Brazilian Portuguese, English and Spanish.
- Locale-aware currency formatting for player money surfaces.
- Bottom-navigation icons and subtle selection motion that respects the operating system Reduce Motion preference.

### Changed
- Home, Wallet, authentication and Plinko copy now prioritizes player actions and outcomes instead of backend/API implementation details.
- Brazilian Portuguese is the Portuguese product variant for the current mobile localization layer.
- Wallet transaction details now surface player-relevant references and movement information instead of internal wallet identifiers.

### Fixed
- Registration password helper now matches the enforced 12-character minimum.
- Login submission errors are cleared as credentials are edited, preventing stale invalid-credential copy from remaining after correction.

### Planned
- Final Vanta app icon, splash and launch identity.
- Dependency lockfile and frozen pnpm installs.
- iOS compile/simulator validation path.

## [0.1.0-alpha.1] - 2026-08-25

This is the first normalized Vanta release identity. It is an internal alpha baseline, not a regulated production release. The Git tag must only be created after the intended alpha artifact passes the Phase 20 release gates.

### Added
- Canonical root `version.json` for release identity.
- Release synchronization/validation tooling.
- Generated mobile release metadata derived from the canonical version source.
- Build provenance manifest containing version, build, Git SHA, date, environment and platform.
- Versioned Android debug artifact naming.
- Release/build identity visible in the Profile surface for testers.
- Release-oriented pull-request governance.

### Changed
- Workspace package versions normalized to `0.1.0-alpha.1`.
- Native marketing version normalized to `0.1.0`.
- Android `versionCode` and iOS `buildNumber` advanced to `2`.
- Android physical-device artifact now carries release/build/commit identity instead of a generic filename.

### Fixed
- Removed active version drift between `0.0.0` package metadata and `0.0.1` Expo metadata.
- Native configuration validation no longer hard-codes the historical `MVP v0.0.0.1` label.

### Security
- Release provenance is now explicit enough to identify which source commit produced an internal Android artifact.
- Release configuration validation remains fail-closed for unexpected bundle identifiers, package IDs or environment configuration.

### Known limitations
- `pnpm-lock.yaml` is not yet committed, so JavaScript dependency installs are not fully reproducible and CI must temporarily keep `--no-frozen-lockfile`.
- The current Android artifact is a development physical-device debug build and is not a production release.
- Final native branding/splash assets are still pending.
- iOS physical-device validation is pending.
- Production payments, KYC/AML provider integration, MFA/passkeys/device attestation and production wagering remain disabled or incomplete.
- No Vanta gambling/operator license is implied by this alpha release identity.
