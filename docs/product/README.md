# Vanta Product Documentation

**Status:** canonical product index for the active Vanta branch.

This directory defines what Vanta is, what the current MVP includes, which product requirements exist and how the intended player experience should behave. It does not replace code-level design tokens, architecture, legal review or security policy.

## Read order

1. [`PROJECT.md`](./PROJECT.md) — canonical product definition, target user, value proposition, scope, business direction and success criteria.
2. [`MVP.md`](./MVP.md) — Native Alpha MUST/SHOULD/COULD/NOT IN MVP boundaries and exit criteria.
3. [`REQUIREMENTS.md`](./REQUIREMENTS.md) — stable requirement IDs, priority, status and acceptance boundaries by domain.
4. [`ux-motion-guidelines.md`](./ux-motion-guidelines.md) — visual language, app launch, assets, navigation, motion, states, accessibility and UX acceptance criteria.
5. [`player-copy-content-guidelines.md`](./player-copy-content-guidelines.md) — player-facing language, errors, blocked states, financial/security wording, localization and content acceptance criteria.

Project execution/status records:
- [`../project/STATUS.md`](../project/STATUS.md)
- [`../project/BACKLOG.md`](../project/BACKLOG.md)
- [`../project/TECH_DEBT.md`](../project/TECH_DEBT.md)
- [`../project/RISKS.md`](../project/RISKS.md)

Higher-level strategic context remains in:
- [`../VANTA_PROJECT_CONTEXT.md`](../VANTA_PROJECT_CONTEXT.md)
- [`../VANTA_PRODUCT_BUSINESS_STRATEGY.md`](../VANTA_PRODUCT_BUSINESS_STRATEGY.md)
- [`../ROADMAP.md`](../ROADMAP.md)

## Source-of-truth boundaries

- **`PROJECT.md`:** what the product is and is not.
- **`MVP.md`:** current Native Alpha scope boundary.
- **`REQUIREMENTS.md`:** requirement IDs/status/acceptance boundaries.
- **Product UX docs here:** how the player experience should behave and why.
- **`apps/mobile/src/design-system`:** executable visual tokens/components.
- **Navigation code:** actual route/state implementation.
- **Backend/security docs:** authorization, financial authority, session policy and regulated controls.
- **Legal documents/backend:** approved legal text, versions and verified operator/regulator information.
- **`docs/project/*`:** operational project status, backlog, debt and risks.

When product documentation and implementation differ, treat the mismatch as implementation debt or requirement-status work; do not silently rewrite an approved product rule to match an accidental implementation.

## Permanent product principle

> The player should experience clarity, confidence and responsiveness while implementation, financial, security and regulatory complexity remains behind the product boundary.

A polished interface must never weaken server authority, Responsible Gaming, security, legal disclosure or accessibility.
