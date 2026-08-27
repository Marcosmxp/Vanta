# Vanta — Product, Business and Operating Strategy

**Status:** canonical strategic product document.  
**Last consolidated:** 2026-08-25.  
**Scope:** product vision, objectives, measurable goals, player experience, monetization, game economics, risk, security, regulatory sequencing and lawful corporate strategy.

This document does not authorize production operation. Targets below are internal planning targets or decision gates until supported by real evidence. Jurisdiction-specific legal, tax, licensing and accounting decisions require qualified professional review.

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

### Long-term vision

Build Vanta into a trusted gaming technology and operating platform capable of supporting:
- **Vanta Originals** as differentiated first-party games;
- B2B distribution of games/technology to licensed operators where commercially attractive;
- selected B2C operation only in jurisdictions where licensing, economics, providers and capital requirements are justified;
- jurisdiction-by-jurisdiction expansion rather than uncontrolled geographic growth;
- a reusable financial, risk, security and compliance platform beneath multiple games.

Vanta should become valuable because of its technology, game portfolio, operating discipline, brand and economics — not because it takes uncontrolled regulatory or financial risk.

---

## 2. Strategic hierarchy

Vanta decisions should follow this order:

```text
1. Protect player funds, identity and account security
2. Preserve legal/regulatory boundaries
3. Preserve game integrity and mathematical correctness
4. Deliver excellent player UX
5. Prove unit economics
6. Scale product, marketing and jurisdictions
```

A lower item must not be optimized by violating a higher item.

Examples:
- do not weaken KYC or Responsible Gaming to improve conversion;
- do not alter accepted game outcomes to protect short-term operator profit;
- do not introduce insecure session behavior to reduce implementation work;
- do not enter a jurisdiction only because its headline tax rate appears attractive;
- do not scale paid acquisition before retention and LTV/CAC are understood.

---

## 3. North-star objectives

### Objective A — Trust and transparency

Players must be able to understand:
- their balance;
- what happened to their money;
- what they are allowed to do;
- account/KYC state;
- Responsible Gaming controls;
- where rules, legal information and support live.

**Success condition:** important player states are understandable without exposing internal engineering terminology.

### Objective B — Low-friction secure account access

Routine app use must not repeatedly ask for passwords.

Target behavior:
- sign in once;
- persist session securely;
- silent access-token refresh;
- reauthentication only when the session is expired/revoked or policy requires it;
- step-up authentication for sensitive/risky operations.

**Success condition:** normal minimize/close/reopen behavior does not create avoidable login friction while compromised/revoked sessions still fail closed.

### Objective C — Recognizable premium experience

Vanta should feel like its own product:
- final icon/logo;
- custom splash/launch;
- controlled motion;
- premium dark design;
- consistent iconography;
- original game artwork;
- polished empty/loading/error states.

**Success condition:** public-facing screens no longer look like a development scaffold or generic Expo app.

### Objective D — Safe financial system

Money never depends on client-calculated truth.

All payment, reservation, game, payout and reconciliation effects must be server-side, transactional, idempotent and auditable.

**Success condition:** manipulating or replacing the mobile client cannot create money, alter canonical balances or settle an unauthorized transaction.

### Objective E — Commercially viable game economics

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

**Success condition:** the operator understands both expected return and downside/exposure before a game ruleset can accept production wagers.

### Objective F — Responsible and lawful growth

Do not treat Europe or the world as one regulatory market.

Enter jurisdictions deliberately and validate licensing, tax, payment, KYC/AML, store distribution and economics before launch.

**Success condition:** every enabled market has an explicit legal, regulatory, financial and technical authorization package.

### Objective G — Traceable software operation

Every distributed build must be identifiable.

**Success condition:** a support/security report can identify exact Vanta product version, native build number, Git commit, environment and release channel.

---

## 4. Strategic horizons and measurable goals

Targets are grouped by maturity. A later horizon does not override unfinished safety gates in an earlier one.

### Horizon 1 — Native Alpha

**Purpose:** turn the integrated MVP into a stable, traceable native alpha suitable for controlled internal testing.

