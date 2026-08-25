# Vanta — Phase 20 Security Architecture

**Status:** canonical in-progress security architecture for Phase 20.  
**Last consolidated:** 2026-08-25.  
**Branch:** `feat/phase20-native-builds` / PR #24.

This document describes the current security model and the hardening path from native alpha to regulated production. It does **not** claim that planned production controls already exist.

---

## 1. Security objective

Vanta must remain secure even when an attacker can inspect or modify the released mobile application.

The central rule is:

> **The mobile client requests actions; the backend decides authority, canonical state and financial/game effects.**

A compromised client must not be sufficient to:
- mint or move canonical money;
- approve identity/KYC;
- remove Responsible Gaming restrictions;
- access another player's data;
- choose a production RNG result;
- select a payout or settlement result;
- forge provider success;
- authorize a sensitive withdrawal without required server policy;
- override game/exposure limits.

---

## 2. Trust-boundary model

```text
UNTRUSTED / PARTIALLY TRUSTED

Player
  ↓
Mobile application
  ↓ HTTPS
Internet / mobile network
  ↓
Edge / reverse proxy

TRUSTED SERVER BOUNDARY

Go API
  ├── identity/auth/security
  ├── KYC/compliance
  ├── Responsible Gaming
  ├── wallet/ledger
  ├── games/risk
  ├── payments/reconciliation
  └── audit/operations
        ↓
PostgreSQL (canonical truth)
Redis (ephemeral coordination only)
External providers via authenticated server integrations
```

Important consequences:
- UI route visibility is never authorization.
- The server derives player ownership from the authenticated principal.
- Redis is not canonical financial, identity or regulatory state.
- Provider callbacks are not trusted merely because they reach an endpoint; signatures, replay protection and reconciliation are required.
- Reverse-proxy headers are not trusted unless the request comes from explicitly trusted proxy infrastructure.

---

## 3. Current implemented security baseline

### 3.1 Identity and credentials

Current backend foundations include:
- bcrypt password hashing with cost 12;
- normalized email lookup through protected deterministic lookup material;
- encrypted sensitive PII using AES-256-GCM;
- opaque session credentials rather than self-authorizing client data.

Passwords, access tokens, refresh tokens, OTPs, recovery codes and private cryptographic material must never be logged or routed through analytics/navigation state.

### 3.2 Session credentials

Implemented:
- short-lived access tokens;
- rotating refresh tokens;
- server stores token hashes rather than plaintext credentials;
- refresh generation/replay handling;
- atomic refresh compare-and-swap protection from Phase 19;
- server-side session revocation;
- mobile SecureStore persistence;
- single-flight mobile refresh coordination;
- local session clearing after logout/expiry.

Detailed policy is in [`session-device-security-roadmap.md`](./session-device-security-roadmap.md).

### 3.3 HTTP/API boundary

Implemented/hardened foundations include:
- strict JSON/body handling;
- server-generated request IDs;
- production HSTS/CSP/no-store/frame-denial/referrer protections;
- HTTP timeouts and limits;
- authentication throttling with canonical source-IP handling;
- player-scoped resource ownership checks;
- bearer credentials carried in headers rather than URLs;
- mobile HTTP blocked outside development.

### 3.4 Financial boundary

Current invariants:
- PostgreSQL is canonical financial truth;
- balances derive from ledger state rather than an untrusted client field;
- financial mutation must be transactional and auditable;
- command boundaries require idempotency where duplicate execution would be unsafe;
- concurrent requests must not overspend;
- a payment-provider response alone must not directly become final canonical money without reconciliation/posting logic.

### 3.5 Game boundary

Current Plinko architecture already separates:
- server CSPRNG result generation;
- versioned ruleset structure;
- integer payout calculation;
- mobile result animation.

The public production wager endpoint remains closed. This is a security control, not missing polish.

Before production, game mathematics, exposure, reservation and settlement must pass the dedicated gates defined in [`../architecture/game-math-financial-risk-engine.md`](../architecture/game-math-financial-risk-engine.md).

### 3.6 CI/security verification

Current pull-request security/quality gates include:
- TypeScript checks;
- mobile API/security tests;
- dependency audit;
- Go module verification;
- `gofmt`;
- `go test -race ./...`;
- `go vet ./...`;
- `govulncheck`;
- API/container/Compose validation;
- CodeQL for Go and JavaScript/TypeScript.

A green CI run is necessary, but it is not equivalent to an independent penetration test or regulatory certification.

