# Phase 19 — Security Audit

## Scope

This audit covers the Phase 17 backend runtime and Phase 18 mobile/backend integration, with emphasis on authentication, session lifecycle, HTTP trust boundaries, IDOR/ownership, ledger concurrency, Responsible Gaming, support, client transport, and CI security gates.

The mobile application remains an untrusted presentation client. PostgreSQL-backed server state remains authoritative for identity, sessions, wallet/ledger, bets, KYC status, Responsible Gaming and support ownership.

## Findings fixed in Phase 19

### F19-001 — Refresh rotation was not atomic against concurrent replay

**Severity:** High

The refresh flow loaded the current session, compared the presented refresh hash and then performed an unconditional rotation update scoped only by `session_id` and `revoked_at`. Two concurrent uses of the same refresh generation could both pass the pre-check before either update became visible.

**Fix:** refresh rotation is now compare-and-swap. PostgreSQL requires the expected refresh-token hash and expected generation in the same `UPDATE`. A failed CAS is treated as replay/race and revokes the session fail-closed.

**Regression coverage:** an integration test executes two concurrent refreshes with one token generation, requires exactly one rotation winner, and verifies that replay detection revokes the session so the returned token cannot remain usable.

### F19-002 — Authentication throttle key included the ephemeral source port

**Severity:** High

Authentication handlers passed `r.RemoteAddr` directly to the Redis limiter. `RemoteAddr` normally contains `IP:port`, so reconnecting with another source port could create another bucket and weaken brute-force throttling.

**Fix:** the HTTP boundary canonicalizes the server-supplied remote IP and strips the port before the limiter hashes the subject. Invalid remote addresses collapse into a fail-safe bucket instead of becoming attacker-controlled bucket text.

**Regression coverage:** unit tests cover IPv4/IPv6 normalization, and a PostgreSQL/Redis-backed HTTP integration test performs login attempts from one IP using different ports and requires the 11th attempt to return `429`.

### F19-003 — Panic logger included arbitrary recovered values

**Severity:** Medium

The recovery middleware included the recovered panic value directly in structured logs. A panic value can contain request-derived or otherwise sensitive text.

**Fix:** panic values are no longer emitted. Internal logs retain request ID, method, path and stack metadata; the HTTP response remains a generic `internal_error`.

**Regression coverage:** middleware tests verify that a synthetic secret-bearing panic never appears in the client response.

### F19-004 — Session activity touch query had an ambiguous PostgreSQL timestamp expression

**Severity:** Medium

`TouchSession` compared `last_seen_at` against a bind parameter minus an SQL interval. PostgreSQL could infer the bind parameter as an interval in this expression and reject the query at runtime. Authentication intentionally ignored touch failures, so login/authentication still succeeded while session activity timestamps stopped updating.

**Fix:** the one-minute cutoff is calculated as a typed `time.Time` in Go and passed as its own PostgreSQL parameter. The database now compares `TIMESTAMPTZ` values directly without ambiguous operator inference.

**Regression evidence:** Phase 19 integration logs exposed the failing query before the fix; the subsequent race/integration suite completed successfully after the typed cutoff change.

### F19-005 — Reachable vulnerable Go dependencies

**Severity:** High

`govulncheck` found two vulnerabilities on call paths used by Vanta:

- `GO-2026-5970` in `golang.org/x/text v0.28.0` (infinite loop on invalid input), reachable through PostgreSQL configuration processing;
- `GO-2026-5004` in `github.com/jackc/pgx/v5 v5.7.6` (SQL placeholder confusion with dollar-quoted strings), reachable through migration/database paths.

**Fix:** `pgx/v5` was upgraded to `v5.9.2`, `golang.org/x/text` to `v0.39.0`, and the normalized transitive module graph/checksums were committed from Go 1.27 `go mod tidy` output.

**Regression coverage:** `govulncheck` is now a required pull-request gate so reachable Go vulnerabilities fail CI instead of remaining advisory-only.