Required goals:
- Android physical-device smoke test completed for core flows;
- iOS native build/simulator path validated even if physical iPhone testing remains pending;
- session survives normal app minimize, close and reopen while valid;
- silent access-token refresh validated;
- logout/revocation validated;
- no known reproducible critical native crash in the core smoke-test path;
- Wallet empty state and other server collection boundaries do not crash on `null`/empty data;
- native Vanta icon/splash/launch experience replaces generic development presentation;
- bottom navigation uses consistent icons + labels;
- shared motion foundation exists and honors reduced-motion preferences;
- player-facing technical copy is removed from primary screens;
- Legal Center entry point and required categories are reviewable;
- app version/build/Git provenance is visible to developers/testers;
- no backend secret, token, database credential or provider credential exists in the mobile bundle;
- all production payment/KYC/game mutation surfaces that are not ready remain blocked.

**Alpha exit gate:** Phase 20 cannot close solely because an APK installs. Native runtime, session, security/config review, documentation and release provenance must all have evidence.

### Horizon 2 — Production Security and Platform Foundation

**Purpose:** build the operational controls required before any regulated real-money pilot.

Required goals:
- staging and production environments separated from development;
- production secrets stored through managed secret/KMS strategy;
- observability for authentication, API, wallet, game and provider boundaries;
- alerts/SLOs for critical financial and authentication services;
- backup/restore and disaster-recovery procedures tested;
- trusted reverse-proxy/client-IP policy implemented;
- MFA/passkey/step-up policy implemented for sensitive actions;
- device integrity/risk signals integrated where appropriate;
- session absolute lifetime, recovery and global revocation policies defined;
- release signing and dependency reproducibility hardened;
- independent security assessment completed before real-money production gate.

**Security exit gate:** no unresolved Critical security finding and no knowingly exploitable High finding at the production authorization boundary.

### Horizon 3 — Provider and Regulatory Foundation

**Purpose:** connect real external regulated capabilities without bypassing Vanta's financial/security model.

Required goals:
- selected jurisdiction documented and approved;
- production KYC/AML provider integration;
- signed and replay-safe provider callbacks;
- PSP/payment integration with tokenization/hosted controls;
- deposit/withdraw idempotency;
- reconciliation and ledger posting;
- withdrawal destination ownership verification;
- Responsible Gaming enforcement at every applicable financial/game command;
- legal documents versioned and date-effective;
- required operator/regulator/license information configured only from verified data;
- store/distribution eligibility validated.

**Provider/regulatory exit gate:** no real-money action becomes available merely because the UI exists; the complete provider, policy, ledger and regulatory chain must be present.

### Horizon 4 — Game Mathematics and Financial Risk

**Purpose:** prove that the first production Vanta Original has controlled economics and exposure.

Required goals:
- formal Plinko probability model;
- approved payout tables per risk profile;
- theoretical RTP and house edge calculated independently of simulation;
- deterministic tests for rules and payouts;
- Monte Carlo/stress validation;
- variance/volatility and tail-risk model;
- max stake and max payout derived from risk capacity;
- bankroll and reserve assumptions documented;
- risk-of-ruin/drawdown analysis;
- aggregate exposure model;
- exact math/ruleset version linked to each historical bet;
- change-control gate for every math revision.

**Game-math exit gate:** production ruleset cannot be enabled without approved mathematical evidence and exposure limits.

### Horizon 5 — Controlled Commercial Pilot

**Purpose:** validate whether Vanta has a sustainable business, not merely working software.

Pilot must measure:
- registration conversion;
- KYC completion where applicable;
- first-deposit conversion;
- D1/D7/D30 retention initially, then D90/D365 as cohorts mature;
- active-player frequency;
- GGR and NGR;
- promotion cost;
- payment/provider cost;
- fraud/chargeback loss;
- support/compliance cost;
- CAC;
- LTV;
- LTV/CAC;
- CAC payback period;
- contribution margin;
- bankroll/exposure utilization.

