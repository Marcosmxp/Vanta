import type { SessionContextValue } from '../../session/types';
import type { SystemAvailabilityProvider } from './SystemAvailabilityProvider';
import type { SystemAvailabilitySnapshot } from '../types';

export function createApiSystemAvailabilityProvider(
  publicRequest: SessionContextValue['publicRequest'],
): SystemAvailabilityProvider {
  return {
    async getAvailability(): Promise<SystemAvailabilitySnapshot> {
      return publicRequest<SystemAvailabilitySnapshot>('/v1/platform/status');
    },
  };
}
