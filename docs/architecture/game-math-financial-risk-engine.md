# Vanta — Game Mathematics and Financial Risk Engine

**Status:** canonical architecture/specification for future Phase 25.  
**Last consolidated:** 2026-08-25.  
**Current game:** Plinko.  
**Production state:** NOT ENABLED.

This document defines the mathematical, bankroll, exposure and configuration controls required before any Vanta Original can be used for production wagering.

It intentionally separates **game mathematics** from the later **production bet/settlement pipeline**. A correct RTP model is necessary but not sufficient for a safe operator.

---

## 1. Core principles

1. Production game outcomes are server-authoritative.
2. Player identity/history/balance/VIP status must not change the RNG distribution or accepted result.
3. Operator advantage is a documented mathematical expectation over volume, not a hidden per-player decision.
4. Positive house edge does **not** eliminate variance, drawdown or risk of ruin.
5. Risk protection occurs **before bet acceptance** through limits/exposure/bankroll rules.
6. Once a wager is accepted, its result must not be altered to protect the operator from a payout.
7. Every production ruleset is immutable/versioned and historically reconstructable.
8. Theoretical math, automated tests, simulation and risk approval must agree before activation.
9. Money uses integer minor units/checked arithmetic; never floating-point canonical settlement.
10. No ruleset becomes production-active merely because its visual gameplay looks correct.

---

## 2. Current Plinko implementation baseline

Current backend package:

```text
backend/internal/games/plinko/
├── engine.go
├── rules.go
├── engine_test.go
├── rules_test.go
└── README.md
```

### Current secure drop model

`SecureEngine`:
- uses Go `crypto/rand`;
- supports 8–16 rows;
- reads cryptographic entropy;
- maps one unbiased bit per row to Left/Right;
- increments the final slot for every Right move;
- fails closed if entropy cannot be read.

For `n` rows, the final slot `K` is the count of Right outcomes among `n` independent fair binary decisions.

Therefore the theoretical slot distribution is binomial:

```text
P(K = k) = C(n, k) / 2^n

for k = 0..n
```

This analytical distribution must be treated as part of the ruleset/game-math evidence.

### Current ruleset shape

The existing `Ruleset` includes:
- ID;
- version;
- rows;
- currency;
- min stake;
- max stake;
- per-slot multipliers in basis points;
- `ProductionApproved` flag.

Multipliers use:

```text
10,000 bps = 1.00x
```

Current payout helper effectively computes:

```text
payoutMinor = floor(stakeMinor × multiplierBps / 10,000)
```

with overflow checks.

### Current production boundary

The repository does **not** contain a production-approved payout table and does not expose a public real-money Plinko bet endpoint. This must remain true until Phase 25 math/risk and Phase 26 production settlement requirements are completed.

---

## 3. Terminology and money conventions

### Stake

Amount the player commits to the wager, stored in currency minor units.

### Gross payout

Amount credited back for a winning outcome according to the multiplier convention.

If multiplier `m = 2.00x` and stake is €10, the current payout convention implies gross payout €20.

### Net player profit

```text
netPlayerProfit = grossPayout - stake
```

### Operator net result before non-game costs

```text
operatorGameResult = stake - grossPayout
```

### RTP

Expected gross payout divided by stake:

```text
RTP = Σ p_i × m_i
```

where `p_i` is outcome probability and `m_i` is the gross-payout multiplier.

### House edge

```text
HouseEdge = 1 - RTP
```

Example only:

```text
RTP = 0.96
HouseEdge = 0.04 = 4%
```

This does not guarantee a 4% profit over a short sample.

---

## 4. Exact Plinko RTP calculation

For an `n`-row Plinko ruleset with multiplier `m_k` for slot `k`:

```text
p_k = C(n, k) / 2^n

RTP = Σ(k=0..n) p_k × m_k
```

If multipliers are stored in basis points:

```text
m_k = multiplierBps[k] / 10,000
```

The production math tooling should calculate using exact/integer/rational-friendly representations wherever possible rather than relying on imprecise floating-point comparisons.

### Required validation

For every candidate ruleset:
- slot count equals `rows + 1`;
- all probabilities sum exactly/within representation tolerance to 1;
- all multipliers are non-negative and within approved bounds;
- RTP is derived from the exact table;
- house edge matches the approved policy;
- maximum payout is calculable without integer overflow;
- rounding behavior is explicit and included in empirical tests.

---

## 5. Variance and volatility

House edge alone is not a risk model.

For return multiplier random variable `M`:

```text
E[M] = RTP

Var(M) = Σ p_i × (m_i - RTP)^2

StdDev(M) = sqrt(Var(M))
```