## Security regression coverage added

- strict JSON rejects unknown fields, multiple objects and oversized bodies;
- server-generated request IDs override inbound values;
- production security headers include HSTS, CSP, no-store, frame denial and no-referrer;
- support request lookup is player-scoped and rejects cross-player IDOR;
- Security Center cannot revoke another player's session;
- concurrent refresh-token reuse revokes fail-closed;
- concurrent ledger debits cannot overspend the authoritative available balance;
- mobile API configuration rejects plaintext HTTP outside development;
- mobile API transport keeps bearer credentials in headers, not URLs;
- mobile transport handles `204`, structured API errors and invalid JSON deterministically.

## CI gates added

Pull requests now require:

- mobile TypeScript;
- mobile API/security tests;
- Android application export;
- Storybook Android export;
- `pnpm audit --audit-level=high`;
- Go module graph verification;
- `gofmt`;
- `go test -race ./...` including PostgreSQL/Redis integration tests;
- `go vet ./...`;
- `govulncheck`;
- API binary build;
- API Docker image build;
- Docker Compose validation;
- CodeQL JavaScript/TypeScript and Go.

## Reviewed boundaries with no new validated finding

- wallet read models remain player-scoped;
- bet history/detail queries remain player-scoped;
- Security Center session mutations include player ownership;
- Responsible Gaming options and effective dates remain server policy;
- no early time-out/self-exclusion cancellation route exists;
- support message bodies remain encrypted at rest;
- legal/regulatory data remains read-only and cannot invent a licensed state without configured data;
- access/refresh credentials remain outside navigation parameters, MMKV/AsyncStorage, logs and analytics;
- HTTP server has read-header, read, write and idle timeouts plus header-size limits;
- real-money Plinko placement and payment mutations remain closed.

## Residual risk / blockers before real-money operation

The following are intentionally **not** considered solved by Phase 19:

1. **Trusted reverse-proxy client IP policy.** `RemoteAddr` is deliberately trusted instead of arbitrary forwarding headers. Before deployment behind Cloudflare or another proxy, the origin must accept client-IP forwarding only from explicitly trusted proxy networks; otherwise throttling would see the proxy address rather than the player address.
2. **Mobile device attestation.** Play Integrity/App Attest and jailbreak/root signals are not yet enforced.
3. **MFA enrollment and step-up authentication.** Enrollment endpoints are still closed; withdrawals must not open without an approved step-up policy.
4. **KYC provider upload/liveness callbacks.** Only KYC status is integrated. Signed provider callbacks, replay protection and verified media handling remain blockers.
5. **Payment provider integration.** Deposit/withdraw execution, signed webhooks, reconciliation and destination ownership remain closed.
6. **Production Plinko betting.** No public bet-placement endpoint exists. Production rulesets, Responsible Gaming enforcement, authoritative reservation/settlement and audit must be completed before exposure.
7. **Production secrets/key management.** Development environment variables are not a production KMS/HSM strategy. Key rotation and deployment secret management require a production design.
8. **CI action immutability.** Official GitHub Actions are still referenced by major-version tags. Full commit-SHA pinning should be completed as part of repository supply-chain hardening once versions are centrally maintained.
9. **Independent external assessment.** Internal tests, CodeQL and dependency scanners do not replace an independent security review, penetration test or regulatory certification.

## Phase 19 release decision

**Phase 19 is COMPLETE / MERGED.** All required regression, dependency, vulnerability, mobile, backend, Docker and CodeQL gates passed on the final merge candidate before PR #22 was integrated into `main`.

Canonical Phase 19 main commit:

```text
b12c56928eba8e79f1c48a2361683e1e1746e224
```

This result means the current **closed-MVP boundaries** were hardened and regression-tested. It does **not** authorize real-money operation and does not remove any residual blocker listed above. Phase 20 may proceed with native builds/device validation while those regulated-production capabilities remain closed.
