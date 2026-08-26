# Vanta — AI/Developer Operating Contract

This file is the stable repository-level operating contract for Codex, AI-assisted development and human contributors. It applies to the entire repository unless a more specific `AGENTS.md` is intentionally added to a subdirectory later.

## Project purpose

Vanta is a native mobile gaming platform under active development. The current product combines a premium financial-product UX with original gaming capability. Plinko is the first Vanta Original.

The project is not authorized for production real-money operation merely because the application builds or an APK runs. Production wagering, live payment execution/reconciliation, production KYC/AML, MFA/passkey/step-up, final jurisdiction controls, approved game mathematics/risk and other production gates remain fail-closed until explicitly implemented and validated.

## Read context before code

For significant work, read only the context relevant to the task. Start with:

1. `docs/README.md` — documentation index and precedence.
2. `docs/VANTA_PROJECT_CONTEXT.md` — recoverable project context and permanent rules.
3. The current phase/checkpoint document when the task belongs to active phase work.
4. Relevant domain documentation under `docs/product/`, `docs/security/`, `docs/architecture/` and `docs/release/`.
5. Current code, migrations and tests for the affected boundary.

Do not treat old screenshots, historical planning, superseded ADRs or previous chat assumptions as stronger than current code and canonical documentation.

## Current technical stack

- Mobile: React Native + Expo + TypeScript.
- Backend: Go modular monolith.
- Persistent canonical database: PostgreSQL.
- Ephemeral cache/coordination/rate limiting: Redis.
- JavaScript package manager: pnpm.
- Canonical Node version for CI/development baseline: `22.13.0`.
- Canonical pnpm version: `10.15.0`.
- Canonical Go version in CI: `1.27.0`.
- Root `version.json` is the canonical release identity source.

Do not replace the framework, database, package manager, backend architecture or major infrastructure model without evidence, an explicit architectural decision and human approval.

## Architecture invariants

- The mobile client is untrusted.
- Authentication and authorization are server-authoritative.
- Financial state and regulated state are server-authoritative.
- PostgreSQL is canonical persistent financial/regulatory truth.
- Redis is never financial truth.
- The ledger is auditable and append-oriented; do not replace it with a mutable user-balance field as financial truth.
- Game outcome generation, wager acceptance, payout resolution and settlement remain server-authoritative.
- Responsible Gaming restrictions cannot be weakened by client state.
- KYC/eligibility decisions cannot be fabricated in the client.
- Payment confirmation/reconciliation cannot depend only on frontend state.
- Route visibility is not authorization.
- Keep the modular monolith unless independent operational/scaling evidence justifies a different boundary.

## Before modifying anything

1. Inspect `git status`, current branch and relevant recent history.
2. Preserve uncommitted work. Never assume the working tree is disposable.
3. Inspect relevant code, tests, docs and configuration before proposing a change.
4. Identify the task objective, acceptance criteria, affected boundary and risks.
5. Prefer the smallest change that solves the verified problem.

Never use destructive commands such as `git reset --hard`, `git clean -fd`, blanket restore/checkout or equivalent destructive operations against developer work without explicit approval.

## Dependency rules

- Use pnpm only for the JavaScript workspace.
- `pnpm-lock.yaml` is committed and authoritative for dependency resolution.
- Use `pnpm install --frozen-lockfile` for controlled installs and CI-compatible validation.
- Do not hand-edit or fabricate the lockfile.
- Dependency declaration changes must update the lockfile.
- Do not install a package merely for convenience.
- Before adding a dependency, evaluate necessity, existing-stack alternatives, maintenance, security, license, bundle/runtime impact and transitive cost.
- Do not perform broad dependency upgrades while fixing an unrelated issue.

## Database rules

- Schema evolution must be reproducible and versioned through migrations.
- Do not edit production data manually as a substitute for a migration.
- Never execute destructive production migrations without explicit approval.
- Before `DROP`, destructive `ALTER`, mass `DELETE`, `TRUNCATE` or irreversible data transformation, document impact, compatibility, data migration strategy, rollback and production risk.
- Preserve existing migration history; do not rewrite already-applied migrations merely for style.
- Validate business, authorization and financial invariants at the server boundary, not only in the mobile UI.

## Security rules

- Never expose or commit secrets, private keys, real credentials, production tokens, identity documents, payment secrets or real customer data.
- Never commit real `.env` files. Keep placeholders/documentation in `.env.example` only.
- Do not log passwords, access/refresh tokens, OTPs, recovery codes, raw identity documents or sensitive payment data.
- Do not move server authority into the client to simplify UI, animation or demos.
- Do not weaken authentication, authorization, Responsible Gaming, KYC, payment or financial controls to make a test/demo pass.
- Changes to authentication, authorization, sessions, cryptography, payments, financial state, game math, permissions, KYC or Responsible Gaming require an additional security/regression review.
- Sensitive production capabilities remain fail-closed when prerequisites are missing.

Read `SECURITY.md` and the relevant security documentation for security-sensitive work.

## Coding rules

- Preserve existing architecture and established domain boundaries unless change is justified by evidence.
- Prefer explicit names and responsibility-oriented modules.
- Keep changes scoped; do not refactor unrelated code for stylistic preference.
- Do not hide failing tests.
- Do not silence TypeScript/linter/compiler errors without a documented reason.
- Do not introduce `any`, `@ts-ignore`, unsafe double assertions or equivalent bypasses merely to make typechecking pass.
- Validate data at external/API boundaries.
- Empty collections returned by APIs should be represented consistently and clients should normalize defensive boundaries where appropriate.
- Error handling must preserve useful domain/infrastructure distinctions without exposing sensitive internals to players.
- Player-facing UI must use product language, not backend/API/ledger/debug implementation explanations unless legally/safety required.
- For supported player locales, do not introduce new player-facing hard-coded copy outside the localization system without a deliberate reason.