For stake `S`, the gross-payout variance scales with `S²`.

For operator net result per wager `X = S - S×M` (ignoring rounding/costs):

```text
E[X] = S × (1 - RTP)
```

but actual short-run results can deviate materially from this expectation.

Each ruleset should publish internally:
- RTP;
- house edge;
- variance;
- standard deviation;
- hit/return frequency definitions;
- max multiplier;
- probability of max multiplier;
- probability of payout above selected thresholds;
- expected net operator result per stake unit.

---

## 6. Risk profiles: Low / Medium / High

Risk profiles are allowed only as explicit approved rulesets/configurations.

They may differ by:
- rows;
- multiplier table;
- frequency of small returns;
- tail multipliers;
- variance/volatility.

They must **not** differ dynamically because of:
- player identity;
- previous wins/losses;
- account balance;
- VIP status;
- operator short-term profit/loss;
- whether the player is considered “lucky”.

Each profile needs its own:
- version;
- theoretical calculation;
- simulation evidence;
- risk limits;
- certification/reference where required.

---

## 7. Ruleset lifecycle and immutable configuration

Recommended lifecycle:

```text
DRAFT
  ↓
MATH_CALCULATED
  ↓
TESTS_PASS
  ↓
SIMULATION_PASS
  ↓
RISK_APPROVED
  ↓
COMPLIANCE/CERTIFICATION_APPROVED (where required)
  ↓
SCHEDULED
  ↓
ACTIVE
  ↓
RETIRED
```

A production-active ruleset must not be edited in place.

A material change creates a new version.

Example identity:

```text
plinko-medium-v1
rulesetVersion: 1.0.0
rows: 14
currency: EUR
mathHash: <content hash>
effectiveFrom: <timestamp>
```

The exact RTP/multipliers in this example are intentionally omitted until calculated and approved.

### Recommended future metadata

The current Go struct may later be complemented by persisted/config metadata such as:
- risk profile;
- theoretical RTP in basis points/high precision;
- house edge;
- variance/stddev;
- max multiplier;
- max gross payout;
- min/max stake;
- ruleset/math content hash;
- created/approved/effective/retired timestamps;
- approval references;
- certification/reference IDs where applicable;
- simulation evidence version;
- risk-policy version.

Do not put secret RNG material in a public/client ruleset.

---

## 8. Analytical tests before simulation

Because current Plinko probabilities are analytically known, theoretical tests should come first.

Required automated checks:
- binomial probability generation for each supported row count;
- probability sum;
- symmetry properties of current fair Left/Right engine;
- slot range 0..rows;
- payout-table length;
- multiplier bounds;
- payout arithmetic overflow;
- payout rounding behavior;
- exact/expected RTP calculation;
- expected house edge;
- variance calculation;
- max payout/liability calculation;
- ruleset immutability/hash consistency.

Simulation verifies implementation/statistical behavior; it does not replace exact math where exact math is available.

---

## 9. Monte Carlo simulation framework

A dedicated offline/test simulator should be created separately from the production RNG path.

### Goals

- verify empirical slot frequencies converge toward theoretical probabilities;
- verify empirical RTP converges toward theoretical RTP;
- measure drawdown paths;
- estimate bankroll/risk distributions;
- stress limits/exposure policies;
- catch coding/configuration mistakes.

### Reproducibility

Production CSPRNG must remain non-deterministic/secure. Test simulation should support deterministic seeded pseudo-random runs for reproducible CI/research, while also supporting independent random seeds for variance studies.

Do not substitute deterministic test RNG into the production engine.

### Simulation tiers

Possible tiers:

```text
CI smoke
  smaller deterministic sample, fast regression

Candidate ruleset validation
  millions of rounds across multiple seeds

Offline risk/stress study
  larger batched simulations as needed for confidence/tail analysis
```

Sample counts should be chosen from statistical precision requirements, not an arbitrary “large number”.

### Evidence per run

Store:
- ruleset/math hash;
- simulator version/commit;
- seed(s) where deterministic;
- sample count;
- empirical slot frequencies;
- empirical RTP;
- theoretical RTP;
- deviation/error;
- confidence intervals/tolerances;
- bankroll start/end;
- maximum drawdown;
- worst payout cluster;
- pass/fail criteria.

---

## 10. Statistical acceptance criteria

The math tooling should define tolerances before running a candidate, rather than accepting results because they “look close”.

Examples of checks:
- each slot frequency lies within an expected statistical confidence interval;
- empirical RTP lies within a predeclared tolerance/confidence interval around theoretical RTP;
- no unexplained systematic bias across independent seeds;
- payout arithmetic exactly matches the configured table;
- observed extreme-event frequency is compatible with theoretical probability given sample size.

