import { describe, expect, it } from 'vitest';

import type { SessionContextValue } from '../../../core/session/types';
import { createApiResponsibleGamingProvider } from './ApiResponsibleGamingProvider';

function requestReturning(value: unknown): SessionContextValue['request'] {
  return async <T>() => value as T;
}

describe('ApiResponsibleGamingProvider', () => {
  it('normalizes null limits and missing policy collections', async () => {
    const provider = createApiResponsibleGamingProvider(requestReturning({
      availability: 'ready',
      state: 'standard',
      message: null,
      limits: null,
      sessionLimit: null,
      activeTimeOut: null,
      selfExclusion: null,
      policy: null,
    }));

    const snapshot = await provider.getSnapshot();

    expect(snapshot.limits).toEqual([]);
    expect(snapshot.policy.timeOutOptions).toEqual([]);
    expect(snapshot.policy.selfExclusionOptions).toEqual([]);
    expect(snapshot.policy.canRequestLimitChange).toBe(false);
    expect(snapshot.policy.canStartTimeOut).toBe(false);
    expect(snapshot.policy.canSelfExclude).toBe(false);
  });
});
