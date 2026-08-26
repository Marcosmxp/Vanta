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

- objective;
- product/user impact;
- changes;
- testing evidence;
- security/financial/regulatory impact;
- database/environment/dependency changes;
- breaking changes;
- screenshots when relevant;
- known limitations/blockers.

Do not mark work complete solely because a build artifact exists.

## Main branch policy

`main` represents the latest integrated completed state.

Current repository audit found that branch protection is not yet enforced. **Before production**, configure protection/rules so important CI/security checks cannot be bypassed accidentally and force-push/deletion risk is controlled.

## Releases

Release identity comes from root `version.json`. Tags/releases are created only after the intended artifact passes its release gates. Project phase numbers are not release versions.

## Hotfixes

A production hotfix process is not yet active because production is not live. When production exists, define a minimal `hotfix/*` path that preserves CI, review, traceability and post-fix backport/synchronization without bypassing security gates.

## Definition of Ready

A task should be Ready when objective, acceptance criteria, dependencies and major risks are known. Unknown business/legal decisions should be marked rather than invented.

## Definition of Done

Use the repository DoD in `AGENTS.md`. Relevant tests/build/security/documentation must be complete before merge.