For rare tail outcomes, normal approximations may be poor; use suitable binomial/exact/large-deviation methods or sufficiently designed simulation analysis.

---

## 11. Bankroll model

A profitable expected value does not guarantee solvency.

Define:

```text
Bankroll = operator risk capital allocated to game liabilities
```

This is distinct from:
- player safeguarded funds where regulation requires segregation;
- operating cash;
- tax liabilities;
- PSP settlement receivables;
- marketing budget.

The risk engine must model capital actually available to absorb game-result variance.

### Single-wager worst case

For stake `S` and maximum gross-payout multiplier `Mmax`:

```text
maxGrossPayout = S × Mmax

maxNetOperatorLoss = max(0, maxGrossPayout - S)
```

The platform must be able to fund accepted liabilities under its approved policy.

### Example risk lesson

A 4% theoretical edge does not make a €10 million potential payout safe if the available bankroll is only €1 million.

Expected value and maximum/tail exposure answer different questions.

---

## 12. Max-stake and max-payout engine

Production stake limits should be derived from risk capacity, not only marketing preference.

Inputs may include:
- game/ruleset max multiplier;
- per-bet max payout policy;
- available bankroll/risk capital;
- currently reserved game liability;
- aggregate concurrent exposure;
- per-player regulatory/RG limits;
- currency/liquidity constraints;
- provider/payment settlement considerations where relevant.

Conceptual constraints:

```text
stake <= ruleset.maxStake
stake <= player/responsibleGamingLimit
potentialPayout <= gameMaxPayout
potentialPayout <= availableExposureCapacity
```

A later risk engine may calculate a lower dynamic **acceptance limit** from current aggregate exposure, but it must not change the payout distribution after acceptance.

---

## 13. Aggregate exposure

Risk is not just one wager.

Track at least:
- accepted unresolved wagers;
- maximum possible payout per unresolved wager;
- exposure by game/ruleset/currency;
- exposure by high-tail slot/multiplier class where useful;
- concurrent session/player concentration;
- withdrawal liabilities;
- jackpot/reserve obligations if introduced later;
- provider settlement lag/fraud reserves separately from pure game math.

### Exposure accounting principle

Before accepting a wager, reserve or otherwise account for its worst-case/approved risk contribution under a documented policy.

On settlement, release the reservation and post the actual financial result transactionally.

The exact risk-reservation accounting design should integrate with the canonical ledger without turning Redis into financial truth.

---

## 14. Risk of ruin and drawdown

Phase 25 must evaluate bankroll survival, not only average profit.

Metrics:
- probability bankroll falls below zero/required reserve;
- probability of drawdown >10%, >25%, >50% or policy thresholds;
- maximum drawdown distribution;
- expected drawdown;
- recovery time distribution where meaningful;
- probability of hitting operational capital limits over a defined horizon;
- expected profit distribution, not only mean.

### Simulation model

For each simulated wager sequence:

```text
bankroll_(t+1) = bankroll_t + stake_t - payout_t - modeled game-specific costs
```

Keep payment/marketing/tax costs in a broader business model; do not hide them inside RTP.

### Risk of ruin gate

Production approval should define an acceptable risk threshold based on the operator's capital policy and regulatory obligations. The number must be set by accountable finance/risk governance, not invented inside game code.

---

## 15. VaR and Expected Shortfall

For operator risk analysis, where useful:

### Value at Risk (VaR)

Estimate a loss quantile over a defined wager volume/time horizon.

Example concept:

```text
99% VaR = loss level exceeded in ~1% of modeled periods
```

### Expected Shortfall (ES)

Average loss conditional on being beyond the selected VaR threshold.

ES is particularly useful because gaming payout distributions may have tail risk that a single quantile does not describe well.

All VaR/ES outputs must state:
- horizon;
- confidence level;
- bankroll/stake assumptions;
- ruleset version;
- volume distribution assumptions;
- simulation/model version.

---

## 16. Stress scenarios

Required stress families should include:

### Game-result stress
- repeated high-multiplier winners;
- unusually adverse but statistically possible sequence;
- maximum-stake concentration;
- several simultaneous tail outcomes.

### Traffic/concurrency stress
- sudden high wager volume;
- many accepted bets before settlement;
- duplicate/replayed requests;
- delayed ledger/outbox processing.

### Operational stress
- payment-provider outage during large withdrawal demand;
- reconciliation delay;
- fraud/chargeback wave;
- database failover/temporary outage;
- risk-service degradation.

