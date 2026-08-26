import { describe, expect, it } from 'vitest';

import type { SessionContextValue } from '../../../core/session/types';
import { createApiLegalProvider } from './ApiLegalProvider';

function requestReturning(value: unknown): SessionContextValue['publicRequest'] {
  return async <T>() => value as T;
}

describe('ApiLegalProvider', () => {
  it('normalizes null document and license-reference collections', async () => {
    const provider = createApiLegalProvider(requestReturning({
      availability: 'ready',
      documents: null,
      regulatory: {
        jurisdictionCode: 'PT',
        operatorLegalName: null,
        operatorContact: null,
        operatorAddress: null,
        licensingStatus: 'unconfigured',
        regulator: { name: 'Regulator', url: 'https://example.invalid' },
        licenseReferences: null,
        licenseNotice: '',
        complaintsDocumentId: '',
      },
      privacy: null,
    }));

    const snapshot = await provider.getSnapshot();

    expect(snapshot.documents).toEqual([]);
    expect(snapshot.regulatory?.licenseReferences).toEqual([]);
  });
});
