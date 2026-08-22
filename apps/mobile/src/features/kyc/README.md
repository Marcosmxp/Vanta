# Vanta KYC Mobile Boundary

## Purpose

This feature owns the mobile presentation for identity verification. It does not decide whether a player is verified, eligible, allowed to wager, or allowed to move money.

## Flow

`Intro -> DocumentType -> DocumentCapture -> Selfie -> Processing -> Approved | Rejected -> Retry`

The `Processing`, `Approved`, and `Rejected` states are designed now so the eventual backend/provider integration has explicit UI targets.

## Provider boundary

`KycProvider` is the integration contract. The intended production flow is:

1. Backend authorizes a verification attempt.
2. Mobile/provider SDK starts an ephemeral provider session.
3. Document and liveness capture are handled by the provider SDK.
4. Mobile receives opaque capture/session tokens, not reusable raw media.
5. Backend/provider performs verification and risk checks.
6. Mobile receives a server-authoritative verification state.
7. A trusted application coordinator decides whether the player proceeds to `Main` or another required flow.

## Sensitive-data rules

Never place raw document images, selfies, biometric media, document numbers, or provider secrets in:

- React Navigation params/state
- Zustand or another long-lived client store
- MMKV / AsyncStorage
- analytics events
- crash reports
- application logs
- Git repositories

Temporary provider tokens must be scoped, short-lived, and handled only for the operation that created them.

## Authorization rules

Route visibility is not authorization. `KycApprovedScreen` must never unlock betting or financial operations by itself.

The backend remains authoritative for:

- KYC status
- age and jurisdiction eligibility
- account/risk state
- responsible-gaming restrictions
- deposits and withdrawals
- wagering permissions
- manual-review requirements
- retry/rate limits

## Phase 06 limitation

This phase intentionally contains no camera SDK, no document upload implementation, no liveness implementation, no mock approval button, and no local status override. Those integrations are added only behind the provider/backend boundary.
