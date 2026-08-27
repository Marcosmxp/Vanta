# Vanta — Coding Standards

**Status:** canonical repository coding rules. `AGENTS.md` remains the top-level operational contract.

## General

- Prefer small, scoped changes.
- Preserve established module boundaries.
- Do not rewrite working code for style alone.
- Use explicit names that communicate responsibility.
- Validate external data at boundaries.
- Handle loading, empty and error states deliberately.
- Do not hide failing checks or bypass typing merely to make CI green.
- Player-facing language belongs in localization, not hard-coded ad hoc strings.
- Technical implementation detail belongs in engineering/security docs rather than normal player UI.

## TypeScript / React Native

The mobile project uses strict TypeScript with:

- `strict: true`;
- `noUncheckedIndexedAccess: true`;
- `noImplicitOverride: true`;
- `noFallthroughCasesInSwitch: true`.

Rules:

- avoid `any` except when a boundary genuinely cannot be typed and the reason is documented;
- avoid `@ts-ignore` and unsafe double assertions as shortcuts;
- prefer domain types and schemas at API/input boundaries;
- normalize nullable/optional external collections before screens use them;
- keep feature-specific code inside the feature unless it is genuinely cross-cutting;
- place reusable product primitives in the design system instead of cloning components;
- hooks use `use...` naming;
- React components use PascalCase;
- do not put canonical money/security/game decisions in UI state.

## Mobile organization

Prefer:

```text
feature/
  api or provider boundary
  screens
  components
  types/schemas where local
```

Use `core/` only for capabilities shared across multiple features, such as API, session, localization or query infrastructure.

Do not create generic `utils` dumping grounds when a domain-specific home exists.

## Localization

Supported player copy should go through `core/i18n`.

- Do not add new player-facing hard-coded copy without a deliberate reason.
- Translation keys should describe semantic intent rather than screen coordinates.
- Do not expose backend/API/debug language to players unless necessary for legal/safety disclosure.
- Locale-specific formatting should use the selected locale when practical.

## Go

- Keep packages short, domain-oriented and lowercase.
- Use `gofmt` as the formatting authority.
- Return/wrap errors with useful operation context.
- Keep authorization/business invariants in application/domain boundaries, not only handlers.
- Use context-aware database/network operations.
- Prefer explicit SQL/repository behavior over hidden persistence magic.
- Do not log secrets, tokens, passwords or sensitive payloads.
- Preserve idempotency and transaction boundaries for financial/provider mutations.

## Error handling

Differentiate where useful:

- validation/input errors;
- authentication errors;
- authorization/ownership errors;
- domain/policy errors;
- infrastructure/provider errors;
- unexpected internal errors.

Player responses should be safe and understandable; logs should retain diagnostic context without leaking sensitive values.

## Database/SQL

- monetary values use minor integer units;
- schema changes use migrations;
- no destructive production SQL without approval;
- preserve immutable ledger rules;
- use constraints for invariants that belong in the database as well as application code;
- use indexes based on real query needs.

## Testing style

Tests should mirror the boundary being protected. Prefer deterministic tests for domain rules, integration tests for database/security boundaries and a small number of end-to-end flows for critical user journeys.

A test must fail for a meaningful regression; avoid tests that only restate implementation details.

## Comments/documentation

Comments should explain non-obvious intent/invariants, not narrate obvious syntax. Architecture/security/business behavior changes must update canonical docs in the same PR.

## Naming and Git

Follow `CONTRIBUTING.md` for branches and Conventional Commits. Avoid names such as `new`, `final`, `final2`, `helper2`, `service-new` or vague commit messages.
