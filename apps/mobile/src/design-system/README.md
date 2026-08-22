# Vanta Mobile Design System

This directory is the code-first source of truth for Vanta's mobile visual language.

## Foundations

- `tokens/colors.ts`: primitive and semantic dark/red color roles
- `tokens/typography.ts`: product type scale and weights
- `tokens/spacing.ts`: spacing scale
- `tokens/radius.ts`: corner-radius scale
- `tokens/shadows.ts`: elevation and glow recipes
- `tokens/motion.ts`: duration and easing primitives
- `theme/darkTheme.ts`: composed Vanta dark theme

## Rules

1. Feature screens and reusable components consume semantic theme roles rather than primitive color values.
2. New visual values should be introduced as named tokens before being repeated across product code.
3. Green is reserved for positive/success feedback. Red is the Vanta brand accent and may also be used for explicit danger roles through separate semantic tokens.
4. Motion tokens describe timing only. Gameplay outcomes, RNG, settlement, balance, and other authoritative behavior never belong in the design system or client-side animation logic.
5. The mobile client contains public presentation configuration only; secrets and privileged business logic remain server-side.

## Typography note

The scale is defined independently from a custom font package so the foundations remain safe to bootstrap on every platform. A bundled Inter font family can be introduced when the component layer is established, without changing the semantic type scale.
