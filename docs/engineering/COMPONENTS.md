# Vanta — Components

**Status:** canonical component/module map.

This document maps the current logical components. It does not authorize new services or production capabilities.

## Mobile

- `app/`: application composition/configuration/providers.
- `core/api`: HTTP client and API boundary normalization.
- `core/query`: server-state query configuration.
- `core/session`: persisted authentication/session lifecycle.
- `core/security`: client-side security support without server authority.
- `core/i18n`: player localization and locale persistence.
- `core/system-state`: application/platform state coordination.
- `design-system/`: reusable visual components and tokens.
- `features/auth`: onboarding/register/login flows.
- `features/home`: authenticated player home.
- `features/wallet`: balances, transaction presentation and financial navigation.
- `features/payments`: deposit/withdraw presentation/contracts; real execution remains blocked.
- `features/games`: Vanta Originals presentation, currently Plinko foundation.
- `features/betting`: bet history/details presentation.
- `features/profile`: player account/profile presentation.
- `features/kyc`: verification status/flow presentation; production provider not yet active.
- `features/security`: session/security-center presentation.
- `features/responsible-gaming`: limits, timeout and self-exclusion presentation.
- `features/support`: support topics/channels/requests.
- `features/legal`: legal/privacy/regulatory document presentation.

## Backend

- `identity`: credentials, auth, session rotation/revocation and security commands.
- `player`: profile/player read models and player-owned state.
- `wallet`: ledger-backed wallet/application boundaries.
- `betting`: player betting history/read models.
- `games`: authoritative game-engine foundations, including Plinko.
- `kyc`: verification state/provider boundary.
- `payments`: payment intent/provider contracts; production execution remains closed.
- `responsiblegaming`: policy, limits, timeout and self-exclusion enforcement.
- `support`: support configuration/requests.
- `compliance`: legal/regulatory presentation/configuration.
- `health`: liveness/readiness.
- `platform`: database, migrations, configuration, HTTP server/API, PII protection, IDs, rate limiting, cache/status and cross-cutting runtime services.
- `integration`: integration/regression tests across PostgreSQL/Redis/API boundaries.

## Data flow

```text
Screen/feature
→ mobile provider/API boundary
→ HTTP route
→ authenticated/validated application boundary
→ domain service/repository
→ PostgreSQL
```

Redis participates only in approved ephemeral concerns and cannot replace PostgreSQL/ledger truth.

## Responsibility rule

UI owns presentation and interaction. Domain/application layers own business rules. Authorization is server-side. Database/repositories own persistence. External provider adapters must not bypass domain/ledger/policy rules.

When a new component is proposed, first verify that an existing module cannot own the responsibility cleanly. Avoid duplicate modules/components with cosmetic naming differences.
