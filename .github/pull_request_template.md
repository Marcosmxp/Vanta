## Objective

Describe the single coherent goal of this PR and, when available, the requirement/backlog ID.

## Product / user impact

What changes for a player, tester, operator or developer?

## Scope control

- [ ] The PR addresses one coherent objective.
- [ ] Unrelated findings were recorded separately instead of silently expanding scope.
- [ ] Existing architecture was preserved unless the change is explicitly justified.

## Security / financial / regulatory impact

- [ ] No security-sensitive boundary changed.
- [ ] Authentication/session/security changed.
- [ ] Wallet/ledger/payment boundary changed.
- [ ] Game math/RNG/betting/settlement boundary changed.
- [ ] KYC/compliance/Responsible Gaming/legal boundary changed.
- [ ] Build/release/supply-chain boundary changed.

Explain any checked sensitive boundary and the evidence used to validate it.

## Database / data impact

- Schema change: `none | additive | destructive | migration-only`
- Migration: `none | <migration file>`
- Backward compatibility: `n/a | compatible | requires coordination`
- Rollback/data-recovery consideration: `n/a | documented below`

Never execute or hide a destructive production migration inside a normal PR description.

## Dependencies / environment

- Dependencies added/changed: `none | list`
- `pnpm-lock.yaml` updated when package manifests changed: `n/a | yes`
- New/changed environment variables: `none | list names only`
- Secret values included in this PR: **must be no**

For every new dependency, state why the existing stack could not reasonably solve the problem.

## Release impact

- Release version impact: `none | patch | minor | major | prerelease iteration`
- Native build increment required: `yes | no`
- Changelog required: `yes | no`
- Migration/rollback consideration: `yes | no`

If this PR produces a distributed artifact, identify the expected `version + build + source commit` provenance.

## Validation

List the exact tests, CI jobs, native-device checks, simulations or manual verification performed.

- [ ] Relevant TypeScript/Go tests pass.
- [ ] Mobile typecheck passes when mobile/TypeScript changed.
- [ ] Relevant build/bundle validation passes.
- [ ] Release metadata remains synchronized (`pnpm release:check`) when applicable.
- [ ] Repository hygiene/secret-file gate passes.
- [ ] CodeQL/security checks pass when applicable.
- [ ] Loading/error/empty states were considered for changed user flows.
- [ ] Accessibility/Reduce Motion/device layout were considered when UI behavior changed.
- [ ] No secret/credential/customer data was added.
- [ ] Documentation was updated when architecture, security, UX, release, game economics, operations or regulatory assumptions changed.

Do not check a box unless there is evidence for it. Record unavailable/skipped validation explicitly.

## Self-review

- [ ] Correctness and acceptance criteria reviewed.
- [ ] Authorization/data ownership reviewed where relevant.
- [ ] Error handling reviewed.
- [ ] No unnecessary `any`, `@ts-ignore`, disabled lint/test, swallowed failure or unrelated rewrite introduced.
- [ ] Performance impact considered where relevant.
- [ ] Known limitations/follow-up tasks recorded.

## Known limitations / blockers

List anything intentionally incomplete. Do not describe a regulated, financial, security or operational capability as production-ready when its prerequisites remain closed.

## Evidence / references

Link relevant issue, requirement, phase document, security finding, screenshot, artifact identity or test result where useful.
