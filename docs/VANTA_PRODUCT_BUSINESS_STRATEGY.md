# Vanta — Product, Business and Operating Strategy

**Status:** strategic product document.  
**Last consolidated:** 2026-08-25.  
**Scope:** product objectives, UX direction, monetization, game mathematics, risk, security, regulatory sequencing and lawful corporate strategy.

This document does not authorize production operation. Jurisdiction-specific legal, tax, licensing and accounting decisions require qualified professional review.

---

## 1. Product thesis

Vanta should be built as a **premium digital gaming platform with fintech-grade trust**, rather than as a generic casino interface.

The product should combine:
- simple player UX;
- high-quality original games;
- transparent wallet/account surfaces;
- strong security;
- Responsible Gaming;
- measurable unit economics;
- server-authoritative game/financial logic;
- jurisdiction-aware compliance.

The user should experience simplicity. The system behind the user should remain strict, auditable and difficult to abuse.

---

## 2. North-star objectives

### Objective A — Trust

Players must be able to understand:
- their balance;
- what happened to their money;
- what they are allowed to do;
- account/KYC state;
- Responsible Gaming controls;
- where rules/terms/support live.

### Objective B — Low-friction account access

Routine app use must not repeatedly ask for passwords.

Target behavior:
- sign in once;
- persist session securely;
- silent refresh;
- step-up authentication only for sensitive/risky operations.

### Objective C — Recognizable premium experience

Vanta should feel like its own product:
- final icon/logo;
- custom splash/launch;
- controlled motion;
- premium dark design;
- iconography;
- original game artwork;
- polished empty/loading/error states.

### Objective D — Safe financial system

Money never depends on client-calculated state.

All payment, reservation, game, payout and reconciliation effects must be server-side, transactional, idempotent and auditable.

### Objective E — Commercially viable game economics

A technically correct game can still create unsustainable exposure if payout risk is poorly controlled.

Every production game must have approved:
- RTP;
- house edge;
- payout distribution;
- variance;
- tail risk;
- max stake;
- max payout;
- bankroll assumptions;
- exposure constraints.

### Objective F — Expand only where lawful and economically justified

Do not treat Europe/the world as one regulatory market.

Enter jurisdictions deliberately and validate licensing, tax, payment, KYC/AML, store distribution and economics before launch.

---

## 3. Player experience strategy

### 3.1 Plain-language copy

Player-facing screens explain the product, not internal architecture.

Avoid normal-player copy such as:
- “server-authoritative result”;
- “read-only projection”;
- “ledger state”;
- component/API implementation explanations.

Prefer:
- “Consulte o seu saldo e movimentos.”
- “Os depósitos ainda não estão disponíveis.”
- “Apostas temporariamente indisponíveis.”
- “Verifique a sua identidade para continuar.”
- “Defina limites e faça pausas quando precisar.”

Technical detail remains available to engineers, auditors and regulators.

### 3.2 Home

Home should answer:
- what can I play?
- what is my balance?
- is anything requiring attention?
- what happened recently?

Avoid turning Home into documentation.

### 3.3 Wallet

Wallet should prioritize:
- available balance;
- reserved balance where useful;
- deposit;
- withdrawal;
- transaction history;
- clear states/errors.

The player does not need to know how the ledger is implemented.

### 3.4 Profile

Profile should contain:
- identity summary;
- KYC status;
- account/security;
- Responsible Gaming;
- support;
- Legal Center;
- logout;
- app version/about.

### 3.5 Legal Center

Expected document categories where applicable:
- Terms and Conditions;
- Privacy Policy;
- Responsible Gaming;
- KYC/identity verification;
- deposits/withdrawals;
- game rules;
- bonus/promotion rules;
- account closure;
- time-out/self-exclusion;
- complaints/disputes;
- data-protection rights;
- minors/18+;
- operator/regulator/license information when verified.

Documents should be versioned and date-effective.

---

## 4. Visual identity, assets and motion

### 4.1 Visual principle

Premium financial product + gaming, not cheap casino neon.

Use assets only when they improve identity or comprehension.

### 4.2 Required asset families

- Vanta logo;
- app icon;
- Android adaptive icon;
- launch/splash assets;
- game cards/thumbnails;
- Vanta Originals artwork;
- onboarding/state illustrations where useful;
- consistent navigation/action icons.

### 4.3 Bottom navigation

Use icon + label:
- Home;
- Jogar;
- Carteira;
- Perfil.

Motion:
- animated active pill/indicator;
- small icon position/scale change;
- label opacity emphasis;
- screen fade/translation around 200–300 ms.

### 4.4 Motion hierarchy

**Navigation:** subtle.  
**Buttons/cards:** tactile microfeedback.  
**Success/errors:** clear short feedback.  
**Games:** expressive animation.  
**Legal/financial reading:** restrained.

Respect reduced-motion accessibility settings.

