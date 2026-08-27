# Vanta — Risk Register

Scale: Probability `Low / Medium / High`; Impact `Low / Medium / High / Critical`.

## RISK-001 — Unauthorized production capability opened early
- Category: Security / Product / Regulatory
- Probability: Medium
- Impact: Critical
- Description: UI or implementation progress could be mistaken for authorization to enable real-money game/payment/KYC operations before provider/regulatory/security gates exist.
- Mitigation: fail-closed production boundaries, explicit requirements/roadmap, security review, no production deploy without approval.
- Status: Active.

## RISK-002 — Financial integrity/reconciliation failure
- Category: Technical / Data / Security
- Probability: Medium
- Impact: Critical
- Description: incorrect balance, settlement, payment or reconciliation logic could create financial loss or inconsistent player records.
- Mitigation: server authority, PostgreSQL canonical ledger, idempotency, transactional processing, reconciliation, focused tests and production provider gates.
- Status: Controlled foundation; production work pending.

## RISK-003 — Game mathematics/exposure insufficiently proven
- Category: Product / Financial / Technical
- Probability: Medium
- Impact: Critical
- Description: positive expected house edge alone does not prove safe bankroll/exposure; tail payouts and aggregate exposure can still create unacceptable loss.
- Mitigation: analytical probability/RTP, independent checks, simulation, variance/tail analysis, max stake/payout, bankroll/risk-of-ruin and aggregate exposure gates before production.
- Status: Production blocker.

## RISK-004 — Account/session compromise
- Category: Security
- Probability: Medium
- Impact: High/Critical
- Description: stolen/replayed sessions or weak recovery/step-up controls can expose accounts and future financial actions.
- Mitigation: short access tokens, rotating hashed refresh tokens, replay/race revocation, SecureStore, throttling, planned MFA/passkeys/step-up/device risk and revocation policies.
- Status: Active; alpha foundation implemented, production hardening pending.

## RISK-005 — Mobile/API/database contract drift
- Category: Technical / Data
- Probability: High
- Impact: High
- Description: independently evolving validation, locale, collection or domain contracts can cause runtime crashes or inconsistent behavior.
- Evidence: password-policy/locale divergence and empty-collection crashes found during Phase 20.
- Mitigation: server authority, boundary normalization, canonical requirements, focused contract tests, migration/API review.
- Status: Active.

## RISK-006 — Native mobile regression escapes manual testing
- Category: Quality
- Probability: Medium/High
- Impact: High
- Description: limited automated mobile behavioral/E2E coverage can allow session/navigation/API-boundary crashes into artifacts.
- Mitigation: strict typecheck, boundary tests, physical smoke, Storybook/app bundle validation, add focused mobile regression/E2E tests.
- Status: Active.

## RISK-007 — Supply-chain/dependency drift
- Category: Security / Infrastructure
- Probability: Medium
- Impact: High
- Description: dependency changes or unsafe lifecycle scripts can affect build integrity.
- Mitigation: committed `pnpm-lock.yaml`, frozen installs, pinned toolchain, dependency audit, CodeQL, Dependabot, deliberate build-script/dependency review.
- Status: Reduced by BASE-001; warnings remain.

## RISK-008 — Release provenance ambiguity
- Category: Infrastructure / Security
- Probability: Medium
- Impact: High
- Description: artifact metadata may record a synthetic PR merge SHA instead of the exact source branch commit.
- Mitigation: explicit source SHA derivation and version/build/commit metadata; no release tag until artifact provenance is verified.
- Status: Open.

## RISK-009 — Regulatory/jurisdiction assumptions
- Category: Product / External dependency
- Probability: High
- Impact: Critical
- Description: treating Europe/world or current developer location as one launch market can produce incorrect legal, RG, tax, KYC, payment or language assumptions.
- Mitigation: jurisdiction-by-jurisdiction decision package, qualified legal/tax review, verified operator/regulator/license data only.
- Status: Production blocker / decision required.

## RISK-010 — Provider dependency/failure
- Category: External dependency
- Probability: Medium
- Impact: High
- Description: future KYC, PSP, email/notification, fraud or monitoring services can fail, change pricing or impose constraints.
- Mitigation: service register, timeout/retry/idempotency, failure states, reconciliation, criticality/fallback analysis and cost review before selection.
- Status: Future production risk.

## RISK-011 — Missing production backup/restore/incident capability
- Category: Operations / Data
- Probability: Medium
- Impact: Critical
- Description: code can be production-capable while recovery operations remain unproven.
- Mitigation: documented backup retention, restore tests, rollback, observability, incident response and runbooks before production gate.
- Status: Production blocker.

## RISK-012 — Documentation drift / AI context loss
- Category: Technical / Documentation
- Probability: Medium
- Impact: High
- Description: AI-assisted development across many sessions can reintroduce old decisions or expand scope when permanent context is missing/stale.
- Mitigation: root `AGENTS.md`, canonical docs/precedence, task IDs/acceptance criteria, small changes, docs updated with behavior.
- Status: Reduced by foundation work; ongoing maintenance required.

## RISK-013 — Premature architecture complexity
- Category: Technical / Cost
- Probability: Medium
- Impact: Medium/High
- Description: introducing microservices/Kubernetes/queues or broad rewrites without evidence can slow a solo project and increase failure surface.
- Mitigation: preserve modular monolith; evidence-before-refactor rule; dependency/change control.
- Status: Controlled policy.

## RISK-014 — Premature commercial scaling
- Category: Product / Cost
- Probability: Medium
- Impact: High
- Description: scaling acquisition before retention, LTV/CAC, provider costs, fraud loss and bankroll economics are understood can destroy capital.
- Mitigation: controlled pilot, cohort metrics, contribution margin, CAC/LTV/payback gates, suspend negative channels.
- Status: Future commercial gate.

## RISK-015 — Single-developer operational concentration
- Category: Technical / Operations
- Probability: Medium
- Impact: High
- Description: project knowledge, environment setup and operational decisions can become concentrated in one local machine/session.
- Mitigation: reproducible setup, canonical docs, CI, version control, backups, runbooks, explicit decisions and automation.
- Status: Active; foundation work reducing risk.

## Risk review rule

Review risks at meaningful milestones, before high-risk changes and before production authorization. Do not lower a risk merely because code exists; require evidence that the mitigation works.
