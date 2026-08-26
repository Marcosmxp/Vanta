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

pnpm currently reports ignored build scripts for `@shopify/react-native-skia` and `esbuild` in the deterministic install. Do not globally approve scripts without reviewing the package and why execution is required.

The Android workflow intentionally installs the Skia native binary and verifies the expected arm64 artifact. Keep this explicit until a reviewed package-build policy replaces it.

## Current dependency-health evidence

As of the Phase 20 / FOUNDATION-005 checkpoint:

- `pnpm install --frozen-lockfile` succeeds with the controlled lockfile;
- `pnpm audit --audit-level=high` succeeds, so no high/critical advisory currently blocks CI;
- the audit output reports **2 moderate vulnerabilities**;
- peer/transitive warnings remain around the React/ReactDOM version relationship, React Native safe-area compatibility, valibot and deprecated transitive packages from the current dependency graph;
- no broad framework/native upgrade has been performed to hide those warnings.

The two moderate advisories and compatibility warnings remain tracked under `DEP-HEALTH-001` / `TECH-001`. Resolve them in a scoped dependency task that identifies the affected packages, validates the Expo SDK 57 compatibility envelope and reruns native builds. Do not lower the audit gate or add ignores merely to make output quiet.

## Security gates

Current dependency/supply-chain gates include:

- frozen pnpm installation;
- `pnpm audit --audit-level=high`;
- CodeQL for JS/TS and Go;
- `govulncheck` for Go;
- repository rejection of tracked secret-like files;
- Android artifact inspection for server-only configuration/secret-like packaged files;
- exact source/CI commit provenance in native build metadata.

A green scanner does not remove the need to review dependency purpose, permissions and runtime behavior.

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
