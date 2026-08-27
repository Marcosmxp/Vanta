# Vanta — Native Alpha MVP

**MVP type:** controlled native alpha  
**Current phase:** Phase 20  
**Not equivalent to:** public production real-money launch

## MUST HAVE

### Repository/build baseline

- deterministic JavaScript dependency graph through committed `pnpm-lock.yaml`;
- controlled Node `22.13.0` and pnpm `10.15.0` baseline;
- frozen dependency installation in CI/native build;
- release identity traceable to version/build/commit;
- CI, CodeQL and relevant backend/mobile checks green for the intended alpha artifact.

### Native runtime

- Android installable build;
- physical Android core-flow validation;
- Expo/native configuration remains reproducible;
- no known reproducible critical crash in the core alpha journey;
- documented iOS build/compile path even when physical iPhone validation is externally unavailable.

### Account/session

- registration;
- login;
- secure session persistence;
- minimize/resume without unnecessary login;
- force-close/reopen session restoration while valid;
- silent access-token refresh;
- revoked/expired refresh returns to authentication;
- logout clears local session and revokes server session.

### Core player journeys

- Home;
- Play/game entry;
- Plinko protected/native rendering foundation;
- Wallet read state and empty history;
- Profile;
- Security Center;
- Responsible Gaming;
- Support;
- Legal/Privacy entry points;
- clear loading/error/empty states for affected flows.

### Product UX

- player-facing language instead of backend/API implementation copy;
- localization foundation for `pt-BR`, `en`, `es` on supported/migrated journeys;
- consistent bottom navigation with icon + label;
- Reduce Motion support for shared motion where implemented;
- version/build About information;
- Vanta-native identity sufficient to avoid generic/broken development presentation.

### Safety boundaries

- mobile remains untrusted;
- wallet/game/financial authority remains server-side;
- production payment execution remains blocked;
- production KYC approval remains blocked without provider;
- production wager/settlement remains blocked without complete math/risk/provider/regulatory gates;
- no production secrets in client/source control.

## SHOULD HAVE

- final app/adaptive icon assets;
- final native splash and short branded launch transition;
- stronger visual polish across all primary screens;
- broader accessibility pass;
- automated regression coverage for session and critical mobile boundary behavior;
- cleaner dev-client/physical-device development workflow;
- source-commit provenance corrected for PR-generated native artifacts;
- dependency warning review without unrelated broad upgrades.

## COULD HAVE

- additional non-critical illustrations/assets;
- richer game animation polish;
- additional diagnostic tooling restricted to development;
- broader automated E2E coverage after critical paths exist;
- `pt-PT` localization when a product/jurisdiction decision requires it.

## NOT IN THIS MVP

- public real-money operation;
- production deposits/withdrawals;
- production PSP reconciliation;
- production KYC/AML provider approval flow;
- production MFA/passkeys/withdrawal step-up unless separately implemented and validated;
- final licensing/certification;
- uncontrolled jurisdiction expansion;
- additional Vanta Originals simply to increase catalog size;
- microservices/Kubernetes without evidence;
- paid acquisition/commercial scale.

## Alpha exit criteria

The Native Alpha is not complete merely because an APK installs.

Exit requires evidence for:

1. stable core Android runtime;
2. documented/validated iOS build path;
3. session persistence + silent refresh + revocation behavior;
4. no critical reproducible native/core-flow crash;
5. deterministic dependency/build baseline;
6. CI/security evidence;
7. artifact/config/secret review;
8. product copy/localization/navigation/branding sufficiently coherent for controlled alpha;
9. documentation current;
10. regulated production capabilities still fail-closed.

## Scope control

A feature discovered during alpha that is useful but not required for these exit criteria should be placed in the backlog rather than silently expanding the MVP.
