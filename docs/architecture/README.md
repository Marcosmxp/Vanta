# Vanta Architecture

## Product boundary

Vanta v0.0.0.1 is a native mobile betting MVP with Plinko as the first game.

## System shape

- `apps/mobile`: React Native + TypeScript + Expo application.
- `backend`: Go modular monolith and server-authoritative game/financial logic.
- `packages`: shared contracts and non-secret compile-time artifacts.
- `infrastructure`: local and future deployment configuration.
- `docs`: architecture decisions, security notes, domain rules, and development workflow.

## Backend domains

The target modular boundaries are:

- identity
- player
- kyc
- wallet
- ledger
- betting
- games/engine
- games/plinko
- payments
- compliance
- responsiblegaming
- risk
- fraud
- notification
- audit

## Financial model

Vanta will use an immutable, double-entry-style ledger model. A mutable `users.balance` field is not an acceptable source of financial truth.

Core concepts:

- wallets
- ledger accounts
- ledger transactions
- ledger entries
- bets
- bet settlements

## Game authority

The mobile app may request a bet and animate the returned result, but it must not determine RNG outcomes, payouts, settlement, or canonical balance state.
