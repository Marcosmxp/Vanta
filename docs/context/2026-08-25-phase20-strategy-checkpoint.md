# Vanta — Phase 20 Strategy and Context Checkpoint

**Date:** 2026-08-25  
**Branch:** `feat/phase20-native-builds`  
**PR:** #24  
**Purpose:** preserve the reasoning, decisions, native-test evidence and product strategy established during the active Phase 20 discussion so a future development session can continue without reconstructing context from chat history.

This checkpoint is intentionally newer than the last completed-state documentation on `main`. Until PR #24 is merged, it describes the active branch state, not the last canonical merged release.

---

## 1. Where the project is now

Vanta has moved beyond a presentation-only mobile prototype. A physical Android device has successfully exercised the integrated local runtime:

```text
Android app
    ↓ Wi-Fi / LAN
Metro :8081
    ↓
Go API :8080
    ↓
PostgreSQL + Redis
```

Validated during this checkpoint:
- onboarding;
- registration;
- login;
- authenticated Home;
- Profile;
- server-backed account/KYC status;
- Wallet balance;
- Wallet empty transaction state;
- Deposit presentation with execution blocked;
- Plinko protected-mode rendering;
- logout followed by login again.

This is significant native/runtime evidence, but it is **not** evidence of production readiness.

---

## 2. Phase 20 runtime findings

### P20-001 — PostgreSQL 18 development volume

**Symptom:** local PostgreSQL container failed after moving to PostgreSQL 18 because the old data-directory mount layout no longer matched the expected image layout.

**Cause:** development Compose used the older `/var/lib/postgresql/data` persistence shape.

**Fix:** use the PostgreSQL 18-compatible named volume rooted at `/var/lib/postgresql`.

Relevant implementation checkpoints include:
- `1fb89871f06d2b1fc9c0cbcbac18a075bbb3ab7c`
- diagnostics follow-up `5e7c6cecc013b69b0c73958ccebe9e8347a396ae`

**Lesson:** pin/document database major-version persistence expectations and include container-startup diagnostics in development tooling.

### P20-002 — Windows Docker / WSL2 readiness

**Symptom:** Docker Desktop initially reported virtualization support unavailable.

**Resolution:** Windows WSL2/VirtualMachinePlatform environment was enabled and Docker Desktop subsequently ran with the WSL2 backend.

**Lesson:** this is workstation setup, not a Vanta application defect. Future Windows setup docs should distinguish host virtualization problems from Compose/application problems.

### P20-003 — Physical-device Metro connection

**Symptom:** APK could reach the development environment, but the assumed QR/dev-client flow was unreliable and Expo reported that it could not determine a default development-build URI scheme.

**Finding:** `apps/mobile/package.json` does not currently include `expo-dev-client`, even though development scripts invoke `expo start --dev-client`.

**Working path:** set Android React Native Dev Settings:

```text
Debug server host & port for device
<LAN_IP>:8081
```

The phone and workstation must be on the same trusted development Wi-Fi/LAN.

**Important:** Expo Go, ADB and a Wi-Fi proxy are not required for this current workflow. Wi-Fi proxy should remain `None` unless a deliberate proxy test is being performed.

**Future decision:** normalize whether Vanta will use an explicit Expo development-client package or another documented debug-build strategy. Do not leave the repository in an ambiguous state indefinitely.

### P20-004 — Metro cache runtime failure

**Symptom:** red runtime screen with an `EventEmitter` undefined error after reload/update.

**Observation:** the same native APK had already rendered successfully, making a native rebuild unnecessary as the first response.

**Fix:** stop Metro, clear Expo/Metro caches and restart with `--clear`.

**Lesson:** distinguish JS-bundle/cache failures from native-binary incompatibility before spending time rebuilding an APK.

### P20-005 — Registration password-policy mismatch

**Symptom:** registration returned a generic rejection despite apparently valid mobile form input.

**Cause:** backend required a minimum of 12 characters while mobile validation/help had previously communicated 10.

**Fix:** mobile schema minimum aligned to 12 characters at commit:

```text
a0da68541809e6c4e0784dc5bd0990af03a48be1
```

**Remaining debt:** all player-facing password helper text and backend/mobile complexity policy must be intentionally aligned. Server policy remains authoritative.

### P20-006 — Wallet `transactions: null` render crash

**Symptom:** Wallet threw:

```text
Cannot read property 'length' of null
```

**Cause:** a nil Go slice serialized as JSON `null`; mobile assumed an array and called `.length`.

**Fixes:** defense at multiple boundaries:
- API returns an empty array for no transactions;
- mobile provider normalizes unexpected empty/null transaction data;
- Wallet UI guards before using array operations.

Relevant commits:

```text
21e44eaec1efd23f68641853fd131abe1795e623
e1921a929adbf9e26b084648bfe2489d4eb4b021
fd215a0c45d657b58623f26146ffdf1700e04335
```

**Verification:** physical Android subsequently rendered Wallet with `0,00 €` and `Sem movimentos` without crashing.

**Lesson:** API JSON contracts should explicitly define empty collection semantics, and clients should still normalize defensive boundaries.

