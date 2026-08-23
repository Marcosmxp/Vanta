import type { SystemAvailabilitySnapshot } from '../types';

export const disconnectedSystemAvailability: SystemAvailabilitySnapshot = {
  availability: 'unknown',
  incidentId: null,
  message: null,
  retryAfterAt: null,
  updatedAt: null,
};

export interface SystemAvailabilityProvider {
  getAvailability(): Promise<SystemAvailabilitySnapshot>;
}

export const unavailableSystemAvailabilityProvider: SystemAvailabilityProvider = {
  async getAvailability() {
    return disconnectedSystemAvailability;
  },
};
