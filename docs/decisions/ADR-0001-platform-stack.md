# ADR-0001: Platform stack and repository model

- Status: Accepted
- Date: 2026-08-22

## Decision

Vanta will use a monorepo with:

- React Native + TypeScript + Expo for iOS and Android.
- Go for the server-authoritative backend.
- PostgreSQL as persistent system of record.
- Redis for ephemeral infrastructure concerns only.
- A modular monolith before any microservice split.
- REST as the initial application protocol, adding WebSocket only where a game/use case requires real-time streaming.

## Rationale

A single React Native application matches the engineering profile and avoids duplicate iOS/Android feature implementation. Go provides a compact, explicit backend suitable for concurrency and financial/game-domain boundaries. A modular monolith keeps deployment and transaction boundaries manageable during MVP development while preserving clean domain seams for future extraction.

## Security consequence

No game outcome, wallet mutation, settlement rule, database credential, signing secret, or privileged API key may be shipped in the mobile bundle.
