import { describe, expect, it } from 'vitest';

import { ACCESS_REFRESH_SKEW_MS, expiresAtOrBefore, sessionTimingDecision } from './sessionPolicy';

const NOW = Date.parse('2026-08-26T20:00:00.000Z');

function iso(offsetMs: number) {
  return new Date(NOW + offsetMs).toISOString();
}

describe('session timing policy', () => {
  it('treats malformed timestamps as expired', () => {
    expect(expiresAtOrBefore('not-a-date', NOW)).toBe(true);
  });

  it('marks a session expired when the refresh token is expired', () => {
    expect(sessionTimingDecision({
      accessExpiresAt: iso(60_000),
      refreshExpiresAt: iso(-1),
    }, NOW)).toBe('expired');
  });

  it('requests silent refresh inside the access-token skew window', () => {
    expect(sessionTimingDecision({
      accessExpiresAt: iso(ACCESS_REFRESH_SKEW_MS),
      refreshExpiresAt: iso(86_400_000),
    }, NOW)).toBe('refresh');
  });

  it('keeps a session usable when access and refresh tokens remain valid', () => {
    expect(sessionTimingDecision({
      accessExpiresAt: iso(ACCESS_REFRESH_SKEW_MS + 1),
      refreshExpiresAt: iso(86_400_000),
    }, NOW)).toBe('usable');
  });
});
