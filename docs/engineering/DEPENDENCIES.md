# Vanta — Dependency Policy

**Status:** canonical dependency/change-control policy.

## JavaScript workspace

- Package manager: pnpm only.
- Canonical pnpm version: `10.15.0`.
- Node baseline: `22.13.0` or a version satisfying the repository engine while CI remains pinned to the controlled baseline.
- Root `pnpm-lock.yaml` is committed and authoritative.
- Controlled installs use `pnpm install --frozen-lockfile`.
- Dependency declaration changes must update the lockfile.
- Do not hand-edit or fabricate the lockfile.

## Go

Backend dependencies are controlled by `backend/go.mod` and `backend/go.sum`.

CI verifies the module graph and runs `govulncheck`.

## Before adding a dependency

Evaluate:

1. What exact problem does it solve?
2. Can the current stack solve it without a new package?
3. Is the project actively maintained?
4. What is its security history and transitive dependency surface?
5. What license applies?
6. What bundle/runtime/native-build impact does it introduce?
7. Does it require build scripts/native binaries?
8. Is there a simpler, smaller alternative?
9. How would removal/migration work later?

Do not add a dependency merely for convenience or a trivial helper.

## Upgrade rules

- Do not perform broad upgrades while fixing an unrelated bug.
- Framework/runtime upgrades require compatibility review, especially Expo/React Native/React/native modules.
- Review changelogs and migration notes for major/minor framework changes.
- Dependency updates must pass relevant typecheck/tests/build/security gates.
- Avoid unrestricted dependency auto-merge.

## Native dependencies

Native React Native/Expo dependencies require additional review because they can affect:

- Android/iOS prebuild;
- Gradle/CocoaPods;
- permissions/entitlements;
- app size;
- ABI/native binary availability;
- store policy/security behavior.

Do not assume a package that works in Metro is valid in a native release build.

## Build scripts

pnpm may warn about ignored package build scripts. Do not globally approve scripts without reviewing the package and why execution is required. Native artifacts needed by a package should be installed through an intentional, documented step where possible.

## Current known dependency-health work

Peer/deprecation/build-script warnings discovered during the Phase 20 baseline are tracked as technical debt rather than being hidden by unrelated upgrades.

## Security

Current gates include JavaScript dependency audit, CodeQL and Go vulnerability scanning. A green scanner does not remove the need to review dependency purpose, permissions and runtime behavior.

## Licenses

Before commercial/public distribution, verify licenses of code dependencies and non-code assets. The repository currently requires a deliberate project LICENSE decision; do not assume public repository visibility equals open-source licensing.

## Dependency change summary

Any meaningful dependency change should state:

- dependency/version;
- reason;
- alternatives considered;
- security/license/runtime impact;
- lockfile/module changes;
- tests/builds executed;
- known limitations.
