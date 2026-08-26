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

Vitest currently validates mobile/API boundary behavior. Expand coverage around session lifecycle, localization, nullable API collections, auth error state and critical providers without overfitting implementation details.

### Storybook

Storybook is useful for visual/component states but is **not** a replacement for behavioral regression tests.

### E2E / native

No broad automated native E2E suite is currently canonical. Physical Android smoke testing is used in Phase 20.

Before production, add a small automated E2E set for genuinely critical journeys rather than attempting to automate every screen.

## Current standard validation

### Mobile/root

```bash
pnpm install --frozen-lockfile
pnpm release:check
pnpm mobile:typecheck
pnpm mobile:test
pnpm --filter @vanta/mobile app:validate
pnpm --filter @vanta/mobile storybook:validate
```

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

## Coverage

Numeric coverage targets are currently `DECISION REQUIRED`. Coverage percentage must not replace risk-based testing. If coverage reporting is introduced, use it to find blind spots rather than incentivize meaningless tests.

## Evidence rule

Do not say "tested" or "green" without actual local/CI evidence. Use `NOT RUN`, `BLOCKED` or the real failure when evidence is absent.
