# Vanta — Versioning and Release Governance

**Status:** approved governance direction; implementation normalization is part of active Phase 20 work.  
**Last consolidated:** 2026-08-25.

## 1. Why this exists

Vanta needs an exact answer to:
- which source produced an APK/IPA;
- which build a tester is running;
- which changes belong to a release;
- whether a bug belongs to an old or current artifact;
- how to update without random version names/commits.

Project phases are not application versions.

## 2. Current inconsistency

At this checkpoint:
- `apps/mobile/app.json` uses `version: 0.0.1`;
- Android `versionCode` is `1`;
- iOS `buildNumber` is `1`;
- root `package.json` uses `0.0.0`;
- `apps/mobile/package.json` uses `0.0.0`;
- historical planning refers to `MVP v0.0.0.1`.

These values must be normalized before the next controlled release line.

Do not rewrite old Git history solely to make historical version values look cleaner.

## 3. Product version format

Use Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

During pre-1.0 development, use prerelease identifiers:

```text
0.1.0-alpha.1
0.1.0-alpha.2
0.1.0-beta.1
0.1.0-rc.1
0.1.0
```

Interpretation:
- `MAJOR`: incompatible product/platform contract change after public stability;
- `MINOR`: meaningful compatible feature release;
- `PATCH`: compatible bug/security fixes;
- `alpha`: active internal development;
- `beta`: broader feature-complete testing;
- `rc`: release candidate.

Recommended next controlled baseline is the `0.1.x` alpha line rather than continuing ad-hoc four-component milestone labels. The exact first normalized tag/build must be created only when repository fields and CI are updated together.

## 4. Native build numbers

Product version and native build number are different.

Example:

```text
Vanta 0.1.0-alpha.3
Android versionCode: 17
iOS buildNumber: 17
```

Rules:
- Android `versionCode` always increases;
- iOS `buildNumber` always increases;
- a rebuild of the same marketing version still gets a new native build number;
- never reuse a build number after distribution.

## 5. Canonical version source

Planned structure:

```text
version.json
```

Example:

```json
{
  "version": "0.1.0-alpha.1",
  "channel": "alpha"
}
```

Release tooling should derive/synchronize:
- Expo marketing version;
- package metadata where relevant;
- Android versionCode;
- iOS buildNumber;
- release notes metadata.

Avoid manually editing the same version in several independent files.

## 6. Build provenance

Every internal/release artifact should be traceable to:

```text
APP_VERSION
BUILD_NUMBER
GIT_SHA
BUILD_DATE
BUILD_CHANNEL
ENVIRONMENT
PLATFORM
```

Development/About surfaces may show:

```text
Vanta 0.1.0-alpha.2
Build 8
Development
Commit abc1234
```

Public production UI may show only:

```text
Vanta 1.4.2 (387)
```

Do not expose secrets or internal infrastructure endpoints through build metadata.

## 7. Git tags and releases

Release tags:

```text
v0.1.0-alpha.1
v0.1.0-beta.1
v0.1.0-rc.1
v0.1.0
```

A tag must point to the exact commit used for that release.

GitHub Release entry should contain:
- version/tag;
- build numbers;
- channel;
- commit;
- supported platform/artifact;
- notable changes;
- security notes where appropriate;
- known limitations;
- migration/rollback information when needed.

Do not tag random development commits as releases.

## 8. Changelog

Maintain a release-oriented `CHANGELOG.md` when automated release tooling is introduced.

Suggested categories:

```text
Added
Changed
Fixed
Security
Deprecated
Removed
Known limitations
```

Example:

```text
## 0.1.0-alpha.2

### Fixed
- Prevent Wallet crash when API returns no transactions.
- Align account password minimum with backend policy.

### Changed
- Physical-device Android workflow now produces one debug APK.

### Known limitations
- Production payments remain disabled.
- Production KYC provider is not connected.
- iOS physical-device validation is pending.
```

## 9. Commit convention

Use Conventional Commits with an explicit useful scope:

```text
feat(wallet): add transaction history
fix(auth): clear stale login error
fix(wallet): normalize null transactions
feat(ui): animate bottom navigation
refactor(motion): centralize animation tokens
docs(strategy): consolidate product and business goals
test(wallet): cover empty transaction response
build(android): configure release metadata
chore(release): prepare v0.1.0-alpha.1
security(auth): harden refresh replay handling
```

Avoid `update`, `changes`, `fix stuff`, `new version`, `final` and unrelated changes in one commit.

Documentation checkpoint updates that intentionally touch several canonical documents may use one grouped commit because they represent one coherent context synchronization.

## 10. Branch convention

Use:

```text
feat/<scope>
fix/<scope>
security/<scope>
docs/<scope>
chore/<scope>
release/<version>
hotfix/<version-or-scope>
```

Examples:

```text
feat/animated-navigation
feat/legal-center
feat/game-math
fix/login-error-state
security/device-attestation
release/v0.1.0
hotfix/wallet-crash
```

Phase branches may remain useful for a bounded multi-part phase, but the branch name is not the software version.

## 11. Pull requests

A PR should state objective, user/security impact, changed boundaries, validation performed, release impact and known blockers.

Do not merge because “the APK opens”. Sensitive or regulated features require evidence appropriate to the boundary.

## 12. CI release rules

Before controlled release:
- dependency graph must be locked;
- use frozen lockfile installs;
- typecheck/tests/security scans pass;
- native build succeeds;
- public build config contains no secrets;
- correct environment/channel is verified;
- artifact metadata matches intended tag/commit.

Current CI still has places using `pnpm install --no-frozen-lockfile`. Before production release governance is considered complete, normalize and commit the lockfile, then use frozen installation in release gates.

## 13. Release channels

### Development
- developer/runtime testing;
- may use LAN HTTP;
- debug tools allowed;
- never distributed as production.

### Alpha
- internal/limited native testing;
- incomplete features allowed if explicitly blocked/labeled;
- exact build provenance required.

### Beta
- broader product testing;
- feature set substantially complete;
- production-like infrastructure where safe;
- no false regulatory readiness.

### Release Candidate
- candidate for public release;
- only known accepted non-blocking issues;
- production config/signing/security gates.

### Production
- store/user release;
- no debug endpoints;
- no dev HTTP;
- all jurisdiction/provider/legal gates satisfied.

## 14. Update policy

App updates should eventually support:
- minimum supported version;
- recommended version;
- forced update only for genuine security/compatibility reasons;
- maintenance message;
- staged rollout/rollback where platform/store support it.

## 15. Release checklist

Before creating a release:
- [ ] canonical version updated;
- [ ] native build number incremented;
- [ ] changelog/release notes prepared;
- [ ] branch/commit identified;
- [ ] CI/security green;
- [ ] Android artifact validated;
- [ ] iOS path validated as applicable;
- [ ] no secrets in artifact/config/logs;
- [ ] environment correct;
- [ ] known limitations documented;
- [ ] Git tag created;
- [ ] GitHub Release created;
- [ ] artifact/test evidence attached or referenced.

## 16. Current Phase 20 action

Before Phase 20 closes:
1. choose/create canonical version source;
2. normalize current `0.0.1` / `0.0.0` inconsistency;
3. introduce build provenance;
4. show app version/build in About/Profile;
5. document first controlled alpha release;
6. ensure Android artifact can be unambiguously identified;
7. define iOS build-number path even if physical iPhone validation remains pending.
