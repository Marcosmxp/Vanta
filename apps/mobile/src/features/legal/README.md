# Vanta Mobile Legal and Regulatory Information

The Legal feature presents versioned backend-provided documents plus privacy and regulatory disclosures.

## Runtime rules

- Disconnected runtime does not fabricate operator identity, licence references or legal documents.
- Full document bodies are fetched by opaque `documentId`; navigation never carries legal content.
- Every legal document includes version metadata and a SHA-256 content digest from the backend read model.
- The client must not present `licensed` based on local state. Production compliance configuration must provide the real operator identity and concrete licence references.
- Regulatory and privacy authority URLs must originate from validated HTTPS backend data.
- Storybook fixtures explicitly have no legal validity and do not claim Vanta is licensed.

## Portugal reference baseline

Phase 15 design was checked against official SRIJ and CNPD information on 2026-08-23. The authoritative production wording must still be reviewed and maintained by legal/compliance operations.
