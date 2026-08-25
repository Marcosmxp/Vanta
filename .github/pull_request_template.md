## Objective

Describe the single coherent goal of this PR.

## Product / user impact

What changes for a player, tester, operator or developer?

## Security / financial / regulatory impact

- [ ] No security-sensitive boundary changed.
- [ ] Authentication/session/security changed.
- [ ] Wallet/ledger/payment boundary changed.
- [ ] Game math/RNG/betting/settlement boundary changed.
- [ ] KYC/compliance/Responsible Gaming/legal boundary changed.
- [ ] Build/release/supply-chain boundary changed.

Explain any checked sensitive boundary and the evidence used to validate it.

## Release impact

- Release version impact: `none | patch | minor | major | prerelease iteration`
- Native build increment required: `yes | no`
- Changelog required: `yes | no`
- Migration/rollback consideration: `yes | no`

If this PR produces a distributed artifact, identify the expected `version + build + commit` provenance.

## Validation

List the exact tests, CI jobs, native-device checks, simulations or manual verification performed.

- [ ] Typecheck/tests relevant to the changed boundary pass.
- [ ] Release metadata remains synchronized (`pnpm release:check`) when applicable.
- [ ] No secret/credential/customer data was added.
- [ ] Documentation was updated when architecture, security, UX, release, game economics or regulatory assumptions changed.

## Known limitations / blockers

List anything intentionally incomplete. Do not describe a regulated or financial capability as production-ready when its prerequisites remain closed.

## Evidence / references

Link relevant issue, phase document, security finding, screenshot, artifact identity or test result where useful.