## Testing and validation commands

Run the smallest relevant set during development and the full affected gate before considering significant work complete.

### Root/mobile

```bash
pnpm install --frozen-lockfile
pnpm release:check
pnpm mobile:typecheck
pnpm mobile:test
pnpm --filter @vanta/mobile app:validate
pnpm --filter @vanta/mobile storybook:validate
```

On Windows PowerShell where script execution blocks `pnpm.ps1`, use `pnpm.cmd` instead of weakening the machine execution policy merely for this repository.

### Backend

From `backend/` when appropriate:

```bash
go mod tidy
git diff --exit-code -- go.mod go.sum
gofmt -l .
go test -race ./...
go vet ./...
go run golang.org/x/vuln/cmd/govulncheck@v1.7.0 ./...
go build ./cmd/api
```

Use the repository CI/Compose configuration for PostgreSQL/Redis integration validation rather than inventing alternate service versions.

Do not claim a change is validated if the relevant command was not run or CI evidence is unavailable. Record `NOT RUN`, `BLOCKED` or the real failure instead.

## Release/version rules

- Root `version.json` is the canonical release version/build source.
- Do not independently edit generated/version mirrors when `release:sync` owns them.
- Use `pnpm release:check` to detect drift.
- When intentionally changing release identity, update `version.json`, run `pnpm release:sync`, review generated changes and update `CHANGELOG.md` when user/security/distribution behavior changes.
- Do not create a Git tag or GitHub Release only because code compiles.
- Release artifacts require version + native build + source Git provenance and applicable release gates.
- Project phase numbers are not software versions.

## Git workflow

- Follow the branch and Conventional Commit conventions in `CONTRIBUTING.md`.
- Prefer one coherent concern per commit.
- Prefer small scoped branches/PRs for future work instead of accumulating unrelated changes.
- Do not force-push shared work without explicit reason/approval.
- Do not merge a phase/release PR before its documented exit criteria are satisfied.
- A passing APK is not by itself Definition of Done.

## AI task workflow

For every non-trivial task:

```text
TASK
→ READ RELEVANT CONTEXT
→ INSPECT CURRENT IMPLEMENTATION
→ DEFINE/CONFIRM ACCEPTANCE CRITERIA
→ PLAN
→ IMPLEMENT SMALL SCOPED CHANGE
→ TEST
→ SELF REVIEW
→ SECURITY REVIEW WHEN RELEVANT
→ UPDATE DOCUMENTATION WHEN BEHAVIOR CHANGED
→ SUMMARIZE EVIDENCE/LIMITATIONS
→ HUMAN REVIEW
→ COMMIT/PR
```

A task should identify, when applicable:

- ID or clear title;
- objective;
- relevant modules/files;
- acceptance criteria;
- constraints;
- required tests;
- security/data/release impact.

If another issue is discovered while implementing a task, fix it only when necessary for correctness/security of the current task. Otherwise record it as follow-up/backlog/technical debt rather than silently expanding scope.

## Self-review checklist

Before presenting significant work as complete, review:

- correctness;
- requested scope;
- architecture boundaries;
- types and validation;
- error/loading/empty states where applicable;
- authentication/authorization implications;
- security/privacy;
- financial/data integrity;
- performance impact where relevant;
- regression coverage;
- documentation consistency;
- dependency/environment/database changes;
- unrelated changes.

## Definition of Done

A task is Done only when applicable criteria are satisfied:

- requested behavior implemented;
- acceptance criteria met;
- relevant typecheck/lint-equivalent checks pass;
- relevant tests pass;
- relevant build/bundle validation passes;
- errors/loading/empty states handled for affected UI;
- permissions/authorization checked for affected protected resources;
- security review completed for sensitive changes;
- documentation updated when behavior or invariants changed;
- lockfile updated for dependency changes;
- migrations included/reviewed for schema changes;
- no secret or unrelated change introduced;
- known limitations/follow-ups recorded honestly.

For player-facing mobile work, also consider supported screen sizes, accessibility, Reduce Motion, localization and physical-device validation when the change depends on native/runtime behavior.

## Documentation rules

- Do not create empty documents merely to satisfy a template.
- Do not duplicate an existing canonical document when updating/organizing it is sufficient.
- Follow the precedence defined in `docs/README.md`.
- When architecture, security, game math, financial invariants, product UX principles, version/release policy or milestone state changes, update the relevant canonical documentation in the same PR.
- Mark unknown information as `UNKNOWN`, `TODO` or `DECISION REQUIRED`; do not invent business, legal, regulatory or product facts.
- Record recurring non-sensitive failures in the appropriate troubleshooting/runbook documentation with symptom, root cause, fix and verification.

## Production and infrastructure safety

- Never deploy to production without explicit human authorization.
- Never execute production migrations automatically as part of ad-hoc development work.
- Never alter critical production infrastructure, DNS, signing, secrets or access controls without documenting impact and obtaining explicit approval.
- Preview/staging work is allowed only when it is safe, scoped and uses the correct environment.
- Do not fabricate licensing/operator/regulator status.

## Stable principle

Optimize for correctness, maintainability, security, clarity, traceability, reproducibility and testability — not for the number of files changed or code produced.
