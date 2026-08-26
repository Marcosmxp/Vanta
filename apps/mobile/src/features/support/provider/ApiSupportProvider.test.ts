import { describe, expect, it } from 'vitest';

import type { SessionContextValue } from '../../../core/session/types';
import { createApiSupportProvider } from './ApiSupportProvider';

function requestReturning(value: unknown): SessionContextValue['request'] {
  return async <T>() => value as T;
}

describe('ApiSupportProvider', () => {
  it('normalizes null support collections to empty arrays', async () => {
    const provider = createApiSupportProvider(requestReturning({
      availability: 'ready',
      topics: null,
      channels: null,
      recentRequests: null,
    }));

    const snapshot = await provider.getSnapshot();

    expect(snapshot.topics).toEqual([]);
    expect(snapshot.channels).toEqual([]);
    expect(snapshot.recentRequests).toEqual([]);
  });
});
