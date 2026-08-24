# Vanta Architecture

> Canonical project context lives in [`../VANTA_PROJECT_CONTEXT.md`](../VANTA_PROJECT_CONTEXT.md). This architecture overview summarizes the current system shape; if there is a conflict, follow the documentation precedence in [`../README.md`](../README.md).

## Product boundary

Vanta v0.0.0.1 is a native mobile betting/gaming MVP with Plinko as the first game.

Phases 01–19 are complete. The current runtime already includes an integrated React Native client, executable Go API, PostgreSQL persistence/ledger and Redis ephemeral controls. Phase 20 is the native build/device-validation phase.

## System shape

- `apps/mobile`: React Native + TypeScript + Expo application.
- `backend`: Go modular monolith with server-authoritative identity, financial, Responsible Gaming and game boundaries.
- `packages`: shared contracts and non-secret compile-time artifacts.
- `infrastructure`: local runtime and future deployment configuration.
- `docs`: canonical project context, roadmap, architecture decisions, security notes and development history.

## Backend domains

Current/target modular boundaries include:

- identity/auth
- identity/security
- player/profile
- kyc
- wallet
- ledger
- betting/history
- games/plinko
- payments
- compliance/legal
- responsiblegaming
- support
- platform/status
- risk
- fraud
- notification
- audit

The MVP remains a modular monolith. Microservices are not a goal without evidence that independent scaling/operations justify them.

## Financial model

Vanta uses an immutable, double-entry-style PostgreSQL ledger model. A mutable `users.balance` field is not an acceptable source of financial truth.

Core concepts:

- wallets;
- ledger accounts;
- ledger transactions;
- ledger entries;
- bets;
- settlement state.

Redis is never financial truth.

## Game authority

The mobile application may request an authorized bet and animate the returned result, but it must not determine RNG outcomes, payouts, settlement or canonical balance state.

The Plinko visual and secure engine foundation exist, but the public real-money bet-placement/settlement path remains intentionally closed until its production ruleset, policy enforcement and transactional settlement requirements are complete.

## Current runtime references

- [`backend-runtime-phase17.md`](./backend-runtime-phase17.md) — executable backend foundation.
- [`mobile-backend-integration.md`](./mobile-backend-integration.md) — mobile/API integration.
- [`../security/phase19-security-audit.md`](../security/phase19-security-audit.md) — security findings, regression gates and remaining blockers.
- [`../ROADMAP.md`](../ROADMAP.md) — Phase 20 and post-MVP plan.
