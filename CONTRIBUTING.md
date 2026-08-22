# Contributing to Vanta

## Naming rules

Use names that explain responsibility without requiring repository archaeology.

- Branches: `<type>/<short-scope>`, for example `feat/plinko-gameplay` or `chore/bootstrap-monorepo`.
- React components: PascalCase and responsibility-oriented, for example `WalletBalanceCard.tsx`.
- Hooks: `use` prefix and domain intent, for example `usePlacePlinkoBet.ts`.
- Services and modules: domain-first names, never generic names such as `helpers2`, `service-new`, or `utils-final`.
- Go packages: short lowercase domain names such as `wallet`, `ledger`, `betting`, and `plinko`.
- Tests: mirror the production unit being tested.

## Commit convention

Use Conventional Commits with an explicit scope:

- `feat(mobile): add authenticated navigation shell`
- `feat(plinko): add server-authoritative bet endpoint`
- `fix(ledger): prevent duplicate settlement entries`
- `test(wallet): cover concurrent balance reservations`
- `docs(architecture): document ledger invariants`
- `chore(repo): configure monorepo tooling`
- `security(api): enforce request rate limits`

Each commit must represent one coherent change. Avoid messages such as `update`, `fix stuff`, `changes`, or version-only commit names.

## Security rules

1. Never commit secrets, private keys, credentials, production tokens, KYC documents, or real user data.
2. The mobile application is an untrusted client. Financial state and game outcomes must be authoritative on the backend.
3. Monetary operations require idempotency and auditable ledger entries.
4. Development, staging, and production configuration must remain separate.
5. Logs must not include passwords, session tokens, authentication codes, identity documents, or sensitive payment data.

## Review standard

Code should optimize for future supervision: explicit names, small modules, documented invariants, predictable folder boundaries, and tests around financial/security-sensitive behavior.