### Configuration stress
- incorrect multiplier table;
- wrong RTP metadata;
- overflow boundary;
- stale/retired ruleset accidentally selected;
- inconsistent mobile display vs server ruleset.

Sensitive commands should fail closed when authoritative risk/math state is unavailable.

---

## 17. Production wager acceptance sequence

Phase 25 defines math/risk. Phase 26 implements the trusted production wager pipeline.

Required order conceptually:

```text
POST wager

1. authenticate session
2. identify player from principal
3. validate account status
4. validate jurisdiction/KYC eligibility
5. validate Responsible Gaming policy
6. validate idempotency/replay key
7. load exact ACTIVE approved ruleset
8. validate stake/currency
9. validate available balance
10. calculate max potential liability
11. evaluate per-bet + aggregate exposure
12. reserve stake/risk capacity transactionally
13. ACCEPT wager durably
14. generate authoritative CSPRNG outcome
15. resolve slot/multiplier from accepted ruleset
16. calculate payout with checked integer arithmetic
17. settle canonical ledger transactionally
18. persist bet/result/ruleset hash/audit
19. release exposure reservation
20. return authoritative result to mobile
```

The exact transaction/outbox split must guarantee that an accepted wager cannot disappear or settle twice after process failure.

---

## 18. Acceptance must precede outcome

Critical fairness rule:

> The system must decide whether it is willing and able to accept the wager **before** generating/revealing the authoritative outcome.

Do not:
- generate a losing/winning result and then decide whether exposure is acceptable;
- reroll because payout is inconvenient;
- reject only after learning that the player would win;
- vary RNG or multiplier table based on current operator P&L.

If capacity is insufficient, reject the wager before outcome generation with a clear server-controlled reason.

---

## 19. RNG integrity

Current engine uses `crypto/rand`, which is the correct foundational direction.

Production requirements:
- CSPRNG failure fails closed;
- no client entropy controls canonical result;
- no predictable seed exposed to client;
- exact engine/ruleset version associated with result;
- RNG code included in independent review/certification where required;
- monitoring detects abnormal result distribution without changing individual results.

If provably-fair mechanisms are considered later, they must be designed separately with cryptographic review and regulatory compatibility; do not bolt them onto settlement casually.

---

## 20. Rounding and precision

Current payouts use integer minor units and basis-point multipliers.

Phase 25 must explicitly test/document:
- integer division rounding direction;
- impact of rounding on effective RTP for small stakes;
- min stake needed to keep rounding distortion acceptable;
- currency minor-unit differences;
- overflow limits;
- maximum multiplier/stake product;
- whether any jurisdiction requires a particular published rounding behavior.

Theoretical RTP should account for the **actual settlement arithmetic** at permitted stake values when rounding materially changes expected return.

---

## 21. Multi-currency considerations

A ruleset currently carries a currency field.

Do not assume one stake table is economically/risk-equivalent across currencies.

Per currency/market consider:
- minor units;
- min/max stake;
- max payout;
- bankroll allocated in that currency;
- FX exposure if operator capital is held elsewhere;
- legal/local limits;
- rounding effects.

Do not perform canonical wager settlement using live client-supplied FX conversions.

---

## 22. Game-math configuration storage

Production configurations should be loaded from a controlled server-side source with:
- schema validation;
- content hashing;
- immutable historical versions;
- change approvals;
- environment separation;
- deployment audit;
- rollback to a previously approved version without rewriting history.

The client may receive public display information such as rows/risk/profile/multipliers/rules, but client configuration never decides canonical settlement.

---

## 23. Approval and separation of duties

As the project matures, avoid one-person silent production math changes.

Recommended approval roles/process:
- game developer creates candidate;
- math/risk validation calculates and simulates;
- finance/risk owner approves exposure/capital assumptions;
- compliance/legal confirms market requirements;
- certification/independent review where required;
- release process deploys exact approved hash/version.

A small early team may combine roles, but the audit trail should still show explicit review/checkpoints.

---

## 24. Monitoring after launch

Production monitoring should compare observed behavior against expectations without manipulating results.

Track:
- wager count/stake volume;
- actual gross payout;
- realized RTP over multiple windows;
- expected statistical confidence bands;
- payout tail events;
- exposure capacity;
- rejected wagers by risk/limit reason;
- settlement failures/retries;
- duplicate/replay attempts;
- bankroll/risk utilization.

### Important

Short-term realized RTP will naturally vary. Do not trigger automatic odds changes merely because realized RTP is temporarily player-favorable.

Investigate statistically significant/configuration/system anomalies with controlled governance.

---

## 25. Emergency controls

