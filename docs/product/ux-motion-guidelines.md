# Vanta — UX, Visual Identity and Motion Guidelines

**Status:** canonical Phase 20 product-experience specification.  
**Last consolidated:** 2026-08-25.  
**Implementation scope:** React Native / Expo mobile client.

This document defines how Vanta should feel to a player. It is a product specification, not evidence that every item is already implemented.

---

## 1. Experience thesis

Vanta should feel like a **premium financial product with original gaming capability**, not a generic casino skin.

The experience should communicate:
- trust;
- speed;
- control;
- clarity;
- premium restraint;
- recognizable Vanta identity.

The product may become expressive inside games, but normal account, wallet, legal and security surfaces should remain calm and easy to understand.

### Anti-patterns

Avoid:
- excessive neon/glow;
- decorative chips/coins everywhere;
- random gradients per screen;
- long cinematic intros;
- generic Expo/development branding;
- animation with no informational or interaction value;
- technical architecture explanations in normal player UI;
- color-only state communication;
- motion that competes with financial/legal decisions.

---

## 2. Current implementation baseline

The repository already has a useful code-first design-system foundation:

```text
apps/mobile/src/design-system/
├── components/
├── theme/
└── tokens/
    ├── colors.ts
    ├── typography.ts
    ├── spacing.ts
    ├── radius.ts
    ├── shadows.ts
    └── motion.ts
```

Current motion primitives are:

```text
instant    0 ms
fast     120 ms
normal   220 ms
slow     360 ms
cinematic 520 ms
```

with standard/emphasized/enter/exit easing curves.

Current `BottomNavigation` already supports an optional icon slot, but the application `AppTabBar` currently supplies text-only items. Selection is primarily static background/label styling; the desired animated active indicator is not yet implemented.

Current native Expo configuration identifies the app but does not yet define final Vanta icon/adaptive-icon/splash assets. That remains Phase 20 debt.

These existing foundations should be evolved rather than replaced with a second styling system.

---

## 3. Visual language

### 3.1 Canonical palette

The code-backed semantic palette remains:

```text
App background      #0B0D10
Deep background     #07090C
Surface             #12151A
Raised surface      #181C22
Interactive/border  #252A32
Primary red         #FF3B30
Pressed red         #D92D25
Primary text        #F5F7FA
Secondary text      #9299A6
Disabled text       #5E6470
Success             #29D17D
Warning             #FFB020
Danger              #FF4D5A
```

Rules:
- consume semantic theme roles rather than repeating raw hex values;
- red is the Vanta brand accent, not the universal answer to every hierarchy problem;
- green is reserved for genuine positive/success meaning;
- warning/danger use their semantic roles;
- introduce repeated new values as tokens before feature-level duplication.

### 3.2 Surfaces

Prefer hierarchy through:
1. spacing;
2. typography;
3. surface elevation;
4. border/contrast;
5. accent color.

Do not solve every hierarchy problem with saturated color.

### 3.3 Typography

Priorities:
- excellent numeric readability for money;
- short clear headings;
- restrained weight changes;
- tabular numbers for balances/financial values where supported;
- no tiny legal/security copy that becomes unreadable with font scaling.

A bundled font may evolve, but semantic typography roles should remain stable.

---

## 4. Asset strategy

Vanta needs recognizable assets, but assets must serve identity or comprehension.

### Required asset families

- Vanta logo/wordmark;
- application icon;
- Android adaptive icon foreground/background;
- iOS app icon;
- native splash/launch mark;
- Vanta Originals game thumbnails/artwork;
- coherent navigation/action icon family;
- onboarding/empty-state illustration only where it improves comprehension.

### Asset rules

- never stretch one asset across incompatible aspect ratios;
- use platform-safe icon padding/safe zones;
- preserve recognizable logo silhouette at small sizes;
- game artwork may be expressive but must not impair text contrast;
- avoid stock-casino imagery as a substitute for Vanta identity;
- do not ship watermarked or temporary reference assets;
- keep source/licensing provenance for third-party assets.

---

## 5. App launch experience

The player experience begins when the app icon is tapped.

### Target flow

```text
OS launch
  ↓
native Vanta splash
  ↓
short branded transition
  ↓
resolved destination
  ├── authenticated Home
  ├── Auth/Onboarding
  ├── AccountBlocked
  └── Maintenance
```

### Native splash requirements

- Vanta background matches the app visual system;
- mark/logo uses correct aspect ratio and safe sizing;
- no stretched full-screen artwork;
- no white flash between native and JS layers;
- no Expo/developer-facing identity shown to normal users;
- Android system splash requirements are respected instead of fought;
- launch screen must not contain dynamic remote content.

### Branded transition requirements

Use it to smooth bootstrap, not to create artificial waiting.

