# Vanta Documentation Index

This directory is the canonical documentation source for the Vanta project. Root [`AGENTS.md`](../AGENTS.md) is the permanent operating contract for Codex/AI-assisted development and human contributors.

## Read first

For a new ChatGPT/Codex/developer session, use this order:

1. [`../AGENTS.md`](../AGENTS.md) — stable engineering/AI operating rules, safety boundaries, validation and Definition of Done.
2. [`product/PROJECT.md`](./product/PROJECT.md) — what Vanta is, target user, product boundary, business direction and success criteria.
3. [`project/STATUS.md`](./project/STATUS.md) — current version, milestone, completed/in-progress/blocked work and next priorities.
4. [`product/MVP.md`](./product/MVP.md) — current Native Alpha scope and exit criteria.
5. [`product/REQUIREMENTS.md`](./product/REQUIREMENTS.md) — stable product/domain requirement IDs and status.
6. [`project/BACKLOG.md`](./project/BACKLOG.md) — prioritized actionable work.
7. [`engineering/ARCHITECTURE.md`](./engineering/ARCHITECTURE.md) — current implemented system architecture and boundaries.
8. [`engineering/COMPONENTS.md`](./engineering/COMPONENTS.md) — mobile/backend component responsibility map.
9. [`engineering/DATABASE.md`](./engineering/DATABASE.md) — database, ledger and migration rules.
10. [`engineering/CODING_STANDARDS.md`](./engineering/CODING_STANDARDS.md) — TypeScript/Go/SQL implementation standards.
11. [`engineering/DEPENDENCIES.md`](./engineering/DEPENDENCIES.md) — dependency and lockfile change control.
12. [`engineering/GIT_WORKFLOW.md`](./engineering/GIT_WORKFLOW.md) — branch/commit/PR workflow.
13. [`security/SECURITY_MODEL.md`](./security/SECURITY_MODEL.md) — canonical security model and production security gaps.
14. [`security/DATA_PRIVACY.md`](./security/DATA_PRIVACY.md) — personal-data inventory and privacy engineering boundaries.
15. [`quality/TESTING.md`](./quality/TESTING.md) — testing strategy, commands, baseline and regression rules.
16. [`quality/PRODUCTION_READINESS.md`](./quality/PRODUCTION_READINESS.md) — consolidated go-live gate; production is currently blocked.
17. [`operations/README.md`](./operations/README.md) — environment, deployment, rollback, backup, observability, incident and external-service procedures.
18. [`project/TECH_DEBT.md`](./project/TECH_DEBT.md) and [`project/RISKS.md`](./project/RISKS.md) — known debt and risk register.
19. [`VANTA_PROJECT_CONTEXT.md`](./VANTA_PROJECT_CONTEXT.md) — recoverable historical/project context and permanent background.
20. [`VANTA_PRODUCT_BUSINESS_STRATEGY.md`](./VANTA_PRODUCT_BUSINESS_STRATEGY.md) — strategic product/business/game-economics/regulatory direction.
21. [`ROADMAP.md`](./ROADMAP.md) — sequenced technical, security, regulatory and commercial execution.
22. Relevant detailed domain documentation under `product/`, `security/`, `architecture/`, `release/` and `operations/`.
23. [`PHASE_HISTORY.md`](./PHASE_HISTORY.md) — chronological delivery history.

For small scoped tasks, do not mechanically reread every document. Read the minimum relevant context required by `AGENTS.md`.

## Canonical product/project records

### Product
- [`product/PROJECT.md`](./product/PROJECT.md)
- [`product/MVP.md`](./product/MVP.md)
- [`product/REQUIREMENTS.md`](./product/REQUIREMENTS.md)
- [`product/README.md`](./product/README.md)

### Project management
- [`project/STATUS.md`](./project/STATUS.md)
- [`project/BACKLOG.md`](./project/BACKLOG.md)
- [`project/TECH_DEBT.md`](./project/TECH_DEBT.md)
- [`project/RISKS.md`](./project/RISKS.md)

## Engineering and quality

Canonical engineering summaries:
- [`engineering/ARCHITECTURE.md`](./engineering/ARCHITECTURE.md)
- [`engineering/COMPONENTS.md`](./engineering/COMPONENTS.md)
- [`engineering/DATABASE.md`](./engineering/DATABASE.md)
- [`engineering/CODING_STANDARDS.md`](./engineering/CODING_STANDARDS.md)
- [`engineering/DEPENDENCIES.md`](./engineering/DEPENDENCIES.md)
- [`engineering/GIT_WORKFLOW.md`](./engineering/GIT_WORKFLOW.md)
- [`quality/TESTING.md`](./quality/TESTING.md)
- [`quality/PRODUCTION_READINESS.md`](./quality/PRODUCTION_READINESS.md)

