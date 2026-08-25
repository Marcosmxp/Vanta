# Vanta — Versioning, Releases and GitHub Governance

**Status:** canonical release-governance specification.  
**Last consolidated:** 2026-08-25.  
**Current normalized release identity:** `0.1.0-alpha.1`, native build `2`.

## 1. Purpose

Vanta must always be able to answer:
- which source commit produced an APK/IPA/AAB;
- which build a tester is running;
- which changes belong to a release;
- whether a bug belongs to an old or current artifact;
- which configuration/channel produced an artifact;
- how releases progress without random names or unrelated commits.

Project phases are project-management labels. They are **not** application versions.

## 2. Canonical version source

The source of truth is root [`version.json`](../../version.json):

```json
{
  "schemaVersion": 1,
  "version": "0.1.0",
  "channel": "alpha",
  "iteration": 1,
  "build": 2
}
```

Derived identities:

```text
Product/native marketing version: 0.1.0
Release/package identity:          0.1.0-alpha.1
Git tag when released:             v0.1.0-alpha.1
Android versionCode:               2
iOS buildNumber:                   2
```

Do not manually choose independent versions in `package.json`, `apps/mobile/package.json`, `apps/mobile/app.json` or the generated mobile release metadata module.

Use:

```bash
pnpm release:sync
pnpm release:check
```

`release:sync` derives repository declarations and the mobile metadata module from `version.json`; `release:check` fails when they drift.

## 3. Why native version and prerelease identity are separated

The release identity may contain prerelease labels such as:

```text
0.1.0-alpha.1
0.1.0-beta.1
0.1.0-rc.1
```

Native store-facing marketing versions remain numeric SemVer-shaped values such as:

```text
0.1.0
```

The channel/iteration lives in release metadata/tag/package identity rather than relying on prerelease text in native store version fields.

## 4. SemVer policy

Use:

```text
MAJOR.MINOR.PATCH
```

Channels:

```text
alpha  → active internal development
beta   → broader feature-complete testing
rc     → release candidate
stable → public stable line
```

Examples:

```text
0.1.0-alpha.1
0.1.0-alpha.2
0.1.0-beta.1
0.1.0-rc.1
0.1.0
```

Interpretation:
- `MAJOR`: incompatible public product/platform contract change after stability;
- `MINOR`: meaningful compatible feature release;
- `PATCH`: compatible bug/security fix;
- prerelease iteration: another build/release candidate on the same product version.

Do not revive historical four-component milestone labels such as `v0.0.0.1` as release versions.

## 5. Native build numbers

Product version and build number are independent.

Rules:
- Android `versionCode` always increases;
- iOS `buildNumber` always increases;
- rebuilding the same marketing version for distribution requires a new build number;
- never reuse a distributed build number;
- Android and iOS currently share the same canonical `build` integer unless a future platform-specific requirement justifies separation.

The first normalized Vanta alpha uses build `2` because build `1` already existed in the early Phase 20 native configuration.

## 6. Build provenance

Every distributed/internal artifact must be traceable to:

```text
APP / PRODUCT VERSION
RELEASE VERSION
BUILD NUMBER
GIT SHA
BUILD DATE
BUILD CHANNEL
ENVIRONMENT
PLATFORM
```

`scripts/write-build-metadata.mjs` writes a non-secret provenance manifest.

The Phase 20 Android workflow also renames the debug APK using the pattern:

```text
vanta-<release>-build-<number>-android-physical-debug-<short-sha>.apk
```

Example shape:

```text
vanta-0.1.0-alpha.1-build-2-android-physical-debug-a1b2c3d.apk
```

The uploaded artifact contains:
- the versioned APK;
- `build-metadata.json`;
- `IDENTITY.txt`.

Do not expose secrets, private endpoints, credentials or internal signing material through provenance metadata.

## 7. In-app version display

The mobile app now receives generated release metadata from the canonical version source and the Profile surface displays:

```text
Vanta 0.1.0-alpha.1
Build 2 · ALPHA
```

This is sufficient for Phase 20 tester identification without adding another independent version source.

A later dedicated About screen may additionally show environment and short Git SHA for non-production builds when those values are injected safely at build/runtime time.

Public stable UI may reduce this to:

```text
Vanta 1.4.2 (387)
```

## 8. Git tags and GitHub Releases

Allowed release tag shapes:

```text
v0.1.0-alpha.1
v0.1.0-beta.1
v0.1.0-rc.1
v0.1.0
```

Rules:
- a tag points to the exact release commit;
- do not tag arbitrary development commits;
- do not create the tag until intended CI/native validation has passed;
- a GitHub Release must identify version, build, channel, commit, supported platform/artifact, notable changes and known limitations;
- a production release additionally requires signing, store, security, regulatory and operational gates.

`0.1.0-alpha.1` is the normalized current identity. Its tag remains pending until the intended Phase 20 alpha artifact passes release gates.

## 9. CHANGELOG

Root `CHANGELOG.md` is release-oriented and uses categories such as:

```text
Added
Changed
Fixed
Security
Deprecated
Removed
Known limitations
```

Update the changelog when a change affects a distributed artifact, user-visible behavior, security posture, compatibility or a known limitation.

