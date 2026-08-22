import type { KycDocumentType, KycVerificationSnapshot } from '../types';

export interface KycProviderSession {
  sessionId: string;
}

export interface KycDocumentSubmission {
  sessionId: string;
  documentType: KycDocumentType;
  captureToken: string;
}

export interface KycLivenessSubmission {
  sessionId: string;
  livenessToken: string;
}

/**
 * Boundary for the eventual external KYC provider.
 *
 * Raw document images, selfies and biometric media must not be routed through
 * React Navigation, logs, analytics or persistent client state. The mobile app
 * should receive opaque provider-issued capture tokens only.
 */
export interface KycProvider {
  beginVerification(): Promise<KycProviderSession>;
  submitDocument(input: KycDocumentSubmission): Promise<void>;
  submitLiveness(input: KycLivenessSubmission): Promise<void>;
  getVerification(sessionId: string): Promise<KycVerificationSnapshot>;
}
