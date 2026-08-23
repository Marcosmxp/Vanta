import type {
  RevokeSessionInput,
  SecurityCapabilities,
  SecurityCommandReceipt,
  SecuritySnapshot,
} from '../types';

export interface SecurityProvider {
  getSnapshot(): Promise<SecuritySnapshot>;
  getCapabilities(): Promise<SecurityCapabilities>;
  revokeSession(input: RevokeSessionInput): Promise<SecurityCommandReceipt>;
  revokeOtherSessions(idempotencyKey: string): Promise<SecurityCommandReceipt>;
  beginMfaEnrollment(idempotencyKey: string): Promise<SecurityCommandReceipt>;
}

export const disconnectedSecuritySnapshot: SecuritySnapshot = {
  availability: 'unavailable',
  mfaStatus: 'disabled',
  sessions: [],
  message: 'O Security Center ficará disponível quando a sessão autenticada estiver ligada à API.',
};

export const disconnectedSecurityCapabilities: SecurityCapabilities = {
  canRevokeSession: false,
  canRevokeOtherSessions: false,
  canBeginMfaEnrollment: false,
  message: 'Ações de segurança permanecem bloqueadas sem coordenação server-side.',
};
