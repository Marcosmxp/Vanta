# Vanta — FOUNDATION-005 Quality Gates & Repository Governance

**Status:** implementation checkpoint; final CI/native evidence remains authoritative in GitHub Actions.

## Implemented in this block

- repository hygiene CI gate for changed-file whitespace in code/config and tracked secret-like files;
- source branch SHA separated from synthetic CI/merge SHA in Android artifact provenance;
- automated Android APK inspection for server-only configuration markers and secret-like packaged files;
- critical mobile regression tests for session timing, SecureStore fail-closed behavior, locale selection and the Wallet/Legal/Support/Responsible Gaming null-collection failures found on physical Android;
- PR template aligned with scope, security, database, dependency, environment, release, testing, accessibility and self-review gates;
- CI/CodeQL/Android workflows configured to cancel superseded runs for the same PR/ref;
- GitHub Actions checkout/setup versions advanced to supported runtimes where changed;
- exact target policy for `main` branch protection documented in `docs/engineering/GIT_WORKFLOW.md`;
- dependency-health evidence recorded without broad upgrades.

## Deliberately not implemented

### Dedicated JS/TS lint/formatter

No ESLint/Prettier dependency was added during this block. Strict TypeScript, tests, bundle validation and repository whitespace checks remain enforced. `TOOL-LINT-001` stays open pending a scoped Expo/React Native compatibility and ruleset decision.

### Main branch protection

GitHub currently reports `main` as unprotected. The repository connector available to this session can read branch state but does not expose a branch-protection/ruleset write action. `GIT-GOV-001` therefore remains blocked on an explicit GitHub repository-setting change; it must not be marked done merely because the target policy is documented.

## Validation rule

Do not infer success from this document. The final HEAD must pass the applicable GitHub Actions jobs. Native provenance and APK inspection are considered validated only after the Android workflow completes successfully and its artifact identity matches the source commit.
