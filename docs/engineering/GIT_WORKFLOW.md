# Vanta — Git Workflow

**Status:** canonical Git workflow for a solo project developed heavily with AI/Codex.

## Principle

Keep the workflow simple, reviewable and recoverable. Do not introduce branch complexity without a real operational need.

## Branch model

Current preferred flow:

```text
main
 ↑
PR
 ↑
feat/* | fix/* | security/* | docs/* | chore/* | release/* | hotfix/*
```

There is no requirement to add a permanent `development` branch while the current direct PR-to-`main` model remains effective.

Phase branches are allowed for bounded multi-part work, but future work should favor smaller branches/PRs than the current large Phase 20 branch.

## Before creating/switching branches

Always inspect:

```bash
git status
git branch --show-current
git log -5 --oneline
git remote -v
```

Preserve uncommitted work. Do not use destructive reset/clean/restore operations against developer work without explicit approval.

## Branch naming

Use responsibility-oriented names:

- `feat/<scope>`
- `fix/<scope>`
- `security/<scope>`
- `docs/<scope>`
- `chore/<scope>`
- `release/<version>`
- `hotfix/<scope-or-version>`

## Commits

Use Conventional Commits where appropriate:

- `feat(auth): ...`
- `fix(wallet): ...`
- `test(api): ...`
- `docs(engineering): ...`
- `build(android): ...`
- `ci: ...`
- `security(api): ...`

One commit should represent one coherent concern. Avoid vague messages such as `update`, `final`, `fix stuff` or `agora vai`.

## Task flow

```text
requirement/backlog item
→ Ready
→ branch
→ inspect context/current code
→ implementation plan
→ implementation
→ tests/self-review/security review when relevant
→ commit
→ PR
→ CI
→ human review
→ merge
```

## Pull requests

Use `.github/pull_request_template.md` and record:

- objective/requirement ID;
- product/user impact;
- scope control;
- testing evidence;
- security/financial/regulatory impact;
- database/environment/dependency changes;
- rollback/data-recovery implications;
- release/provenance impact;
- screenshots when relevant;
- known limitations/blockers.

Do not mark work complete solely because a build artifact exists.

## Main branch policy

`main` represents the latest integrated completed state.

Repository audit on 2026-08-26 confirms that `main` is currently **unprotected**. This is a governance gap; CI can detect failures but cannot prevent a direct push or merge while GitHub branch/ruleset protection is disabled.

### Target protection for `main`

For the current solo workflow, configure GitHub branch protection/rulesets to:

- require changes to reach `main` through a pull request;
- require the branch to be up to date before merge when practical;
- require successful checks for:
  - `Repository hygiene`;
  - `Mobile validation`;
  - `Go tests`;
  - CodeQL JavaScript/TypeScript analysis;
  - CodeQL Go analysis;
- block force pushes;
- block branch deletion;
- keep required human approvals at zero while the repository is operated by one maintainer, rather than creating an impossible self-approval requirement;
- require conversation resolution when review threads exist, if the repository settings support it without blocking the solo workflow.

The Android native build currently has path filters and is intentionally **not** a globally required merge check; requiring a conditionally skipped workflow would create stuck PRs. Native/release gates remain mandatory when the changed scope or release checklist requires them.

### Current enforcement status

- CI and CodeQL workflows exist and run on PRs to `main`.
- `Repository hygiene` additionally rejects whitespace errors and tracked secret-like files.
- Branch protection/ruleset write access is not exposed through the current repository connector used by this session, so enabling the GitHub setting remains an explicit repository-configuration action.

Do not mark `GIT-GOV-001` done until GitHub reports `main` as protected/ruleset-enforced.

## Releases

Release identity comes from root `version.json`. Tags/releases are created only after the intended artifact passes its release gates. Project phase numbers are not release versions.

## Hotfixes

A production hotfix process is not yet active because production is not live. When production exists, define a minimal `hotfix/*` path that preserves CI, review, traceability and post-fix backport/synchronization without bypassing security gates.

## Definition of Ready

A task should be Ready when:

- objective and expected user/system outcome are clear;
- requirement/backlog ID exists when the work is material;
- acceptance criteria are testable;
- relevant dependencies and environment assumptions are known;
- design/product decision exists when needed;
- database/security/regulatory risks are identified when relevant;
- unknown business/legal decisions are marked instead of invented.

## Definition of Done

Use the repository DoD in `AGENTS.md`. At minimum, for the changed scope:

- implementation satisfies acceptance criteria;
- tests/typecheck/build gates that apply are green;
- errors/loading/empty states are handled for changed flows;
- authorization/security/data impact is reviewed where relevant;
- dependency and migration changes are explicit and reproducible;
- no secret or unrelated rewrite was introduced;
- documentation/status/backlog is updated when behavior or project state changes;
- known limitations remain visible rather than hidden.