**Initial economic decision thresholds:** these are planning hypotheses, not promises.
- do not scale paid acquisition while contribution economics are negative or unclear;
- seek an LTV/CAC model with substantial safety margin before aggressive scaling; a working planning benchmark can be `>= 3x` once LTV data is statistically credible;
- target CAC payback short enough for available working capital; exact acceptable months must be derived from financing/cash-flow capacity rather than copied from another company;
- suspend or redesign acquisition channels that create growth without positive expected contribution.

### Horizon 6 — Expansion

Expand only after the pilot proves operational and commercial control.

Goals:
- add games through the same math/risk/certification gate;
- add jurisdictions through the same legal/tax/provider gate;
- scale marketing only with proven cohort economics;
- maintain reliability/security performance as volume grows;
- assess B2B and B2C expansion separately rather than assuming one business model fits every market.

---

## 5. Product KPI framework

Vanta should distinguish **quality gates** from **business KPIs**.

### 5.1 Reliability and release KPIs

Track:
- crash-free sessions/users when production telemetry exists;
- app startup failures;
- API error rate;
- authentication success/error rate;
- silent refresh success rate;
- payment/KYC/provider callback failures;
- release rollback rate;
- time to identify exact affected build/commit.

Before public production, define numeric SLOs from load tests and pilot evidence rather than inventing them prematurely.

### 5.2 Player experience KPIs

Track:
- onboarding completion;
- registration completion;
- login recovery/failure rate;
- KYC completion/time where applicable;
- deposit funnel completion;
- withdrawal completion/time;
- support contact rate per active player;
- repeated error loops;
- feature discovery/use;
- accessibility defects.

### 5.3 Responsible Gaming and trust KPIs

Track operationally where lawful/appropriate:
- Responsible Gaming control usage;
- successful enforcement of limits/time-outs/self-exclusion;
- attempted blocked actions;
- complaints and dispute categories;
- payment/withdrawal support cases;
- account-takeover/security incidents.

These metrics are for safety and product quality, not for targeting vulnerable players.

### 5.4 Commercial KPIs

Track:
- registrations;
- active players;
- first-time depositors;
- conversion rates;
- cohort retention;
- handle/stakes where applicable;
- GGR;
- NGR;
- ARPU/ARPPU;
- CAC;
- LTV;
- LTV/CAC;
- payback period;
- contribution margin;
- tax burden;
- provider/payment costs;
- fraud/chargeback losses.

### 5.5 Game/risk KPIs

Track:
- theoretical RTP;
- observed RTP by statistically meaningful sample size;
- payout distribution deviations;
- volatility;
- maximum drawdown;
- aggregate exposure;
- concentration by payout/ruleset;
- risk limit rejections;
- bankroll/reserve utilization;
- settlement/reconciliation exceptions.

Observed short-term RTP must not be used to manipulate future player outcomes to “correct” the operator result.

---

## 6. Player experience strategy

### 6.1 Plain-language copy

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

### 6.2 Home

Home should answer:
- what can I play?
- what is my balance?
- is anything requiring attention?
- what happened recently?

Avoid turning Home into documentation.

### 6.3 Wallet

Wallet should prioritize:
- available balance;
- reserved balance where useful;
- deposit;
- withdrawal;
- transaction history;
- clear states/errors.

The player does not need to know how the ledger is implemented.

### 6.4 Profile

Profile should contain:
- identity summary;
- KYC status;
- account/security;
- Responsible Gaming;
- support;
- Legal Center;
- logout;
- app version/about.

### 6.5 Legal Center

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

## 7. Visual identity, assets and motion

### 7.1 Visual principle

Premium financial product + gaming, not cheap casino neon.

Use assets only when they improve identity or comprehension.

### 7.2 Required asset families

- Vanta logo;
- app icon;
- Android adaptive icon;
- launch/splash assets;
- game cards/thumbnails;
- Vanta Originals artwork;
- onboarding/state illustrations where useful;
- consistent navigation/action icons.

### 7.3 Bottom navigation

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

### 7.4 Motion hierarchy

**Navigation:** subtle.  
**Buttons/cards:** tactile microfeedback.  
**Success/errors:** clear short feedback.  
**Games:** expressive animation.  
**Legal/financial reading:** restrained.

