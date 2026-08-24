import type { SessionContextValue } from '../../../core/session/types';
import type { ProfileProvider } from './ProfileProvider';
import type { ProfileSnapshot } from '../types';

export function createApiProfileProvider(request: SessionContextValue['request']): ProfileProvider {
  return {
    async getProfile(): Promise<ProfileSnapshot> {
      return request<ProfileSnapshot>('/v1/profile');
    },
  };
}
