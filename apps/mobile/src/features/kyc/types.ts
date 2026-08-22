export type KycStatus =
  | 'not-started'
  | 'document-required'
  | 'selfie-required'
  | 'processing'
  | 'approved'
  | 'rejected';

export type KycDocumentType = 'passport' | 'identity-card' | 'residence-permit';

export type KycRejectionCode =
  | 'document-unreadable'
  | 'document-expired'
  | 'identity-mismatch'
  | 'liveness-failed'
  | 'manual-review-required'
  | 'unsupported-document';

export interface KycVerificationSnapshot {
  status: KycStatus;
  rejectionCode?: KycRejectionCode;
}
