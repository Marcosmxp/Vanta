# Vanta — Player Copy and Content Guidelines

**Status:** canonical Phase 20 player-facing content specification.  
**Last consolidated:** 2026-08-25.  
**Baseline locale:** `pt-PT` for the current Portuguese product experience, without assuming that Portugal is the final commercial jurisdiction.

This document governs normal player-facing copy. Engineering, audit and legal documents may use different levels of technical detail.

---

## 1. Core rule

> The app explains the product to the player. Engineering documentation explains the architecture to engineers.

Normal player screens should answer:
- what is happening;
- what can I do;
- why is something unavailable;
- what do I need to do next;
- what safety/legal information matters at this decision point.

Do not make users read internal implementation details to understand a product action.

---

## 2. Voice and tone

Vanta copy should be:
- clear;
- concise;
- calm;
- adult;
- confident without exaggeration;
- factual;
- nonjudgmental;
- consistent with a premium financial/gaming product.

Avoid:
- casino hype everywhere;
- manipulative urgency;
- childish wording;
- excessive exclamation marks;
- promises of winning;
- shaming around Responsible Gaming;
- technical jargon used as reassurance;
- false certainty about payments, KYC or licensing.

### Good direction

```text
Consulte o seu saldo e movimentos.

Os depósitos ainda não estão disponíveis.

Verifique a sua identidade para continuar.

Defina limites e faça pausas quando precisar.
```

### Bad direction

```text
O cliente nunca reconcilia saldos; o ledger é server-authoritative.

Settlement indisponível porque o provider boundary ainda não foi integrado.

A sua aposta é 100% garantida e segura.
```

---

## 3. Technical terminology boundary

The following terms generally belong in engineering/audit documentation, not normal player copy:
- ledger;
- read model / projection;
- server-authoritative;
- settlement engine;
- provider boundary;
- canonical state;
- idempotency;
- database/Redis/API implementation detail;
- component/module names;
- raw endpoint names;
- stack traces/internal exception text.

Exceptions are allowed only when:
- required by law/regulation;
- part of a dedicated technical/support diagnostic surface not shown as ordinary UX;
- the term is genuinely standard player language and explained appropriately.

---

## 4. Information hierarchy

Prefer this structure:

```text
Title
→ what happened / current state
→ what it means to the player
→ primary next action
→ secondary/help action if needed
```

Do not lead with implementation cause when the user first needs the consequence.

### Example

Preferred:

```text
Depósitos indisponíveis
Ainda não é possível adicionar fundos à sua conta.
```

Not preferred:

```text
PSP não configurado
O payment provider adapter e reconciliation pipeline ainda não estão ativos.
```

---

## 5. Home copy

Home should prioritize:
- balance/status;
- featured games;
- recent activity;
- important account action only when relevant.

Avoid permanent developer explanations or long legal paragraphs on Home.

Status banners should be reserved for things that require attention, such as:
- verification required;
- maintenance;
- meaningful account restriction;
- important Responsible Gaming state.

Do not create artificial urgency to drive play.

---

## 6. Wallet and financial copy

Financial wording must be especially precise.

Use clear labels such as:
- `Saldo disponível`;
- `Reservado`;
- `Total` when the meaning is unambiguous;
- `Depositar`;
- `Levantar`;
- `Movimentos` / `Transações` according to the finalized terminology.

Never show a fabricated success state before authoritative server/provider confirmation.

### Pending states

Prefer:

```text
Em processamento
O pedido foi recebido e ainda está a ser processado.
```

Do not say `Concluído` while reconciliation/settlement is still pending.

### Empty wallet history

An empty collection is normal:

```text
Sem movimentos
As suas transações aparecerão aqui.
```

Do not present no transactions as an error.

### Money formatting

For current `pt-PT` presentation:
- use locale-aware currency formatting;
- examples should render like `0,00 €`;
- avoid manual string concatenation where locale APIs exist;
- negative/positive meaning must not depend only on red/green color.

---

## 7. Authentication copy

Authentication errors must balance usefulness and security.

### Invalid credentials

Use a generic message such as:

```text
Email ou palavra-passe inválidos.
```

Do not reveal whether a specific email/account exists.

### Stale errors

Submission errors should clear when:
- a new valid attempt starts;
- the user meaningfully edits the relevant field;
- authentication succeeds/navigates away.

The current stale invalid-credentials presentation discovered in Phase 20 is implementation debt and must be corrected.

### Password policy

