# Vanta — Production Readiness

**Status:** gate checklist. Production real-money operation is currently **BLOCKED**.

This checklist distinguishes working alpha software from an authorized production system. A green build or installable app does not satisfy this gate by itself.

## Status legend

- `GREEN` — evidenced for current scope.
- `PARTIAL` — foundation exists but production evidence is incomplete.
- `BLOCKED` — prerequisite not implemented/selected/approved.
- `DECISION REQUIRED` — product/operations/legal decision needed.

## 1. Product/release

| Gate | Status | Requirement |
|---|---|---|
| Canonical versioning | GREEN | controlled product/build identity exists |
| Dependency reproducibility | GREEN | committed lockfile + frozen installs |
| Native Android alpha build | GREEN | reproducible artifact path exists |
| iOS production path | PARTIAL | compile/distribution evidence still required |
| Final production icon/splash/copy | PARTIAL | Phase 20 polish remains |
| Release signing protection | BLOCKED | production signing process must be protected |
| Exact source provenance | PARTIAL | source-SHA correction/evidence pending |

## 2. Authentication/security

| Gate | Status |
|---|---|
| Password hashing / session foundations | GREEN for alpha |
| Refresh rotation/revocation | PARTIAL — implementation exists, remaining physical evidence |
| Authorization/ownership boundaries | PARTIAL — core boundaries exist; production review required |
| MFA/passkeys/step-up | BLOCKED |
| Recovery/security-event policy | BLOCKED |
| Managed secrets/KMS | BLOCKED |
| Artifact secret/config inspection | PARTIAL |
| Independent security assessment | BLOCKED |
| `main` protection/required checks | BLOCKED / backlog |

No unresolved known Critical vulnerability may be accepted at production authorization.

## 3. Data/privacy

| Gate | Status |
|---|---|
| PII protection foundation | PARTIAL |
| Privacy inventory | GREEN as engineering inventory |
| Retention schedule | DECISION REQUIRED |
| Rights/export/deletion operational flow | BLOCKED |
| Provider privacy/data-processing review | BLOCKED until providers selected |
| Legal/privacy texts verified and effective-dated | BLOCKED / jurisdiction dependent |

## 4. Database/financial integrity

| Gate | Status |
|---|---|
| PostgreSQL canonical truth | GREEN architecture |
| Immutable balanced ledger foundation | GREEN architecture/tests for current scope |
| Controlled production migrations | BLOCKED — startup migration model must be redesigned |
| Production backup | BLOCKED |
| Tested restore | BLOCKED |
| Production reconciliation | BLOCKED until payment provider integration |
| Idempotent production money flows | BLOCKED until complete provider path |

## 5. Gaming/risk/Responsible Gaming

| Gate | Status |
|---|---|
| Server-authoritative game principle | GREEN architecture |
| Responsible Gaming server-side foundation | PARTIAL |
| Jurisdiction-approved RG policy/config | BLOCKED / jurisdiction dependent |
| Formal production Plinko math/RTP/variance | BLOCKED |
| Bankroll/exposure/risk-of-ruin model | BLOCKED |
| Approved max stake/payout limits | BLOCKED |
| Certified/approved game configuration where required | BLOCKED / jurisdiction dependent |

## 6. KYC/payments/regulatory

| Gate | Status |
|---|---|
| KYC provider | BLOCKED — not selected |
| AML/provider operating flow | BLOCKED |
| Payment provider | BLOCKED — not selected |
| Signed/replay-safe callbacks | BLOCKED until provider integration |
| Deposit/withdraw reconciliation | BLOCKED |
| Selected launch jurisdiction | DECISION REQUIRED |
| Verified operator/license/regulator data | BLOCKED |
| Store/distribution regulatory eligibility | BLOCKED |

No UI availability may bypass these gates.

## 7. Infrastructure/operations

| Gate | Status |
|---|---|
| Local environment reproducible | GREEN |
| Staging backend/database/cache | BLOCKED / not selected |
| Production infrastructure | BLOCKED / not selected |
| Environment isolation | PARTIAL design only |
| TLS/domain/network policy | BLOCKED for production |
| Observability strategy | GREEN documentation / BLOCKED tooling |
| Central logs/metrics/alerts | BLOCKED |
| Incident response procedure | GREEN documentation / requires rehearsal |
| Deployment procedure | PARTIAL until infrastructure selected |
| Rollback procedure | PARTIAL until staging test |
| Backup/restore procedure | PARTIAL documentation / BLOCKED implementation |

## 8. Quality

| Gate | Status |
|---|---|
| CI/CodeQL/current backend validation | GREEN baseline |
| Mobile typecheck | GREEN baseline |
| Mobile critical regression coverage | PARTIAL |
| Native E2E critical paths | BLOCKED / backlog |
| Physical Android smoke | PARTIAL |
| iOS validation | PARTIAL/BLOCKED depending on physical scope |
| Accessibility/device matrix | PARTIAL |
| Performance/load evidence | BLOCKED before production sizing |

## 9. Go-live authorization

Production authorization requires explicit human approval after evidence is attached for all applicable critical gates.

Minimum rule:
- no unresolved Critical security/data-integrity issue;
- no knowingly exploitable High issue without explicit documented disposition;
- money/provider/RG/game-math gates complete;
- backup/restore/rollback/monitoring tested;
- jurisdiction/legal/provider prerequisites verified;
- exact release identified and reproducible.

## 10. Current conclusion

```text
Native Alpha: IN PROGRESS
Production Readiness: NOT MET
Real-money Production: BLOCKED
```

This is intentional. The project should advance through staging and production-readiness evidence rather than opening regulated functionality prematurely.
