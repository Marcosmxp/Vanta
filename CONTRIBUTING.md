# Contributing to Vanta

## Naming rules

Use names that explain responsibility without repository archaeology.

- Branches: `<type>/<short-scope>`, e.g. `feat/plinko-gameplay`, `fix/login-error-state`, `docs/product-strategy`.
- React components: PascalCase and responsibility-oriented.
- Hooks: `use` prefix + domain intent.
- Services/modules: domain-first; never `helpers2`, `service-new`, `utils-final`.
- Go packages: short lowercase domain names.
- Tests: mirror the production boundary being tested.

Project phase names are project-management labels and are not application versions.

## Commit convention

Use Conventional Commits with an explicit useful scope:

- `feat(mobile): add authenticated navigation shell`
- `feat(ui): animate bottom navigation`
- `fix(auth): clear stale login error`
- `fix(wallet): normalize null transactions`
- `test(wallet): cover concurrent balance reservations`
- `docs(strategy): consolidate product and business goals`
- `build(android): add native build provenance`
- `chore(release): prepare v0.1.0-alpha.1`
- `security(api): enforce request rate limits`

Each commit should represent one coherent concern. Avoid `update`, `fix stuff`, `changes`, `final`, `final2` and unrelated changes in one commit.

A canonical-documentation synchronization may update several docs in one grouped `docs(...)` commit when its single purpose is preserving one project checkpoint.

## Branch convention

```text
feat/<scope>
fix/<scope>
security/<scope>
docs/<scope>
chore/<scope>
release/<version>
hotfix/<version-or-scope>
```

Phase branches are allowed for bounded multi-part work, but the phase number is not the software version.

## Version/release rules

Read [`docs/release/versioning-and-release-governance.md`](./docs/release/versioning-and-release-governance.md).

Key rules:
- SemVer product versions;
- alpha/beta/rc prerelease channels;
- monotonically increasing Android/iOS build numbers;
- Git tag points to exact release commit;
- artifact records version/build/Git SHA;
- release notes/changelog;
- no random version names.

## Security rules

1. Never commit secrets, private keys, credentials, production tokens, identity documents or real user data.
2. Mobile is untrusted.
3. Financial and game authority remains backend-owned.
4. Monetary operations require idempotency and auditable ledger entries.
5. Development/staging/production stay separate.
6. Logs must not contain passwords, session tokens, OTPs, identity documents or sensitive payment data.
7. Do not move authoritative outcome or settlement decisions into the client for animation convenience.
8. Do not weaken account, identity, Responsible Gaming or security controls to make a demo pass.
9. Security-sensitive changes require appropriate tests and updated documentation.

## Player UX copy rule

Do not place developer implementation explanations in normal player UI unless needed for legal/safety disclosure.

Prefer explaining what the user can do, what is unavailable, what action is required and what happened. Keep architecture details such as ledger/read-model/internal settlement implementation in developer or audit docs.

## Documentation rule

When work changes architecture, security, game math, financial invariants, product UX principles, version/release policy, regulation/business strategy or phase status, update the corresponding canonical documentation in the same PR.

Recurring non-sensitive failures should be added to the relevant troubleshooting record.

## Review standard

Optimize for future supervision: explicit names, small modules, documented invariants, predictable folders, tests around sensitive boundaries and traceable release metadata.

A PR is not complete because an APK opens. Validate the boundary that the PR claims to change.
