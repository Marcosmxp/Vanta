export type SecurityAvailability = 'ready' | 'unavailable' | 'restricted';
export type MfaStatus = 'disabled' | 'enabled' | 'required';
export type SessionStatus = 'active' | 'revoked';
export type DeviceTrust = 'trusted' | 'unrecognized';

export interface SecuritySession {
  sessionId: string;
  deviceLabel: string;
  platform: string;
  ipMasked: string | null;
  countryCode: string | null;
  current: boolean;
  status: SessionStatus;
  mfaUsed: boolean;
  trust: DeviceTrust;
  createdAt: string;
  lastSeenAt: string;
}

export interface SecuritySnapshot {
  availability: SecurityAvailability;
  mfaStatus: MfaStatus;
  sessions: readonly SecuritySession[];
  message?: string;
}

export interface SecurityCapabilities {
  canRevokeSession: boolean;
  canRevokeOtherSessions: boolean;
  canBeginMfaEnrollment: boolean;
  message?: string;
}

export interface RevokeSessionInput {
  sessionId: string;
  idempotencyKey: string;
}

export interface SecurityCommandReceipt {
  commandId: string;
  acceptedAt: string;
}