### 4.5 Launch sequence

```text
OS/native splash
→ Vanta branded transition
→ app
```

Avoid:
- stretched default image;
- white flash;
- long intro;
- technical/dev branding.

---

## 5. Game portfolio strategy

Start with one polished Vanta Original rather than many shallow games.

Initial:
- Plinko.

Potential later:
- Crash;
- Mines;
- Dice;
- additional original games.

Before adding volume, prove:
- retention;
- performance;
- fair/approved math;
- operational reliability;
- cross-sell value.

---

## 6. Game math strategy

### 6.1 Principle

Operator advantage is mathematical expectation over volume, not a hidden decision that a particular user must lose.

```text
RTP = Σ(P_i × payout_i)
House Edge = 1 - RTP
```

Example:
- RTP 96%;
- theoretical house edge 4%.

This does **not** guarantee profit in a short period.

### 6.2 Required model per ruleset

- exact outcome probabilities;
- payout table;
- theoretical RTP;
- variance;
- volatility profile;
- max multiplier;
- tail probability;
- expected payout;
- confidence bounds;
- max stake;
- max payout;
- bankroll requirement;
- aggregate exposure.

### 6.3 Simulation

For every production math revision:
1. analytical/theoretical calculation;
2. deterministic unit tests;
3. Monte Carlo simulation with large sample sizes;
4. convergence/tolerance check;
5. stress/tail scenarios;
6. version/hash the approved configuration;
7. independent review where required.

A simulation alone is not enough if a theoretical calculation is possible.

### 6.4 Risk profiles

Low/Medium/High may vary frequency of return, volatility and tail probability.

Do not vary outcomes based on player identity, prior losses, balance, VIP status or the operator's short-term financial result.

### 6.5 Acceptance and exposure

Operator protection happens before acceptance.

Typical checks:
1. authentication;
2. account/KYC/jurisdiction;
3. Responsible Gaming;
4. balance;
5. game ruleset;
6. max stake;
7. max payout;
8. current exposure;
9. reserve/financial constraints;
10. accept/reject;
11. generate authoritative result;
12. settle.

Once accepted, do not alter the authorized result to reduce payout exposure.

---

## 7. Financial-risk strategy

Positive house edge is not sufficient to prevent insolvency.

Track:
- bankroll;
- expected profit;
- drawdown;
- risk of ruin;
- VaR/Expected Shortfall where useful;
- payout concentration;
- aggregate exposure;
- outstanding withdrawals;
- provider settlement lag;
- chargebacks/fraud;
- jackpot reserves.

Stress cases:
- unusually high-value winning streak;
- high concurrent traffic;
- payment-provider outage;
- withdrawal surge;
- fraud campaign;
- ledger/reconciliation delay.

Define operating limits from risk capacity, not marketing preference.

---

## 8. Business model strategy

### 8.1 Possible entry wedge

Do not assume day-one multi-country B2C.

A lower-complexity sequence to evaluate:

```text
Vanta Technology / Vanta Originals
→ B2B game/platform supply to licensed operators
→ prove product + economics + operating history
→ launch B2C in one selected jurisdiction
→ expand jurisdiction by jurisdiction
```

B2B is a strategy to evaluate, not a guaranteed answer. Commercial/legal feasibility must be validated.

### 8.2 Why focused entry matters

The general lesson from successful gaming companies is to establish a narrower initial advantage, prove economics and then expand.

---

## 9. Unit economics

The business is not “house edge = profit”.

Simplified:

```text
stakes/handle
→ gross gaming revenue (GGR)
→ minus bonuses/promotions
→ minus gaming duties/taxes
→ minus payment/provider costs
→ minus fraud/chargebacks
→ net gaming revenue/contribution
→ minus marketing/CAC
→ minus people/infrastructure/compliance
→ operating profit
```

Track at minimum:
- registered → depositor conversion;
- first-deposit conversion;
- D30/D90/D365 retention;
- betting frequency;
- ARPU/ARPPU;
- GGR;
- NGR;
- CAC;
- LTV;
- LTV/CAC;
- payback period;
- promotion cost;
- payment cost;
- fraud loss;
- support cost;
- compliance cost;
- tax burden;
- contribution margin.

Do not scale paid acquisition before LTV/CAC is proven.

---

## 10. Regulatory strategy

### 10.1 Jurisdiction-first

There is no assumption that one license automatically permits all target countries.

Before enabling a jurisdiction:
- operator/entity eligibility;
- local authorization;
- product/game certification;
- age/geolocation rules;
- KYC/AML/sanctions;
- Responsible Gaming;
- player-fund rules;
- reporting/audit;
- complaints/disputes;
- advertising;
- payment restrictions;
- Apple/Google distribution requirements;
- local gaming tax;
- corporate tax and permanent-establishment analysis.

### 10.2 Portugal

