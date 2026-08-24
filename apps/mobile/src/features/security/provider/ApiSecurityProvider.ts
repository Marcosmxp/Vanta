import type { SessionContextValue } from '../../../core/session/types';
import type { SecurityProvider } from './SecurityProvider';
import type { SecurityCapabilities, SecuritySnapshot } from '../types';

export function createApiSecurityProvider(request: SessionContextValue['request']): SecurityProvider {
  const getSnapshot = () => request<SecuritySnapshot>('/v1/security');

  return {
    getSnapshot,
    async getSession(sessionId) {
      const snapshot = await getSnapshot();
      return snapshot.sessions.find((session) => session.sessionId === sessionId) ?? null;
    },
    async getCapabilities(): Promise<SecurityCapabilities> {
      return {
        canRevokeSession: true,
        canRevokeOtherSessions: true,
        canBeginMfaEnrollment: false,
        message: 'Revogação de sessões está ligada à API. Enrollment MFA permanece bloqueado até existir endpoint dedicado.',
      };
    },
    async revokeSession(input) {
      await request<void>(`/v1/security/sessions/${encodeURIComponent(input.sessionId)}`, {
        method: 'DELETE',
      });
    },
    async revokeOtherSessions() {
      await request<void>('/v1/security/sessions', { method: 'DELETE' });
    },
    async beginMfaEnrollment() {
      throw new Error('MFA enrollment is not exposed by the Vanta API yet.');
    },
  };
}