### P20-007 — Stale invalid-credentials message

**Symptom:** an invalid-password message could remain visible even after a later successful login attempt/transition.

**Finding:** authentication itself worked; this is UI state debt rather than a backend credential failure.

**Required fix:** clear stale submission errors on a new attempt, relevant field edit and successful authentication.

### P20-008 — Unnecessary multiple Android artifacts

An intermediate workflow produced more than one Android variation, increasing build time without enough test value.

**Decision:** current Phase 20 CI generates one physical-device debug APK unless another artifact has a concrete release/test purpose.

Relevant simplification checkpoint:

```text
13483338ad0200959657a22b53da03d1b7fbf9ad
```

---

## 3. Product copy decision

The current UI contains too much engineering explanation.

Examples of concepts that generally should **not** be normal player-facing copy:
- ledger implementation;
- read-only projection;
- internal settlement mechanics;
- component/API authority explanations;
- developer security commentary.

The app should instead explain:
- what the player can do;
- current status;
- why an action is unavailable;
- what action is required next;
- relevant legal/safety information.

Technical details remain in engineering, audit and regulatory evidence.

This is now an explicit product rule.

---

## 4. UI assets and visual identity decision

The current dark UI structure is a useful foundation but still has prototype characteristics without final brand assets.

Add selectively:
- Vanta logo;
- application icon;
- Android adaptive icon;
- game thumbnails/artwork;
- Vanta Originals visual identity;
- onboarding/empty-state illustration only where it improves comprehension;
- one consistent icon family.

Avoid filling the interface with generic casino imagery, excessive neon, coins/chips or decoration without purpose.

Vanta should feel closer to a premium financial product plus gaming than a cluttered casino lobby.

---

## 5. Bottom navigation and motion decision

Bottom navigation remains:

```text
Home / Jogar / Carteira / Perfil
```

But the final implementation should use **icon + label**.

Desired interaction:
- animated active pill/indicator;
- subtle icon translation/scale;
- label emphasis;
- screen transition with short fade/small translation;
- approximately 200–300 ms for ordinary navigation.

Motion should become a shared design-system layer rather than per-screen ad hoc animation.

Recommended categories:

```text
motion/
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

Game motion can be more expressive. Financial/legal reading surfaces should remain restrained.

Respect platform reduced-motion preferences.

---

## 6. Launch/splash decision

The generic/stretched Expo-looking launch experience is not acceptable for public UX.

Target:

```text
native Vanta splash
→ short Vanta brand transition
→ app destination
```

Requirements:
- Vanta background/branding;
- correct image scaling (`contain`-style result, no stretching);
- no white flash;
- no developer/Expo-looking branding shown to the player;
- brand transition roughly 600–900 ms maximum and never artificially delays app access;
- session/bootstrap work may run behind the transition;
- Android system splash behavior must be respected.

---

## 7. Session UX decision

This is considered critical product/security behavior:

> A player who minimizes, closes or reopens Vanta should not be required to enter email/password again while the stored session remains valid and server policy has not revoked it.

Current foundations already include SecureStore, access/refresh tokens, refresh rotation and revocation.

Expected behavior:

```text
minimize → return authenticated
force-close/reopen → restore secure session
access expires → silent refresh
refresh expires/revoked → authenticate
```

Sensitive actions should later trigger **step-up authentication** instead of making every app open painful.

Candidate step-up actions:
- withdrawal;
- password change;
- email/phone change;
- disabling MFA;
- changing payment destination;
- high-risk security operations.

Future work includes passkeys/MFA/biometric local unlock where appropriate.

---

## 8. Security decision in the AI era

AI-assisted tooling lowers the cost of code review, automation, reverse engineering and attack experimentation. The architecture therefore must continue to assume that the released mobile client can be inspected and modified.

Security does **not** depend on hiding client code.

Client compromise must not grant authority to:
- alter wallet balances;
- approve KYC;
- weaken Responsible Gaming restrictions;
- choose authoritative game outcomes;
- change payout/settlement;
- confirm a payment;
- authorize a withdrawal;
- access another player's resources.

Future hardening priorities:
- MFA/passkeys/recovery;
- Play Integrity/App Attest;
- device-risk signals;
- step-up authentication;
- KMS/HSM and key rotation;
- immutable audit/security events;
- fraud/risk monitoring;
- controlled release signing/supply chain;
- dependency lock/frozen release installs;
- independent penetration test;
- incident response and revocation playbooks.

---

## 9. iOS decision without an iPhone

Lack of a local iPhone does not stop Vanta development.

Strategy:
1. validate iOS configuration/prebuild;
2. compile/build with macOS CI/EAS where appropriate;
3. use iOS simulator for applicable tests;
4. document Apple signing/provisioning requirements;
5. later validate physical behavior via TestFlight, cloud-device service or borrowed test device.

Never claim physical iOS validation without actual hardware evidence.

---

## 10. Versioning and Git governance decision

Versioning should have existed as a controlled release process from the beginning. It is now explicit technical debt to correct.

Project phase numbers are not app versions.

New governance direction:
- SemVer;
- `alpha` / `beta` / `rc` prerelease channels;
- monotonic Android `versionCode` and iOS `buildNumber`;
- one canonical version source;
- Git tags tied to exact release commit;
- GitHub Releases;
- changelog/release notes;
- artifact provenance: version/build/Git SHA/date/channel/environment/platform;
- About/Profile version display;
- Conventional Commits;
- descriptive branch names.

The current `0.0.1` vs `0.0.0` inconsistency must be normalized before a controlled alpha release.

See `docs/release/versioning-and-release-governance.md`.

---

## 11. Game math and operator-risk decision

Game mathematics is considered a critical production domain because an incorrect payout model or uncontrolled tail exposure can damage the operator even when average house edge is positive.

Core equation:

```text
RTP = Σ(probability_i × payout_i)
House Edge = 1 - RTP
```

Required per production ruleset:
- theoretical probabilities;
- payout table;
- RTP;
- house edge;
- variance/volatility;
- tail/extreme probability;
- max multiplier;
- max stake;
- max payout;
- bankroll assumptions;
- aggregate exposure;
- risk of ruin/drawdown;
- stress simulation.

Use analytical calculation plus simulation. Do not rely only on “a million rounds looked fine”.

Low/Medium/High risk modes can change distribution/volatility but must remain approved/versioned configurations.

**Critical fairness/risk rule:** the operator protects itself through limits and exposure controls **before accepting** the game action. Do not change an accepted player's result to avoid a payout.

Historical results must link to the exact version/hash of the math/ruleset used.

---

## 12. Business strategy decision

Do not automatically start as a full multi-country B2C operator.

A strategic path to evaluate:

```text
Vanta Technology / Vanta Originals
→ B2B game/platform supply to licensed operators
→ prove product/economics/history
→ selected B2C jurisdiction
→ jurisdiction-by-jurisdiction expansion
```

This is an evaluation path, not a legal/commercial conclusion.

Key metrics to model:
- GGR;
- NGR;
- first-deposit conversion;
- retention D30/D90/D365;
- CAC;
- LTV;
- LTV/CAC;
- promo cost;
- payment cost;
- fraud/chargeback loss;
- gaming tax;
- corporate tax;
- compliance/support cost;
- contribution margin;
- bankroll/exposure usage.

House edge alone does not describe business profitability.

---

## 13. Regulation, tax and asset-protection decision

Vanta should pursue only **lawful** tax planning, liability separation and asset protection.

Potential future group structure may separate:

```text
Vanta Holding
├── Vanta Technology / IP
├── Licensed Operator — Market A
├── Licensed Operator — Market B
└── Treasury / Investment vehicle where lawful
```

Possible legitimate objectives:
- isolate operating liability;
- separate regulated/player obligations;
- protect/organize IP ownership;
- improve governance/investment/M&A readiness;
- manage jurisdiction-specific licensing/accounting;
- achieve lawful tax efficiency.

Not acceptable:
- concealment of beneficial ownership;
- undeclared income/assets;
- sham residency/substance;
- tax evasion.

There is no assumption that one European gaming authorization covers every market. Jurisdiction, gaming duty, corporate tax, permanent establishment, transfer pricing, economic substance and beneficial ownership require current specialist advice.

---

## 14. Legal Center decision

Vanta needs a structured in-app legal/privacy area rather than scattering long technical/legal paragraphs through normal gameplay screens.

Review/add where applicable:
- Terms and Conditions;
- Privacy;
- Responsible Gaming;
- KYC/identity;
- deposits/withdrawals;
- game rules;
- bonus/promotion rules;
- account closure;
- time-out/self-exclusion;
- complaints/disputes;
- minors/18+;
- data-protection rights;
- verified operator/regulator/license information.

Legal documents should be versioned and date-effective.

---

## 15. Immediate Phase 20 priority order

1. Finish Android native/session smoke-test evidence.
2. Fix stale login-error UI and password-copy inconsistency.
3. Normalize version/build governance.
4. Complete artifact/log/config security inspection.
5. Implement final native icon/splash/launch experience.
6. Replace technical player-facing copy.
7. Add navigation icons and shared motion foundation.
8. Review Legal Center completeness.
9. Validate remaining Security/RG/Support/History flows.
10. Validate iOS prebuild/macOS CI/simulator path.
11. Update release evidence and only then consider merging PR #24.

Do **not** open production game/payment/KYC/MFA capabilities to make Phase 20 appear more complete.

---

## 16. Resume rule

A future session should read:

1. `docs/README.md`;
2. `docs/VANTA_PROJECT_CONTEXT.md`;
3. this checkpoint;
4. `docs/VANTA_PRODUCT_BUSINESS_STRATEGY.md`;
5. `docs/ROADMAP.md`;
6. `docs/PHASE_HISTORY.md`;
7. `docs/release/phase20-native-builds.md`;
8. `docs/release/phase20-device-smoke-test.md`;
9. `docs/release/phase20-troubleshooting-and-findings.md`;
10. current branch/PR code and CI state.

Continue from the first unresolved Phase 20 exit criterion instead of reconstructing plans from older screenshots, PDFs or conversations.