If Portugal is selected for B2C, confirm current SRIJ requirements directly before committing capital or launch dates.

Official reference:
- https://www.srij.turismodeportugal.pt/

### 10.3 Other useful official sources

- EU online gambling overview: https://single-market-economy.ec.europa.eu/sectors/online-gambling_en
- Malta Gaming Authority: https://www.mga.org.mt/
- UK Gambling Commission: https://www.gamblingcommission.gov.uk/
- UK HMRC gambling duties: https://www.gov.uk/gambling-duties

Rules and tax rates change. Do not copy old rates into business models without date-stamped verification.

---

## 11. Lawful tax and corporate strategy

The objective is lawful tax efficiency, liability isolation, clean ownership, investment readiness, regulatory compatibility and asset protection.

It is **not** concealment of beneficial ownership, undeclared income, sham residency/substance or tax evasion.

Possible future group shape:

```text
Vanta Holding
├── Vanta Technology / IP
├── Licensed Operator — Jurisdiction A
├── Licensed Operator — Jurisdiction B
└── Treasury/Investment vehicle where lawful/appropriate
```

Reasons to separate entities:
- isolate operating liabilities;
- separate regulated cash/player obligations;
- protect IP;
- simplify investment/M&A;
- manage jurisdiction-specific licensing/accounting.

Transfer pricing, IP ownership, intercompany agreements, residency, beneficial ownership and economic substance require specialist advice.

Useful international references include OECD CRS/AEOI, FATF beneficial ownership standards and OECD Pillar Two where applicable.

---

## 12. Security strategy

### 12.1 Untrusted-client assumption

Treat the released mobile client as inspectable and modifiable. The app cannot own critical authority.

### 12.2 Production controls

Planned/required:
- TLS outside development;
- token rotation/revocation;
- secure device storage;
- MFA/passkeys;
- step-up;
- platform attestation services;
- device-risk monitoring;
- rate limiting and anomaly detection;
- idempotency;
- immutable audit;
- KMS/HSM;
- signed/controlled releases;
- dependency lock/frozen installs;
- secret scanning;
- CodeQL/static/dependency scanning;
- independent pentest;
- incident response.

Do not rely on obfuscation as the core security boundary.

---

## 13. Session strategy

Desired player experience:
- routine close/reopen does not require login;
- access-token refresh is silent;
- refresh token is rotating/revocable;
- high-risk actions trigger step-up;
- user can inspect/revoke other sessions;
- password/security events can revoke sessions according to policy.

Target session policy should eventually specify access TTL, idle refresh lifetime, absolute lifetime, inactivity lock/biometric behavior, new-device rules and suspicious-device/risk rules.

---

## 14. Release and version strategy

Versions describe software; phases describe project execution.

Use:
- SemVer;
- alpha/beta/rc;
- monotonic native build numbers;
- Git tags/releases;
- changelog;
- reproducible dependency graph;
- build SHA/environment metadata.

See `docs/release/versioning-and-release-governance.md`.

---

## 15. Strategic milestones

### Milestone 1 — Native alpha quality
- Android physical-device stability;
- iOS build/simulator path;
- versioning;
- splash/icon;
- copy cleanup;
- motion/icons;
- session persistence;
- no known critical crashes.

### Milestone 2 — Security/platform production foundation
- staging/prod infrastructure;
- observability;
- KMS/secrets;
- MFA/device trust;
- independent testing.

### Milestone 3 — Provider/regulatory foundation
- KYC/AML;
- payments/reconciliation;
- Legal Center finalization;
- licensing/certification path.

### Milestone 4 — Game economics
- approved Plinko math;
- exposure engine;
- bankroll/stress framework;
- production game pipeline.

### Milestone 5 — Commercial pilot
- B2B or selected B2C launch model;
- measurable acquisition/retention/economics;
- controlled capital exposure.

### Milestone 6 — Expansion
- add games only with approved math;
- add jurisdictions only with verified compliance/economics;
- scale marketing only with proven LTV/CAC.

---

## 16. Decision gates

### Production game gate

Requires evidence for licensing, KYC/AML, payments, Responsible Gaming, game math, risk, wallet/ledger, security, monitoring and legal/store requirements.

### New-jurisdiction gate

Requires current legal opinion, tax model, provider availability, market economics, support/complaints plan and technical distribution controls.

### New-game gate

Requires rules, math, simulation, risk, certification if applicable, UX/accessibility, server-authoritative settlement and monitoring.

---

## 17. Strategic anti-goals

Vanta should not:
- launch many games before one is excellent;
- fake live features to make the MVP look complete;
- put secrets or authority in the app;
- alter outcomes by player;
- enter markets only because a headline tax rate looks lower;
- confuse secrecy with lawful planning;
- scale marketing before unit economics;
- call a successful APK a production launch;
- sacrifice Responsible Gaming/security to increase short-term revenue.
