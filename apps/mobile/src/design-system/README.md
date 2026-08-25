# Vanta Mobile Design System

This directory is the code-first source of truth for Vanta's executable mobile visual language.

Product-experience intent and acceptance criteria are documented separately in:
- [`../../../../docs/product/ux-motion-guidelines.md`](../../../../docs/product/ux-motion-guidelines.md)
- [`../../../../docs/product/player-copy-content-guidelines.md`](../../../../docs/product/player-copy-content-guidelines.md)

The product docs define **what the experience should be**; this directory defines the reusable tokens/components used to implement it.

## Foundations

- `tokens/colors.ts`: primitive and semantic dark/red color roles
- `tokens/typography.ts`: product type scale and weights
- `tokens/spacing.ts`: spacing scale
- `tokens/radius.ts`: corner-radius scale
- `tokens/shadows.ts`: elevation and glow recipes
- `tokens/motion.ts`: duration and easing primitives
- `theme/darkTheme.ts`: composed Vanta dark theme

Current motion primitives:

```text
instant      0 ms
fast       120 ms
normal     220 ms
slow       360 ms
cinematic  520 ms
```

Use these primitives to build shared behavior recipes rather than scattering arbitrary durations across screens.

## Rules

1. Feature screens and reusable components consume semantic theme roles rather than primitive color values.
2. New repeated visual values should be introduced as named tokens before feature-level duplication.
3. Green is reserved for positive/success feedback. Red is the Vanta brand accent and may also be used for explicit danger roles through separate semantic tokens.
4. Motion tokens and animation recipes describe presentation only. Gameplay outcomes, RNG, settlement, balance and other authoritative behavior never belong in the design system or client-side animation logic.
5. The mobile client contains public presentation configuration only; secrets and privileged business logic remain server-side.
6. Reduced Motion must have a deliberate implementation path for nonessential animation.
7. Interactive components require clear pressed/focus/selected/disabled behavior and accessibility roles/states.
8. Player-facing text follows `docs/product/player-copy-content-guidelines.md`; do not encode engineering explanations into reusable UI primitives.
9. Storybook is a visual/component review tool, not a substitute for physical-device validation.

## Phase 20 implementation direction

Known product gaps to close against the current component baseline:
- `BottomNavigation` supports icons, while `AppTabBar` still provides text-only items;
- active navigation needs shared animated indicator/feedback rather than only static state styling;
- motion primitives need reusable navigation/press/state recipes;
- native Vanta icon/splash/launch identity must be configured outside this component directory;
- system states and feature screens require reduced-motion/accessibility/device review.

Do not create a second ad-hoc design system inside feature folders to solve these gaps.

## Typography note

The scale is defined independently from a custom font package so the foundations remain safe to bootstrap on every platform. A bundled Inter/Geist-like family may be introduced deliberately without changing semantic type roles.