Valid emergency controls include:
- stop accepting **new** wagers for a game/ruleset;
- reduce future max stakes through approved policy;
- retire a ruleset and activate another approved version;
- pause a market/game during integrity incident;
- block new actions when settlement/risk authority is unavailable.

Invalid emergency behavior:
- changing already accepted outcomes;
- reducing an already accepted payout;
- rewriting historical ledger/bet records;
- silently targeting individual winning players with worse odds.

---

## 26. Required artifacts for each production ruleset

Create a versioned evidence package containing:

```text
Game Math Specification
Probability Model
Payout Table
Theoretical RTP / House Edge
Variance / Volatility
Tail Probability Analysis
Rounding Analysis
Stake/Payout Limits
Bankroll Assumptions
Exposure Policy
Risk-of-Ruin / Drawdown Study
Monte Carlo Report
Automated Test Evidence
Ruleset/Math Hash
Approval Record
Certification/Regulatory Reference (if applicable)
Effective/Retirement Dates
```

Historical bets must identify which evidence/config version governed them.

---

## 27. Automated test matrix

### Math tests
- exact probabilities;
- RTP;
- house edge;
- variance;
- max multiplier;
- payout rounding;
- overflow;
- ruleset hashing/version.

### RNG tests
- supported rows;
- result slot/path consistency;
- entropy read failure;
- broad statistical sanity tests without treating them as proof of cryptographic security.

### Simulation tests
- empirical slot frequencies;
- empirical RTP convergence;
- multi-seed variance;
- tail-event checks;
- bankroll paths.

### Risk-engine tests
- max stake/max payout;
- aggregate exposure;
- concurrent acceptance;
- stale exposure release;
- unavailable risk authority fails closed;
- no outcome generated before acceptance;
- limit changes affect future wagers only.

### Settlement integration tests (Phase 26)
- exactly-once economic effect through idempotency;
- duplicate request;
- process failure after acceptance;
- process failure after outcome before response;
- concurrent wallet debit;
- settlement/retry;
- immutable audit/ruleset linkage.

---

## 28. Phase 25 exit criteria

Phase 25 — Game Mathematics & Financial Risk Engine can close only when:

- [ ] formal Plinko probability model is implemented/tested;
- [ ] candidate production payout tables exist as versioned configurations;
- [ ] theoretical RTP/house edge calculation is automated;
- [ ] variance/tail/max-payout metrics are automated;
- [ ] rounding effects are tested across allowed stakes;
- [ ] deterministic simulation tooling exists;
- [ ] empirical/theoretical tolerance gates exist;
- [ ] bankroll/risk-of-ruin analysis exists;
- [ ] max-stake/max-payout policy is derived from risk assumptions;
- [ ] aggregate exposure model exists;
- [ ] risk rules fail closed;
- [ ] ruleset lifecycle/hash/audit is defined;
- [ ] no player-specific outcome manipulation exists;
- [ ] required independent/certification review path is identified for the chosen jurisdiction.

Closing Phase 25 still does not open production wagers. Phase 26 must implement and validate the transactional wager pipeline.

---

## 29. Phase 26 dependency

Phase 26 consumes the exact approved Phase 25 artifacts.

It must not invent payout tables or risk rules inside HTTP handlers.

Expected separation:

```text
Phase 25
GAME MATH + RISK POLICY
probabilities / rulesets / RTP / exposure / bankroll

               ↓ approved immutable version

Phase 26
WAGER + SETTLEMENT PIPELINE
auth / eligibility / reserve / RNG / settle / audit
```

---

## 30. Anti-goals

Vanta must not:
- configure house edge by guesswork;
- rely only on Monte Carlo when exact math is available;
- use positive RTP/edge expectation as proof of solvency;
- permit a single bet to exceed approved capital exposure;
- generate production outcomes on mobile;
- change odds based on player behavior/history;
- reroll or suppress wins;
- deploy an edited ruleset under the same version;
- allow marketing to override bankroll limits silently;
- use Redis as canonical exposure/financial truth without PostgreSQL-backed durable invariants;
- treat a test multiplier fixture as a production payout table;
- activate a game without exact historical ruleset linkage.

---

## 31. References

- `backend/internal/games/plinko/engine.go`
- `backend/internal/games/plinko/rules.go`
- `backend/internal/games/plinko/README.md`
- [`../security/phase20-security-architecture.md`](../security/phase20-security-architecture.md)
- [`../ROADMAP.md`](../ROADMAP.md)
- [`../VANTA_PRODUCT_BUSINESS_STRATEGY.md`](../VANTA_PRODUCT_BUSINESS_STRATEGY.md)