Do not use commit history as the only release notes.

## 10. Commit convention

Use Conventional Commits with explicit useful scopes:

```text
feat(wallet): add transaction history
fix(auth): clear stale login error
fix(wallet): normalize null transactions
feat(ui): animate bottom navigation
refactor(motion): centralize animation tokens
docs(strategy): consolidate product and business goals
test(wallet): cover empty transaction response
build(android): add native build provenance
chore(release): prepare v0.1.0-alpha.2
security(auth): harden refresh replay handling
```

Avoid:

```text
update
changes
fix stuff
new version
final
final2
```

One commit should represent one coherent concern. A grouped canonical-documentation synchronization is acceptable when its single purpose is one project checkpoint.

## 11. Branch convention

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
security/device-attestation
fix/login-error-state
release/v0.1.0
hotfix/wallet-crash
```

Phase branches remain acceptable for bounded multi-part work, but phase numbers never become software version numbers.

## 12. Pull-request governance

`.github/pull_request_template.md` requires every PR to capture:
- objective;
- product/user impact;
- security/financial/regulatory impact;
- release impact;
- validation evidence;
- known limitations/blockers;
- relevant references.

A PR is not complete because an APK opens.

Sensitive boundaries require evidence appropriate to the change: session tests, financial concurrency tests, game-math evidence, device testing, security scans, migrations, provider validation or regulatory review as applicable.

## 13. CI release rules

Current CI now validates version synchronization before dependency installation/build work.

Before controlled production release, all of the following are required:
- canonical version synchronized;
- dependency graph locked;
- frozen dependency installation;
- typecheck/tests/security scans green;
- native build successful;
- public build config contains no secrets;
- environment/channel verified;
- artifact metadata matches intended version/build/tag/commit;
- signing protected outside source control.

### Current reproducibility blocker

The repository still does **not** contain `pnpm-lock.yaml`.

Therefore CI currently must temporarily use:

```text
pnpm install --no-frozen-lockfile
```

This is not considered final release governance.

Required follow-up:
1. generate `pnpm-lock.yaml` with the pinned workspace/toolchain;
2. review and commit it;
3. replace `--no-frozen-lockfile` with `--frozen-lockfile` in CI/native release workflows;
4. require lockfile changes whenever JS dependency declarations change.

Do not fabricate a lockfile by hand.

## 14. GitHub Actions supply-chain policy

Current workflows still use action version tags. Before production release governance closes:
- inventory every third-party/official action;
- pin security-sensitive production workflows to reviewed immutable commit SHAs where practical;
- keep workflow permissions minimal;
- avoid unnecessary write permissions;
- protect release/signing credentials with GitHub Environments or equivalent controls.

## 15. Release channels

### Development
- local/runtime testing;
- LAN HTTP permitted only in development;
- debug tools allowed;
- never represented as production.

### Alpha
- internal/limited native testing;
- incomplete features allowed when explicitly blocked/labeled;
- exact provenance required.

### Beta
- broader product testing;
- feature set substantially complete;
- production-like infrastructure where safe;
- no false regulatory readiness.

### Release Candidate
- candidate for public release;
- only accepted non-blocking issues remain;
- production config/signing/security gates apply.

### Stable / Production
- store/user release;
- no debug endpoints or development HTTP;
- provider, security, jurisdiction, legal, operational and store gates satisfied.

A stable software version does not itself mean regulated real-money operation is legally authorized.

## 16. Update policy

Future app update control should distinguish:
- minimum supported version;
- recommended version;
- forced update for genuine security/compatibility requirements;
- maintenance state;
- staged rollout/rollback where stores support it.

A forced update must not be used simply to hide poor backward compatibility discipline.

## 17. Release checklist

Before creating a tag/GitHub Release:
- [ ] `version.json` reflects intended product/channel/iteration/build;
- [ ] `pnpm release:check` passes;
- [ ] native build number is greater than every previously distributed build;
- [ ] changelog/release notes are current;
- [ ] exact release commit identified;
- [ ] CI/security gates green;
- [ ] Android artifact validated where applicable;
- [ ] iOS path validated where applicable;
- [ ] artifact contains no secrets/debug production behavior;
- [ ] environment/channel correct;
- [ ] known limitations documented;
- [ ] dependency lock/frozen install requirement satisfied for controlled production;
- [ ] Git tag points to exact release commit;
- [ ] GitHub Release records artifact provenance/evidence.

## 18. Phase 20 / Etapa 6 status

Completed by the Etapa 6 normalization:
- canonical `version.json` introduced;
- active `0.0.0`/`0.0.1` drift removed;
- normalized identity set to `0.1.0-alpha.1` / build `2`;
- automated sync/check tooling added;
- generated mobile release metadata added;
- release/build identity displayed in Profile;
- Android artifact provenance added;
- changelog started;
- PR governance template added;
- CI checks version drift.

Remaining before Etapa 6 is fully closed:
- generate and commit `pnpm-lock.yaml`;
- switch JS installs to frozen-lockfile mode;
- validate the newly versioned Android artifact in CI/on device;
- create the first Git tag/GitHub Release only after that intended alpha artifact passes validation;
- continue production supply-chain hardening/action pinning before public release.