Respect reduced-motion accessibility settings.

### 7.5 Launch sequence

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

## 8. Game portfolio strategy

Start with one polished Vanta Original rather than many shallow games.

Initial:
- Plinko.

Potential later:
- Crash;
- Mines;
- Dice;
- additional original games.

Before adding another production game, prove:
- reliability of the existing pipeline;
- approved math/risk;
- player interest/retention contribution;
- operational monitoring;
- expected commercial value;
- ability to support it safely.

A large game catalog is not itself a success metric.

---

## 9. Game math strategy

### 9.1 Principle

Operator advantage is mathematical expectation over volume, not a hidden decision that a particular user must lose.

```text
RTP = Σ(P_i × payout_i)
House Edge = 1 - RTP
```

Example:
- RTP 96%;
- theoretical house edge 4%.

This does **not** guarantee profit in a short period.

### 9.2 Required model per ruleset

- exact outcome probabilities;
- payout table;
- theoretical RTP;
- variance;
- volatility profile;
- max multiplier;
- tail probability;
- expected payout;
- confidence/tolerance model;
- max stake;
- max payout;
- bankroll requirement;
- aggregate exposure.

### 9.3 Simulation

For every production math revision:
1. analytical/theoretical calculation;
2. deterministic unit tests;
3. Monte Carlo simulation with large sample sizes;
4. convergence/tolerance check;
5. stress/tail scenarios;
6. version/hash the approved configuration;
7. independent review where required.

A simulation alone is not enough if a theoretical calculation is possible.

### 9.4 Risk profiles

Low/Medium/High may vary frequency of return, volatility and tail probability.

Do not vary outcomes based on player identity, prior losses, balance, VIP status or the operator's short-term financial result.

### 9.5 Acceptance and exposure

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

## 10. Financial-risk strategy

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

## 11. Business model strategy

### 11.1 Possible entry wedge

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

### 11.2 B2B hypothesis

Potential advantages to validate:
- lower direct player-acquisition burden;
- ability to monetize Vanta Originals before becoming a full operator;
- operating history useful for future partnerships/investment;
- reuse of game math, integration and platform capabilities across partners.

Risks/costs to validate:
- supplier licensing/certification obligations;
- integration/support cost;
- revenue share/commercial dependency;
- operator concentration;
- certification per market/game;
- weaker direct control of player relationship.

### 11.3 B2C hypothesis

Potential advantages:
- direct ownership of player experience and economics;
- control over brand, wallet and cross-sell;
- higher potential value capture if acquisition/retention are strong.

Risks/costs:
- licensing/capital requirements;
- KYC/AML and payments;
- player-fund obligations;
- customer acquisition cost;
- Responsible Gaming/compliance operations;
- gaming duties/taxes;
- fraud/chargebacks;
- support/disputes;
- store/distribution restrictions.

### 11.4 Strategic decision rule

Choose B2B, B2C or a staged hybrid based on evidence for:
- capital required;
- time to lawful revenue;
- margin potential;
- regulatory complexity;
- distribution access;
- provider availability;
- technology differentiation;
- customer acquisition economics;
- downside risk.

---

## 12. Unit economics

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
- D1/D7/D30/D90/D365 retention as cohorts mature;
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

Do not scale paid acquisition before LTV/CAC and contribution economics are credible.

---

## 13. Regulatory strategy

### 13.1 Jurisdiction-first

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

### 13.2 Market-selection scorecard

Evaluate candidate markets using a dated scorecard rather than intuition alone:
- regulatory clarity;
- licensing cost/time;
- required guarantees/capital;
- gaming tax;
- corporate tax implications;
- payment-provider availability;
- KYC/AML provider availability;
- app-store/distribution feasibility;
- competitive intensity;
- addressable market;
- expected CAC;
- expected retention/LTV;
- language/support burden;
- fraud/chargeback risk;
- banking/treasury feasibility;
- legal/accounting operating cost.

No market should be selected solely because of a low headline tax rate.

### 13.3 Portugal

If Portugal is selected for B2C, confirm current SRIJ requirements directly before committing capital or launch dates.