Target characteristics:
- approximately **600–900 ms maximum** when shown;
- simple fade/scale/mark transition;
- no multi-second video intro;
- skip/shorten when bootstrap is already resolved where technically appropriate;
- reduced-motion mode removes nonessential transforms and uses a short fade/direct transition.

Session restoration, theme/font preparation and necessary bootstrap work can occur behind the branded transition.

### Acceptance

Fail Phase 20 launch polish if any of these occur:
- visible generic/stretched Expo-like launch;
- white flash;
- logo distortion;
- intro blocks access for several seconds without necessity;
- launch route briefly exposes the wrong authenticated/unauthenticated screen.

---

## 6. Bottom navigation

Canonical tabs:

```text
Home / Jogar / Carteira / Perfil
```

### Required final presentation

Use **icon + label** for all four tabs.

Suggested semantic icons:
- Home → house/home;
- Jogar → gamepad/original-games symbol;
- Carteira → wallet;
- Perfil → user/account.

Use one consistent icon family/stroke language.

### Active-state behavior

Desired feedback:
- shared active indicator/pill moves to selected tab;
- icon may translate upward approximately 2–3 px;
- icon may scale subtly around `0.92 → 1.0`;
- label/color emphasis changes with selection;
- normal transition target should use existing `normal` motion (~220 ms) or remain within roughly 200–300 ms.

Do not animate layout so aggressively that labels jump or the bar changes height.

### `Jogar` emphasis

`Jogar` may have stronger brand treatment because gaming is a primary product action, but:
- it must still fit the same navigation system;
- it must not look like an advertisement;
- its emphasis cannot hide the active state of another tab;
- accessibility/contrast remains equivalent.

### Interaction requirements

- minimum touch target approximately 48 dp in the current component baseline;
- correct accessibility role/state;
- tab label remains visible; do not use icons-only navigation as default;
- selected state must not rely only on red color;
- pressing the current tab should behave predictably and not create duplicate navigation state.

---

## 7. Navigation and screen transitions

Motion should help the user understand hierarchy.

### Tab changes

Recommended:
- short crossfade;
- optional 4–6 px translation;
- around 180–240 ms;
- no full-screen carousel slide between unrelated top-level tabs.

### Push/detail navigation

For drill-down screens such as transaction details, security session details or legal documents:
- use platform-consistent stack movement or restrained Vanta equivalent;
- back navigation should feel like returning in hierarchy;
- do not animate protected-state transitions in a way that briefly exposes restricted content.

### Sheets/modals

- bottom sheets may use `normal`/`slow` timing according to travel distance;
- modal scrim fades separately from content movement;
- dismissal must be interruptible/responsive where safe;
- destructive/regulated confirmations must not be dismissed accidentally through decorative gesture behavior.

---

## 8. Motion system architecture

Do not scatter arbitrary millisecond values through feature screens.

Target conceptual structure:

```text
design-system/
└── motion/
    ├── durations
    ├── easing
    ├── screenTransitions
    ├── bottomNavigation
    ├── pressFeedback
    ├── cards
    ├── feedbackStates
    ├── gameMotion
    └── reducedMotion
```

This does not require physically creating every file immediately; it defines responsibility boundaries.

### Existing token usage

Prefer current token vocabulary first:
- `fast` 120 ms — press/tiny feedback;
- `normal` 220 ms — common navigation/selection;
- `slow` 360 ms — sheets/larger state transitions;
- `cinematic` 520 ms — rare branded/game presentation, not common controls.

App launch branded motion may compose tokenized steps and total up to the approved launch budget.

### Motion principles

1. Motion communicates state or causality.
2. Interaction feedback starts immediately.
3. Financial/legal decisions remain calm.
4. Gameplay can be more expressive.
5. Client animation never determines authoritative game outcome or money.
6. Reduced Motion is a first-class path, not an afterthought.

---

## 9. Microinteractions

### Buttons

- immediate pressed feedback using fast timing;
- avoid large bounce;
- loading state prevents accidental duplicate submissions where appropriate;
- success does not imply backend completion until authoritative response exists.

### Cards/list rows

- subtle press opacity/scale only when interactive;
- noninteractive cards should not look pressable;
- chevrons/icons should consistently indicate navigation.

### Forms

- focus/error feedback must not move fields enough to make typing unstable;
- errors appear near the relevant field/summary;
- stale submission errors clear when the user meaningfully edits/retries;
- keyboard never covers the primary action or critical error.

### Haptics

Optional and restrained:
- meaningful confirmation or game interaction may use haptics;
- do not vibrate on every tab tap/scroll;
- respect platform/user settings;
- haptic feedback never substitutes visual/accessibility feedback.

---

## 10. Game motion

Games may use stronger motion than the rest of the app, but authoritative boundaries remain explicit.

For Plinko:
- server returns the authorized result/path/result data;
- client animates that result;
- animation cannot reroll, reinterpret or locally settle money;
- result feedback should make win/loss/multiplier understandable;
- performance problems must not change canonical outcome.

