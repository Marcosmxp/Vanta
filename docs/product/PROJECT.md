# Vanta — Project Definition

**Status:** canonical product definition  
**Current maturity:** Native Alpha / Phase 20 in progress  
**Current controlled release identity:** `0.1.0-alpha.1`

## Product

Vanta is a native mobile gaming platform under active development. The product direction combines a premium financial-product experience with original gaming capability, strong account security, transparent wallet/account surfaces and Responsible Gaming controls.

Plinko is the first **Vanta Original**.

Vanta is not authorized for production real-money operation merely because the application builds or an APK installs. Production wagering, live payments, production KYC/AML, final jurisdiction controls, approved game mathematics/risk, MFA/passkey/step-up and other production gates remain blocked until explicitly implemented and validated.

## Problem the product is intended to solve

Many gaming products expose fragmented, noisy or opaque account, wallet, security and game experiences. Vanta aims to provide a coherent mobile experience in which the player can understand:

- account and verification state;
- available financial state;
- recent activity;
- games that are available;
- security controls;
- Responsible Gaming controls;
- support and legal information.

The player experience should remain simple while financial, game, security and compliance decisions remain strict and server-authoritative.

## Target user

### Current alpha user

Internal/test users validating native runtime, product UX, session behavior and server integration.

### Future commercial user

Adult players in jurisdictions where Vanta or a licensed distribution partner is legally permitted to offer the relevant product.

The exact first production jurisdiction and commercial operating entity are **DECISION REQUIRED** and must not be inferred from current development location, language or documentation.

## Value proposition

Vanta aims to differentiate through:

- premium mobile UX rather than a generic casino presentation;
- Vanta Originals;
- fintech-grade account/wallet clarity;
- server-authoritative game and financial logic;
- security by design;
- Responsible Gaming by design;
- traceable releases and auditable financial history;
- reusable game/risk/compliance foundations for future products.

## Current implemented capabilities

Current repository foundations include:

- native React Native/Expo mobile application;
- Go modular-monolith API;
- PostgreSQL canonical persistence;
- Redis for ephemeral coordination/cache/rate limiting;
- registration and login;
- rotating refresh-session foundation and SecureStore persistence;
- profile/account surfaces;
- KYC state/provider boundary foundation;
- wallet/read-model and ledger foundations;
- deposit/withdraw presentation/contracts with production execution blocked;
- Plinko visual and server game-engine foundation;
- bet history/detail foundations;
- Security Center;
- Responsible Gaming;
- Support;
- Legal/Privacy surfaces;
- localization foundation for `pt-BR`, `en` and `es` on migrated player journeys;
- release/version provenance;
- CI, CodeQL, dependency auditing and deterministic pnpm installs.

Implementation details and completion evidence remain governed by current code, migrations, tests and phase documents.

## MVP definition

The current MVP is a **controlled native alpha**, not a public real-money launch.

Its purpose is to prove:

- stable native runtime;
- coherent core player journeys;
- secure/persistent session UX;
- server-authoritative integration;
- no critical core-flow crashes;
- traceable deterministic builds;
- basic security/regression gates;
- product-quality navigation/copy/branding sufficient for controlled testing.

See [`MVP.md`](./MVP.md).

## Planned capabilities

Later roadmap work includes, subject to explicit gates:

- production platform/environment separation;
- production secret/KMS strategy;
- stronger observability and incident operations;
- MFA/passkeys/step-up;
- device risk/trust controls where justified;
- real KYC/AML provider integration;
- real payment provider integration and reconciliation;
- approved game mathematics and bankroll/exposure controls;
- production wager/settlement pipeline;
- fraud/risk operations;
- jurisdiction-specific licensing/regulatory configuration;
- controlled commercial pilot;
- additional Vanta Originals only after the first game/pipeline is proven;
- possible B2B technology/game distribution and selected B2C operation.

## Out of scope for the current Native Alpha

- unrestricted real-money wagering;
- live payment execution/reconciliation;
- fabricated KYC approval;
- fabricated operator/license/regulator status;
- production withdrawal authorization;
- production MFA/passkeys when not implemented;
- production game-math approval by assumption;
- uncontrolled multi-jurisdiction launch;
- microservice migration without operational evidence;
- scaling assumptions for millions of users without measurement.

## Business model

Long-term strategy may support two distinct models:

1. **B2B:** Vanta Originals and/or platform technology distributed to licensed operators where commercially justified.
2. **B2C:** selected direct operation only where licensing, providers, economics, capital and compliance justify it.

The first commercial model/jurisdiction is **DECISION REQUIRED**. The project must not silently assume B2C or a specific country as the initial launch path.

## Product principles

Priority order:

1. protect player funds, identity and account security;
2. preserve legal/regulatory boundaries;
3. preserve game integrity and mathematical correctness;
4. deliver excellent player UX and accessibility;
5. prove unit economics;
6. scale product, marketing and jurisdictions.

A lower priority must never be optimized by weakening a higher one.

## Primary risks

- regulatory/jurisdiction uncertainty;
- game-math/bankroll/exposure risk;
- account/session security;
- financial integrity and reconciliation;
- provider dependency;
- mobile/native regression risk;
- documentation/contract drift between mobile, API and database;
- premature commercial scaling;
- single-developer/AI-assisted development creating scope or consistency drift without repository governance.

See [`../project/RISKS.md`](../project/RISKS.md).

## Success criteria

### Native Alpha

- reproducible builds and green CI/security baseline;
- stable Android physical-device core flow;
- documented iOS build path;
- persistent session behavior validated, including silent refresh/revocation cases;
- core screens free of known reproducible critical crashes;
- player-facing copy/locale behavior consistent;
- final native identity/launch/navigation quality sufficient for controlled alpha;
- regulated production capabilities remain fail-closed.

### Future production

Production success criteria are not merely feature completion. They require security, provider, regulatory, game-math, financial, operational and release evidence defined by the production-readiness roadmap.

## Canonical references

- `docs/VANTA_PRODUCT_BUSINESS_STRATEGY.md`
- `docs/ROADMAP.md`
- `docs/VANTA_PROJECT_CONTEXT.md`
- `docs/product/MVP.md`
- `docs/product/REQUIREMENTS.md`
- `docs/security/`
- `docs/architecture/`
- `docs/release/`
