import type { SessionTokenPair } from './types';

export const ACCESS_REFRESH_SKEW_MS = 30_000;

export function expiresAtOrBefore(isoDate: string, threshold: number): boolean {
  const timestamp = Date.parse(isoDate);
  return !Number.isFinite(timestamp) || timestamp <= threshold;
}

export type SessionTimingDecision = 'expired' | 'refresh' | 'usable';

export function sessionTimingDecision(
  session: Pick<SessionTokenPair, 'accessExpiresAt' | 'refreshExpiresAt'>,
  now = Date.now(),
): SessionTimingDecision {
  if (expiresAtOrBefore(session.refreshExpiresAt, now)) {
    return 'expired';
  }
  if (expiresAtOrBefore(session.accessExpiresAt, now + ACCESS_REFRESH_SKEW_MS)) {
    return 'refresh';
  }
  return 'usable';
}