Target smoothness:
- aim for stable device-appropriate frame pacing (normally 60 fps on supported devices);
- avoid JS-thread-heavy decoration that harms touch/navigation;
- test real physical devices, not Storybook alone.

Reduced-motion mode may simplify nonessential particles/camera effects while preserving understandable result presentation.

---

## 11. Loading, empty, offline, error and maintenance states

Every primary feature should have coherent states rather than blank screens.

### Loading

Prefer:
- skeleton/progress when structure is predictable;
- stable layout to avoid large jumps;
- do not show fabricated financial data while loading.

### Empty

Explain:
- what is empty;
- whether that is normal;
- what the user can do next.

Example: no wallet movements is not an error.

### Offline

- clearly indicate network limitation;
- allow safe read-only cached presentation only where policy permits;
- sensitive mutations fail closed;
- never imply an action succeeded if server confirmation is unavailable.

### Error

- plain-language failure;
- safe retry where appropriate;
- request/support reference only if useful;
- do not leak stack traces, endpoint internals or security-sensitive details.

### Maintenance/account blocked

These are authoritative root states. Navigation animation must never allow a visual bypass into protected product screens.

---

## 12. Accessibility requirements

Accessibility is part of product quality, not a post-launch patch.

Required baseline:
- meaningful accessibility labels/roles/states;
- touch targets around 44–48 dp minimum;
- usable system font scaling;
- no critical information communicated only by color;
- sufficient text/icon contrast;
- focus order matches visual/task order;
- keyboard/safe-area behavior validated;
- Reduce Motion respected;
- errors/validation understandable to screen readers;
- icons paired with text where meaning would otherwise be ambiguous.

Financial amounts and security actions need especially clear accessible names.

---

## 13. Responsive/device quality

Phase 20 device validation should include:
- common Android phone sizes;
- small-height screens/keyboard open;
- safe-area/notch/navigation-inset behavior;
- font scaling;
- portrait orientation baseline;
- iOS simulator path when available.

Do not optimize only for the developer's current phone.

---

## 14. Player information architecture

Target top-level model:

```text
HOME
- balance summary
- featured/original games
- attention/status if needed
- recent activity

JOGAR
- Vanta Originals catalog
- Plinko
- future approved games

CARTEIRA
- available/reserved/total where useful
- deposit
- withdrawal
- transactions

PERFIL
- account/profile
- verification
- security
- Responsible Gaming
- support
- Legal and Privacy
- About/version
- logout
```

Do not create top-level navigation for implementation concerns.

---

## 15. Implementation gap matrix — Phase 20

| Area | Current baseline | Target | Status |
|---|---|---|---|
| Color/theme | Semantic dark/red tokens exist | Preserve/evolve token-first | Foundation exists |
| Motion tokens | 0/120/220/360/520 + easings | Shared behavior recipes + reduced motion | Partial |
| Bottom navigation | Component supports optional icon | Actual icon+label + animated indicator | Open |
| AppTabBar | Text labels only | Pass consistent icons and active motion | Open |
| Splash | No final icon/splash config in `app.json` | Vanta native splash + transition | Open |
| Assets | Prototype-level | Final brand/game asset families | Open |
| System states | Foundation exists | Consistent polished application | Partial |
| Copy | Some engineering-heavy text remains | Player-first language | Open |
| Accessibility | Some roles/safe-area support | Full Phase 20 baseline above | Validate |

---

## 16. Phase 20 UX acceptance criteria

UX/motion polish is acceptable for Phase 20 only when:

- [ ] final app icon/adaptive icon are configured;
- [ ] native splash uses Vanta identity without stretching/white flash;
- [ ] branded app-entry transition is short and nonblocking;
- [ ] bottom navigation uses consistent icon + label;
- [ ] selected tab feedback is animated but restrained;
- [ ] screen/press/state motion uses shared tokens instead of arbitrary timing;
- [ ] Reduce Motion path exists for nonessential animation;
- [ ] key screens have loading/empty/error/offline handling where applicable;
- [ ] no critical action is hidden by keyboard/safe area;
- [ ] font scaling and touch targets remain usable;
- [ ] normal player screens no longer expose internal architecture copy;
- [ ] Plinko/game animation remains render-only for authoritative server results;
- [ ] physical Android UX smoke test passes;
- [ ] iOS simulator/build path is reviewed when available.

---

## 17. Review rule

Any substantial Vanta mobile UX change should be reviewed against:
1. this specification;
2. code-first Storybook where applicable;
3. physical-device behavior;
4. accessibility/reduced-motion behavior;
5. security/regulatory boundaries.

A screen is not considered polished merely because a screenshot looks good. Interaction, loading, failure, accessibility and real-device behavior are part of the product.