---

## 4. Threat classes the architecture must assume

### Mobile/client abuse
- modified/repacked APK/IPA;
- runtime hooking/instrumentation;
- rooted/jailbroken devices;
- emulator/device farms;
- automated custom API clients;
- replayed client requests;
- local credential extraction attempts;
- debug configuration accidentally shipped to production.

### Account attacks
- credential stuffing;
- brute force;
- refresh-token theft/replay;
- account recovery abuse;
- session fixation/reuse;
- social engineering;
- compromised email/phone account;
- MFA downgrade/recovery bypass.

### API/business-logic attacks
- IDOR/BOLA;
- privilege confusion;
- duplicate financial commands;
- race conditions;
- amount/currency tampering;
- limit bypass;
- Responsible Gaming bypass;
- KYC state manipulation;
- malformed/oversized input;
- enumeration/automation.

### Payment/provider attacks
- forged webhooks;
- replayed webhooks;
- duplicated callbacks;
- settlement/reconciliation mismatch;
- destination ownership abuse;
- chargeback/fraud campaigns;
- provider outage or stale state.

### Game/risk attacks
- client-selected outcome;
- ruleset substitution;
- payout overflow/rounding errors;
- replayed wagers;
- inconsistent bet/ledger settlement;
- predictable/failed entropy;
- concurrent exposure exceeding operator limits;
- math configuration deployed without approval.

### Infrastructure/supply-chain attacks
- secret leakage;
- compromised CI dependency/action;
- dependency confusion/vulnerable package;
- weak production key storage;
- excessive database/network exposure;
- untrusted reverse-proxy headers;
- unsigned/untraceable release artifacts.

---

## 5. AI-era security assumption

AI makes code review, request generation, reverse engineering and automation cheaper. Vanta should therefore assume that implementation details visible in the client will eventually be understood by attackers.

The response is **not** to depend on secrecy of the APK. The response is to make the server-side invariants remain valid under hostile clients.

AI-assisted attacks strengthen the need for:
- strict authorization;
- rate/risk controls;
- deterministic financial invariants;
- replay/idempotency protection;
- fast monitoring and revocation;
- secure release/supply-chain controls;
- continuous dependency/static/security testing.

Obfuscation may still be used as defense-in-depth, but it must never be treated as proof that a secret or privileged algorithm can safely live in the client.

---

## 6. Mobile security target

### Required for controlled production

- SecureStore/Keychain/Keystore usage for session credentials;
- no secrets in AsyncStorage/MMKV/plain files;
- HTTPS-only production API configuration;
- production debug menus disabled;
- no development LAN/base URLs in production artifacts;
- artifact secret/config inspection;
- release signing protected outside source control;
- platform attestation signals (Play Integrity / App Attest) integrated into risk policy;
- jailbreak/root/emulator signals treated as risk signals, not sole authorization decisions;
- optional local biometric application lock where UX/security policy requires it;
- screenshot/clipboard restrictions only where justified by actual sensitive data, not globally without reason.

### Important principle

A rooted phone should not automatically make the backend insecure. Device trust affects risk decisions and step-up requirements; core authorization and financial correctness remain server-side.

---

## 7. Authentication, MFA, passkeys and recovery target

Phase 22 must define and implement:
- MFA enrollment lifecycle;
- passkey/WebAuthn/FIDO-compatible strategy where platform/backend architecture permits;
- TOTP or another approved fallback if needed;
- recovery process resistant to MFA downgrade;
- security notifications for new device/high-risk events;
- step-up challenge issuance/verification;
- factor reset/replacement policy;
- audit events for enrollment, removal and recovery.

Do not open withdrawal/security-sensitive flows with a placeholder MFA flag.

The server must decide whether a recent strong-authentication event satisfies a sensitive command.

---

## 8. Authorization model

Every protected operation should answer all applicable questions independently of the UI:

1. Is the credential/session valid?
2. Which player/account does the principal own?
3. Is the account active/eligible?
4. Is KYC/jurisdiction state sufficient?
5. Do Responsible Gaming restrictions allow the action?
6. Is recent step-up required and satisfied?
7. Is the resource owned by this principal?
8. Are amount/currency/ruleset values server-approved?
9. Is the request idempotent/replay-safe?
10. Do fraud/risk/exposure controls permit the action?

An endpoint must not infer authorization from the fact that the mobile screen was reachable.

---

## 9. Production secrets and cryptographic key management

Development environment variables are not a production secrets architecture.

