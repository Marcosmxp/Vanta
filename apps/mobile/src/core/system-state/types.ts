export type SystemAvailability = 'unknown' | 'operational' | 'degraded' | 'maintenance';

export interface SystemAvailabilitySnapshot {
  availability: SystemAvailability;
  incidentId: string | null;
  message: string | null;
  retryAfterAt: string | null;
  updatedAt: string | null;
}
