import type {
  RevokeSessionInput,
  SecurityCapabilities,
  SecuritySession,
  SecuritySnapshot,
} from '../types';

export interface SecurityProvider {
  getSnapshot(): Promise<SecuritySnapshot>;
  getSession(sessionId: string): Promise<SecuritySession | null>;
  getCapabilities(): Promise<SecurityCapabilities>;
  revokeSession(input: RevokeSessionInput): Promise<void>;
  revokeOtherSessions(): Promise<void>;
  beginMfaEnrollment(): Promise<void>;
}

export const disconnectedSecuritySnapshot: SecuritySnapshot = {
  availability: 'unavailable',
  mfaStatus: 'disabled',
  sessions: [],
};

export const disconnectedSecurityCapabilities: SecurityCapabilities = {
  canRevokeSession: false,
  canRevokeOtherSessions: false,
  canBeginMfaEnrollment: false,
};
