# Vanta Product Experience Documentation

**Status:** canonical product-UX index for the active Vanta branch.

This directory translates the higher-level product strategy into concrete player-experience rules. It does not replace code-level design tokens, navigation architecture, legal review or security policy.

## Read order

1. [`ux-motion-guidelines.md`](./ux-motion-guidelines.md) — visual language, app launch, assets, navigation, motion, states, accessibility and UX acceptance criteria.
2. [`player-copy-content-guidelines.md`](./player-copy-content-guidelines.md) — player-facing language, errors, blocked states, financial/security wording, localization and content acceptance criteria.

Higher-level context remains in:
- [`../VANTA_PROJECT_CONTEXT.md`](../VANTA_PROJECT_CONTEXT.md)
- [`../VANTA_PRODUCT_BUSINESS_STRATEGY.md`](../VANTA_PRODUCT_BUSINESS_STRATEGY.md)
- [`../ROADMAP.md`](../ROADMAP.md)

## Source-of-truth boundaries

- **Product docs here:** what the player experience should be and why.
- **`apps/mobile/src/design-system`:** executable visual tokens/components.
- **Navigation code:** actual route/state implementation.
- **Backend/security docs:** authorization, financial authority, session policy and regulated controls.
- **Legal documents/backend:** approved legal text, versions and verified operator/regulator information.

When product documentation and implementation differ, treat the mismatch as implementation debt; do not silently rewrite the product rule to match an accidental implementation.

## Permanent product principle

> The player should experience clarity, confidence and responsiveness while implementation, financial, security and regulatory complexity remains behind the product boundary.

A polished interface must never weaken server authority, Responsible Gaming, security, legal disclosure or accessibility.
