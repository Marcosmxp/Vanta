# Vanta — Testing Strategy

**Status:** canonical quality/testing strategy.

## Objective

Tests exist to protect product, security, financial and data invariants. Do not optimize for artificial 100% coverage.

Priority order:

1. authentication/session/authorization;
2. financial ledger/wallet/idempotency;
3. Responsible Gaming and eligibility rules;
4. game mathematics/outcome/settlement boundaries;
5. KYC/payment/provider boundaries;
6. critical API transformations;
7. player-critical mobile flows;
8. lower-risk presentation behavior.

## Test layers

### Unit

Use for deterministic domain logic, validators, game rules/math, pure transformations and isolated state behavior.

### Integration

Use for boundaries where correctness depends on PostgreSQL, Redis, HTTP behavior, session rotation, ownership, idempotency or persistence semantics.

### Mobile component/boundary tests

Vitest validates mobile/API/session boundary behavior without requiring a full native runtime.

Current high-value mobile coverage includes:

- API configuration must fail closed before network access when unsafe;
- bearer tokens remain in authorization headers rather than URLs;
- structured API errors/request IDs are preserved;
- malformed successful API responses fail explicitly;
- session access/refresh expiry timing policy is deterministic and tested;
- malformed/incomplete SecureStore session state is cleared fail-closed;
- valid session pairs are persisted with device-only unlocked keychain accessibility.

Continue expanding around full SessionProvider refresh/logout behavior, localization persistence, nullable API collections and critical auth states. Do not add a rendering-test dependency merely for convenience unless it is justified by the coverage gained.

### Storybook

Storybook is useful for visual/component states but is **not** a replacement for behavioral regression tests.

### E2E / native

No broad automated native E2E suite is currently canonical. Physical Android smoke testing is used in Phase 20.

Before production, add a small automated E2E set for genuinely critical journeys rather than attempting to automate every screen.

## Current standard validation

### Repository hygiene

CI performs a dependency-free repository gate that:

- runs `git diff --check` over the PR/push change range;
- rejects tracked `.env` files other than `.env.example`;
- rejects tracked private-key/keystore-style files such as `*.pem`, `*.key`, `*.p12`, `*.pfx`, `*.jks` and `*.keystore`.

This complements `.gitignore`; it does not replace secret scanning or artifact inspection.

### Mobile/root

```bash
pnpm install --frozen-lockfile
pnpm release:check
pnpm mobile:typecheck
pnpm mobile:test
pnpm --filter @vanta/mobile app:validate
pnpm --filter @vanta/mobile storybook:validate
```

The native Android workflow additionally:

- runs frozen dependency installation;
- performs Expo prebuild/native compilation;
- inspects the produced APK for server-only configuration markers and secret-like packaged files;
- writes source-SHA and CI-SHA provenance separately.

### Backend

From `backend/` when applicable:

```bash
go mod tidy
git diff --exit-code -- go.mod go.sum
gofmt -l .
go test -race ./...
go vet ./...
go run golang.org/x/vuln/cmd/govulncheck@v1.7.0 ./...
go build ./cmd/api
```

CI additionally validates the API container and development Compose model.

## Baseline rule

Before structural/risky work, record whether existing relevant tests are:

- PASS;
- FAIL;
- SKIPPED;
- NOT AVAILABLE.

Do not attribute a pre-existing failure to the new change without baseline evidence.

## Regression requirements

When a real bug is found, prefer adding a regression test at the boundary that allowed it.

Examples from Phase 20 that deserve/require continued coverage:

- empty API collections must not crash mobile `.length` consumers;
- wallet/support/legal/Responsible Gaming boundary normalization;
- stale authentication errors clear correctly;
- session restore/refresh/revocation behavior;
- password-policy parity between client and server;
- localization fallback/persistence;
- financial ledger balancing/idempotency;
- auth throttling/security fail-closed behavior.

## Security-sensitive changes

Auth, authorization, sessions, payments, KYC, financial mutations, game math, Responsible Gaming, permissions and cryptography require an additional review and appropriate integration/regression tests.

## Native/manual smoke testing

For native runtime changes record:

- device/platform;
- app version/build;
- source commit;
- environment/API target;
- flows tested;
- observed failures;
- screenshots/log evidence when useful.

A Metro reload is not sufficient evidence for changes involving native configuration, permissions, splash/icon, native modules or release packaging.

## E2E target set before production

Recommended minimal critical set:

```text
register/login
→ authenticated home
→ session restart/refresh
→ profile/wallet
→ security/logout
```

Provider-enabled production phases should later add KYC/payment/reconciliation and controlled game-action journeys only after those capabilities exist.

## JavaScript/TypeScript lint and formatting

Current enforced quality comes from strict TypeScript, tests, bundle validation and repository whitespace checks. A dedicated ESLint/Prettier policy is not yet installed.

`TOOL-LINT-001` remains open because adding lint/format tooling is a dependency and policy change. Before adoption, evaluate Expo/React Native compatibility, maintenance cost, ruleset scope and lockfile impact. Do not fetch an unpinned formatter/linter dynamically in CI and do not introduce a mass style rewrite as part of setup.

## Coverage

Numeric coverage targets are currently `DECISION REQUIRED`. Coverage percentage must not replace risk-based testing. If coverage reporting is introduced, use it to find blind spots rather than incentivize meaningless tests.

## Evidence rule

Do not say "tested" or "green" without actual local/CI evidence. Use `NOT RUN`, `BLOCKED` or the real failure when evidence is absent.