Detailed/historical architecture records remain under `architecture/`; the engineering files above summarize the current canonical operating model rather than deleting those records.

## Security, privacy and operations

- [`security/README.md`](./security/README.md) — security documentation index.
- [`security/SECURITY_MODEL.md`](./security/SECURITY_MODEL.md) — current security model.
- [`security/DATA_PRIVACY.md`](./security/DATA_PRIVACY.md) — engineering privacy inventory; legal/retention decisions remain explicit when unknown.
- [`operations/README.md`](./operations/README.md) — operations index.
- [`operations/ENVIRONMENTS.md`](./operations/ENVIRONMENTS.md)
- [`operations/DEPLOYMENT.md`](./operations/DEPLOYMENT.md)
- [`operations/ROLLBACK.md`](./operations/ROLLBACK.md)
- [`operations/BACKUP.md`](./operations/BACKUP.md)
- [`operations/OBSERVABILITY.md`](./operations/OBSERVABILITY.md)
- [`operations/INCIDENT_RESPONSE.md`](./operations/INCIDENT_RESPONSE.md)
- [`operations/EXTERNAL_SERVICES.md`](./operations/EXTERNAL_SERVICES.md)

These operations documents describe the current development baseline and future gates. They do **not** claim that staging/production hosting, providers, KMS, monitoring, backups or incident tooling are already implemented.

## Product experience standards

- [`product/ux-motion-guidelines.md`](./product/ux-motion-guidelines.md)
- [`product/player-copy-content-guidelines.md`](./product/player-copy-content-guidelines.md)

Player-facing copy must explain actions/status/safety, not internal ledger/API/server implementation detail.

## Active Phase 20 records

Phase 20 is in PR #24 on `feat/phase20-native-builds`.

- [`release/phase20-native-builds.md`](./release/phase20-native-builds.md)
- [`release/phase20-device-smoke-test.md`](./release/phase20-device-smoke-test.md)
- [`release/phase20-troubleshooting-and-findings.md`](./release/phase20-troubleshooting-and-findings.md)
- [`release/versioning-and-release-governance.md`](./release/versioning-and-release-governance.md)

## Detailed architecture/security records

Current detailed references include:
- [`architecture/README.md`](./architecture/README.md)
- [`architecture/backend-runtime-phase17.md`](./architecture/backend-runtime-phase17.md)
- [`architecture/mobile-backend-integration.md`](./architecture/mobile-backend-integration.md)
- [`architecture/game-math-financial-risk-engine.md`](./architecture/game-math-financial-risk-engine.md)
- [`security/phase19-security-audit.md`](./security/phase19-security-audit.md)
- [`security/phase20-security-architecture.md`](./security/phase20-security-architecture.md)
- [`security/session-device-security-roadmap.md`](./security/session-device-security-roadmap.md)

## Documentation precedence

When two sources conflict, use this precedence:

1. Current code/migrations/tests on the branch intentionally being developed for implementation truth.
2. Root `AGENTS.md` for stable operating/safety/development rules.
3. Current canonical product/project/engineering/security/privacy/quality/operations records for present scope and policy.
4. Current `main` for last completed/merged repository state.
5. `docs/VANTA_PROJECT_CONTEXT.md` for recoverable context/background.
6. Current dated context checkpoint for an in-progress phase.
7. `docs/VANTA_PRODUCT_BUSINESS_STRATEGY.md` for strategic intent.
8. `docs/ROADMAP.md` for sequenced future execution.
9. Current detailed domain specs and release records.
10. `docs/PHASE_HISTORY.md` and older ADR/bootstrap/historical planning evidence.

A branch document may intentionally describe in-progress state newer than `main`; it must not be confused with already-merged production truth.

## Known historical/outdated categories

Do not treat these as current truth without checking canonical docs:
- former product name `AURABET`;
- Figma-first workflow plans;
- pre-Phase-17 backend-contract-only descriptions;
- pre-Phase-18 disconnected mobile-provider descriptions;
- historical milestone label `v0.0.0.1` as a controlled native release;
- docs claiming production payment/identity/MFA/game operations already exist;
- licensing claims without verified operator/license data;
- player UI copy exposing internal ledger/settlement/read-model/server details;
- plans allowing player-specific outcome manipulation to protect operator profit.

## Maintenance rule

When architecture, security/privacy boundaries, product scope, requirements, UX, build/release, compliance, game economics, milestone state or operations change, update the relevant canonical documentation in the same scoped work.

When a recurring operational failure becomes concrete enough for commands to be accurate and testable, add a runbook. Do not create empty/template-only runbooks merely to satisfy a folder structure.

When implementation diverges from an approved requirement/product/security/math rule, record it as implementation debt/backlog instead of silently weakening the specification.