Player helper text must exactly match the deliberately approved server policy.

Current Phase 20 baseline:
- backend minimum: 12 characters;
- maximum: 128 characters;
- mobile currently also applies additional composition validation.

Do not tell players `10 caracteres` while the server rejects fewer than 12. Do not claim a complexity rule is server-enforced if it is only client-side. The final policy must be aligned before release.

### Session expiry

Prefer:

```text
A sua sessão terminou
Inicie sessão novamente para continuar.
```

Avoid raw token/HTTP wording such as `refresh token invalid`.

---

## 8. KYC / identity copy

Use player language:
- `Verificação de identidade`;
- `Documento`;
- `Selfie/verificação facial` only according to the selected provider and approved flow;
- `Em análise`;
- `Verificação concluída` only after authoritative approval;
- `Não foi possível concluir a verificação` for failure states.

Never display `Verificado` because a local client flag changed.

Do not invent provider, regulator or expected-review-time promises.

### Blocked game/payment action

Preferred:

```text
Verificação necessária
Conclua a verificação de identidade para continuar.
```

Not:

```text
KYC state != approved no backend projection.
```

---

## 9. Plinko and game copy

Game copy should explain rules and controls, not backend architecture.

Player-facing concepts may include:
- stake;
- rows/options;
- risk profile;
- multiplier;
- potential/actual payout according to approved rules;
- game rules and RTP disclosure where legally/product-required.

Avoid:

```text
O resultado, multiplier e settlement nunca são calculados neste componente.
```

Prefer a product explanation such as:

```text
Escolha o valor e as opções disponíveis. O resultado determina o multiplicador aplicado à jogada.
```

Final wording must match the approved game rules/math and jurisdiction disclosure requirements.

Do not use copy implying guaranteed profit or near-win manipulation.

---

## 10. Responsible Gaming copy

Responsible Gaming is a control/safety product surface, not marketing.

Tone:
- neutral;
- respectful;
- clear about consequences;
- no guilt/shame;
- no dark patterns designed to discourage limits/exclusion.

Examples:

```text
Defina um limite de depósito
Escolha quanto pode depositar durante o período definido.

Fazer uma pausa
Bloqueie temporariamente o acesso ao jogo durante o período escolhido.

Autoexclusão
Esta medida restringe o acesso ao jogo de acordo com as condições apresentadas antes da confirmação.
```

Any cooling-off, effective date or inability to reverse a protection must reflect authoritative server/legal policy.

---

## 11. Security Center copy

Show useful account-security information without exposing secrets.

Good information:
- device label;
- platform;
- approximate/masked location/IP when appropriate;
- current session;
- last activity;
- revoke session action;
- MFA/passkey state once implemented.

Never show:
- access token;
- refresh token;
- TOTP secret;
- recovery secrets;
- full sensitive network/device fingerprints;
- raw internal trust/risk score when it creates an abuse oracle.

### Revoke session

Use explicit consequence:

```text
Terminar sessão neste dispositivo?
Este dispositivo terá de iniciar sessão novamente.
```

For `Terminar outras sessões`, make clear that the current device remains signed in if that is the real server behavior.

---

## 12. Support copy

Support should guide without collecting dangerous information.

Never ask a player to send through support:
- password;
- OTP;
- session token;
- recovery code;
- CVV;
- full payment-card secret data;
- raw KYC media outside the approved identity flow.

Security-sensitive warning copy should be brief and repeated at the correct submission point where useful.

Errors should provide a support/request reference only if the backend actually generated one.

---

## 13. Legal and regulatory content

Normal UX may summarize legal concepts, but approved legal documents must remain versioned and authoritative.

Legal Center categories may include where applicable:
- Terms and Conditions;
- Privacy Policy;
- Responsible Gaming;
- KYC/identity information;
- deposits/withdrawals;
- game rules;
- promotions/bonus rules;
- account closure;
- time-out/self-exclusion;
- complaints/disputes;
- minors/18+;
- data-protection rights;
- operator/regulator/license information when verified.

Never fabricate:
- license number;
- regulator authorization;
- legal entity details;
- support contact;
- jurisdiction availability;
- effective date/version.

Place important acceptance/disclosure content at the relevant decision point; do not assume hiding everything under `Legal` is sufficient.

---

## 14. Blocked/unavailable feature wording

During development/preview, some capabilities intentionally remain closed.

Player-facing production copy must not expose roadmap/internal reasons. Depending on environment and intended audience, use plain state language.

