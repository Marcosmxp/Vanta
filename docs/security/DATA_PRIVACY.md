# Vanta — Data Privacy Model

**Status:** engineering/privacy inventory.  
**Important:** this file is not legal advice and does not invent a lawful basis, retention period or regulator requirement. Missing legal/product decisions are marked explicitly.

## 1. Principle

Collect and retain only data needed for account operation, security, financial integrity, support, Responsible Gaming, legal obligations and product operation. Data minimization and purpose limitation should be preserved as integrations are added.

## 2. Current data categories

### Account and identity
Current schema includes:
- encrypted email plus keyed lookup hash and masked representation;
- display name;
- masked phone representation;
- country code;
- age-verification state;
- KYC/account state;
- language preference;
- marketing opt-in state.

### Authentication/session
- password hash;
- session identifiers;
- access/refresh token hashes;
- token expiry/generation/revocation state;
- device label/platform;
- masked IP representation;
- MFA/trust metadata.

### Financial/game
- wallet identifier/currency;
- ledger transactions and entries;
- payment-intent metadata;
- betting records, stake/payout/ruleset data;
- idempotency/audit references.

### KYC
- provider name/reference when integrated;
- verification status/rejection code.

Raw identity documents/selfies are not represented as normal repository data and must not be committed or logged.

### Responsible Gaming
- active/pending limits;
- time-out/self-exclusion state and timestamps;
- jurisdiction policy/options.

### Support/legal/audit
- encrypted support-message content;
- support request metadata/status;
- legal document/disclosure configuration;
- audit events and safe metadata.

## 3. Storage and protection

PostgreSQL is the canonical persistent store. Redis is ephemeral and must not become an unofficial personal-data store without explicit review.

Current protection includes encrypted fields for selected PII/support content and keyed lookup hashes where search is required.

Production encryption-key storage/rotation is `BLOCKED / DECISION REQUIRED` pending managed KMS/secret-manager selection.

## 4. Public mobile configuration

`EXPO_PUBLIC_*` values are embedded into the application binary and are public. They must never contain personal data, credentials, tokens, database URLs, provider secrets or private keys.

## 5. Logging

Never log:
- passwords;
- access/refresh tokens;
- OTP/recovery material;
- encryption/signing keys;
- full payment credentials;
- raw KYC documents;
- sensitive support bodies;
- unnecessary PII.

Prefer request IDs, event codes, safe masked identifiers and outcome/status fields.

## 6. Third parties

Current development/tooling services are listed in `docs/operations/EXTERNAL_SERVICES.md`.

Production PSP, KYC/AML and other regulated providers are not yet selected. Their data-processing roles, subprocessors, data residency, retention and deletion behavior must be reviewed before integration.

## 7. Retention

`DECISION REQUIRED`.

Retention must eventually be defined per data class and jurisdiction. Financial, security, Responsible Gaming, KYC and legal records may have different mandatory retention requirements. Do not invent one global retention duration.

The implementation must support a documented distinction between:
- data that may be deleted on account closure;
- data that must be retained for legal/security/financial reasons;
- anonymized/aggregated analytics where appropriate.

## 8. User rights and deletion/export

`PARTIAL / NOT IMPLEMENTED AS A COMPLETE PRODUCT FLOW`.

Before production, define and test procedures for applicable rights such as access/export, correction, deletion/erasure where permitted, consent/marketing changes and complaints.

Account deletion must map effects across:
- player profile;
- sessions;
- KYC/provider references;
- support data;
- external providers;
- files if introduced;
- records that must legally remain immutable/retained.

Do not cascade-delete financial/audit evidence merely to simplify account deletion.

## 9. Legal basis and notices

`LEGAL DECISION REQUIRED` per jurisdiction and data purpose.

Engineering must not invent lawful bases. Legal documents should be versioned, effective-dated and configured only from verified operator/regulatory information.

## 10. Privacy change control

Any new field, analytics SDK, ad/marketing SDK, provider, file upload, location/device signal or cross-border transfer requires a privacy review covering purpose, necessity, storage, retention, access, third parties and deletion/export implications.