Production target:
- managed secret/key storage;
- encryption keys separated from encrypted database records;
- least-privilege workload access;
- explicit rotation versioning;
- staged rotation/re-encryption procedures where required;
- audit access to sensitive keys/secrets;
- no private signing key in repository/CI logs/artifacts;
- separate development/staging/production credentials;
- break-glass access with approval/logging.

KMS/HSM-equivalent services should be selected with the production hosting/jurisdiction architecture rather than hard-coded prematurely.

---

## 10. Network and reverse-proxy security

Current development LAN exposure is temporary and controlled for physical-device testing.

Production requirements:
- API behind controlled TLS edge/origin configuration;
- databases and Redis never public;
- origin network restricted;
- trusted-proxy list/policy before accepting forwarded client-IP headers;
- rate limiting and abuse controls using a server-trusted client identity/IP source;
- administrative surfaces on separate hardened authorization/network boundaries where appropriate;
- no production `workers_dev`-style accidental public management surface if Cloudflare/edge tooling is used later.

---

## 11. Logging, audit and monitoring

### Never log
- passwords;
- access/refresh tokens;
- OTPs/recovery codes;
- full payment card data/CVV;
- raw KYC documents/selfies;
- provider secrets;
- private cryptographic keys.

### Security/audit events to preserve
- login success/failure patterns;
- session creation/rotation/revocation;
- refresh replay detection;
- new-device/high-risk authentication;
- MFA/passkey enrollment/removal/recovery;
- sensitive profile/security changes;
- KYC state transitions;
- Responsible Gaming mutations;
- payment intent/provider/reconciliation transitions;
- wager acceptance/result/settlement/ruleset version;
- administrative decisions;
- key/config/release changes where applicable.

Audit events must be privacy-minimized but sufficient for incident reconstruction and regulatory evidence.

---

## 12. Incident-response capability required before scale

Prepare playbooks for:
- token/session compromise;
- credential stuffing wave;
- leaked production secret;
- provider webhook signing-key compromise;
- suspicious financial activity;
- game-math/configuration defect;
- incorrect payout/settlement;
- dependency/supply-chain compromise;
- mobile release needing emergency revocation/rollback;
- database compromise/data exposure.

Capabilities should include rapid session revocation, feature/market/game kill switches where legally/technically appropriate, key rotation, release rollback and preserved evidence.

Kill switches must not rewrite already accepted game outcomes or ledger history.

---

## 13. Phase gates

### Phase 20 — Native alpha security exit

Required evidence:
- [ ] force-close/reopen secure-session behavior;
- [ ] silent refresh behavior;
- [ ] expiry/revocation behavior;
- [ ] logout/revocation behavior;
- [ ] artifact/config/log inspection;
- [ ] HTTPS production configuration validation;
- [ ] exact artifact/version/Git provenance;
- [ ] no known critical native/runtime security regression.

### Phase 21 — Production platform

Required:
- production network topology;
- managed secrets/KMS design;
- observability/alerts;
- backup/restore/DR;
- trusted proxy/IP policy;
- hardened release pipeline.

### Phase 22 — Identity/device trust

Required:
- MFA/passkeys/recovery;
- step-up;
- device attestation/risk signals;
- session idle/absolute lifetime policy;
- new-device/high-risk security notifications.

### Phases 23–29

KYC/AML, payments, game math/risk, production wager pipeline, fraud/admin, regulatory readiness and independent security assessment each remain separate gates. One passing area cannot compensate for a missing critical gate in another.

---

## 14. Security anti-goals

Vanta must not:
- rely on client obfuscation as authorization;
- store production secrets in the APK/IPA;
- trust user-supplied ownership identifiers without principal checks;
- use Redis as financial truth;
- accept a payment webhook without authentication/replay protection;
- treat KYC UI state as KYC approval;
- use a client RNG for production wagering;
- dynamically alter accepted outcomes to protect revenue;
- disable Responsible Gaming controls for VIP/marketing purposes;
- ship a debug artifact as production because it is convenient;
- claim security certification that has not occurred.

---

## 15. References

- [`phase19-security-audit.md`](./phase19-security-audit.md)
- [`session-device-security-roadmap.md`](./session-device-security-roadmap.md)
- [`../architecture/game-math-financial-risk-engine.md`](../architecture/game-math-financial-risk-engine.md)
- [`../ROADMAP.md`](../ROADMAP.md)
- [`../../SECURITY.md`](../../SECURITY.md)