Examples:

```text
Funcionalidade indisponível
Esta funcionalidade ainda não está disponível.
```

or, when a real user action is required:

```text
Verificação necessária
Conclua a verificação para continuar.
```

Developer builds may include a clearly separated non-player diagnostic marker, but it should not contaminate the final production experience.

---

## 15. Loading, offline and error copy

### Loading

Do not use wording implying success while data is still loading.

### Offline

```text
Sem ligação
Verifique a sua ligação à internet e tente novamente.
```

For sensitive actions, make clear that no successful action has been confirmed if the request state is unknown.

### Generic error

```text
Não foi possível concluir
Tente novamente. Se o problema continuar, contacte o suporte.
```

Only show `contacte o suporte` if a real support path exists in that environment.

### Maintenance

```text
Vanta temporariamente indisponível
Estamos a realizar manutenção. Tente novamente mais tarde.
```

Do not expose server internals or maintenance stack details.

---

## 16. Buttons and action labels

Prefer specific verbs:
- `Iniciar sessão`;
- `Criar conta`;
- `Continuar` when context is obvious;
- `Depositar`;
- `Levantar`;
- `Guardar limite`;
- `Terminar sessão`;
- `Tentar novamente`;
- `Ver documento`.

Avoid vague primary actions such as:
- `OK` when a specific action is possible;
- `Enviar` without context;
- `Sim`/`Não` for destructive actions where explicit verbs improve safety.

Destructive/high-impact confirmations should name the consequence.

---

## 17. Date, time and identity formatting

- use locale-aware date/time formatting;
- avoid ambiguous purely numeric dates where context can be unclear;
- mask email/contact information where full value is unnecessary;
- opaque internal IDs should not be prominent normal-player content;
- a player/support ID may be shown when it has a real support purpose;
- version/build can appear in `Perfil > Sobre`.

---

## 18. Localization strategy

The current experience uses Portuguese and Phase 20 should normalize the visible baseline to `pt-PT`.

Rules:
- separate user-visible strings from implementation logic where practical;
- avoid hard-coding jurisdiction-specific legal claims into reusable UI components;
- currency/date terminology must be locale-aware;
- translation must not change the legal/game meaning of an approved rule;
- English developer terminology should not leak into Portuguese normal UI.

Future market expansion requires deliberate locale/legal review rather than mechanical translation.

---

## 19. Accessibility of content

Copy must remain understandable when:
- read by a screen reader;
- font size is increased;
- icons/images are unavailable;
- color cannot be distinguished.

Requirements:
- meaningful control labels;
- avoid relying on placeholder text as the only form label;
- error text identifies the affected field/action;
- icon-only actions require accessible names;
- financial values have understandable labels (`Saldo disponível: 25 euros`, etc.) through the accessibility layer where needed.

---

## 20. Content review checklist

Before a player-facing screen is accepted:

- [ ] Does it explain the player outcome/action before implementation detail?
- [ ] Are internal terms (`ledger`, `settlement`, `read model`, endpoints) removed from normal UX?
- [ ] Is financial wording authoritative and non-fabricated?
- [ ] Does authentication wording avoid account enumeration?
- [ ] Does password helper text match real policy?
- [ ] Do stale errors clear correctly?
- [ ] Are KYC/license/payment statuses only shown when authoritative?
- [ ] Are Responsible Gaming consequences clear and non-manipulative?
- [ ] Are destructive actions explicit?
- [ ] Are blocked states actionable where possible?
- [ ] Is locale/currency/date formatting appropriate?
- [ ] Does the copy remain understandable with accessibility tools?
- [ ] Are legal/regulatory claims verified rather than placeholder fiction?

---

## 21. Phase 20 priority copy debt

Current known priorities:
1. replace password helper text that still communicates the obsolete 10-character minimum;
2. align deliberate password complexity policy between mobile and backend before promising it to players;
3. clear stale invalid-credential submission errors on edit/retry/success;
4. remove engineering-heavy wallet/game/security explanation from normal player screens;
5. normalize blocked deposit/KYC/Plinko states into plain language;
6. review `pt-PT` terminology consistently across Home, Jogar, Carteira and Perfil;
7. review Legal Center labels/categories for completeness without fabricating operator/license details.

---

## 22. Review rule

Player-facing copy changes affecting money, game rules, KYC, Responsible Gaming, privacy, security, payments or regulation require review against the relevant server policy/legal/game-math source. Copy must not become a second source of truth for business rules.
