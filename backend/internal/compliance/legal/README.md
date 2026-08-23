# Vanta Legal, Privacy and Regulatory Backend

This package defines versioned legal-document and regulatory-disclosure read models. It is deliberately read-only in Phase 15.

## Integrity rules

- Every legal document is versioned and carries a SHA-256 content digest.
- The mobile application presents backend-provided legal state; route visibility and local fixtures are never evidence of legal validity.
- A `licensed` regulatory status is invalid unless the backend also supplies the operator legal identity and at least one concrete licence reference.
- Licence references are rejected when the status is not `licensed`.
- Production configuration must never imply that Vanta or an operator is licensed until the real operator entity and licence references have been independently verified.
- Authority links must use HTTPS.
- Legal document detail is reloaded by opaque `documentId`; full document bodies are not passed through navigation state.

## Portugal source baseline verified 2026-08-23

Official references used to design the disclosure model:

- SRIJ licensed operators: https://www.srij.turismodeportugal.pt/pt/jogos-e-apostas-online/entidades-licenciadas
- SRIJ player rights and duties: https://www.srij.turismodeportugal.pt/pt/jogo-seguro/direitos-e-deveres-do-jogador
- SRIJ responsible gaming: https://www.srij.turismodeportugal.pt/pt/jogo-responsavel/o-que-e-o-jogo-responsavel
- CNPD data-subject rights: https://www.cnpd.pt/cidadaos/direitos/

These URLs are reference inputs for compliance operations, not hard-coded proof that any Vanta operator is licensed.

## Phase 15 scope

No legal acceptance, licence assertion or privacy-rights mutation endpoint is introduced in this phase. Future acceptance records and data-subject requests require authenticated, auditable backend workflows.