Official reference:
- https://www.srij.turismodeportugal.pt/

### 13.4 Other useful official sources

- EU online gambling overview: https://single-market-economy.ec.europa.eu/sectors/online-gambling_en
- Malta Gaming Authority: https://www.mga.org.mt/
- UK Gambling Commission: https://www.gamblingcommission.gov.uk/
- UK HMRC gambling duties: https://www.gov.uk/gambling-duties

Rules and tax rates change. Do not copy old rates into business models without date-stamped verification.

---

## 14. Lawful tax and corporate strategy

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
- protect/organize IP;
- simplify investment/M&A;
- manage jurisdiction-specific licensing/accounting.

Transfer pricing, IP ownership, intercompany agreements, residency, beneficial ownership and economic substance require specialist advice.

Useful international references include OECD CRS/AEOI, FATF beneficial ownership standards and OECD Pillar Two where applicable.

---

## 15. Security strategy

### 15.1 Untrusted-client assumption

Treat the released mobile client as inspectable and modifiable. The app cannot own critical authority.

### 15.2 Production controls

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

## 16. Session strategy

Desired player experience:
- routine close/reopen does not require login;
- access-token refresh is silent;
- refresh token is rotating/revocable;
- high-risk actions trigger step-up;
- user can inspect/revoke other sessions;
- password/security events can revoke sessions according to policy.

Target session policy should eventually specify:
- access TTL;
- idle refresh lifetime;
- absolute lifetime;
- inactivity lock/biometric behavior;
- new-device rules;
- suspicious-device/risk rules;
- password/account-recovery revocation behavior.

---

## 17. Release and version strategy

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

## 18. Decision gates

### 18.1 Native Alpha gate

Requires:
- core Android physical-device path stable;
- iOS build path validated;
- persistent session evidence;
- version/build provenance;
- native branding baseline;
- core copy cleanup;
- no known critical native crash in required smoke tests;
- blocked production capabilities still blocked.

### 18.2 Production game gate

Requires evidence for:
- legal authorization;
- KYC/AML;
- payments;
- Responsible Gaming;
- game math;
- risk/exposure;
- wallet/ledger;
- security;
- monitoring;
- legal/store requirements.

### 18.3 New-jurisdiction gate

Requires:
- current legal opinion;
- tax model;
- provider availability;
- market economics;
- support/complaints plan;
- technical distribution controls;
- capital/liquidity plan.

### 18.4 New-game gate

Requires:
- rules;
- math;
- simulation;
- risk;
- certification if applicable;
- UX/accessibility;
- server-authoritative settlement;
- monitoring;
- business rationale.

### 18.5 Marketing-scale gate

Requires credible evidence that acquisition creates positive expected contribution rather than vanity growth.

At minimum:
- cohort retention measured;
- CAC measured by channel;
- LTV methodology documented;
- promotion/provider/tax/fraud costs included;
- cash-flow/payback implications understood.

---

## 19. Strategic anti-goals

Vanta should not:
- launch many games before one is excellent;
- fake live features to make the MVP look complete;
- put secrets or authority in the app;
- alter outcomes by player;
- enter markets only because a headline tax rate looks lower;
- confuse secrecy with lawful planning;
- scale marketing before unit economics;
- call a successful APK a production launch;
- sacrifice Responsible Gaming/security to increase short-term revenue;
- treat gross revenue as profit;
- rely on a positive RTP margin while ignoring tail risk/liquidity;
- hide technical debt by changing documentation status without evidence.

---

## 20. Current priority stack

Until Phase 20 is closed, strategic execution priority remains:

```text
1. Native/session stability and evidence
2. Release/version provenance
3. UX copy + native identity + motion polish
4. Legal Center completeness review
5. Security/config/artifact inspection
6. iOS native validation path
7. Phase 20 sign-off
8. Production platform/security foundation
9. Provider/regulatory integration
10. Game mathematics/risk approval
11. Controlled commercial pilot
12. Evidence-driven expansion
```

This order may change only through a documented decision when new evidence materially changes risk or business feasibility.
