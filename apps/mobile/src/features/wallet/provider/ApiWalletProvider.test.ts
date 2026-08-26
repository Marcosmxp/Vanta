import { describe, expect, it } from 'vitest';

import type { SessionContextValue } from '../../../core/session/types';
import { createApiWalletProvider } from './ApiWalletProvider';

function requestReturning(value: unknown): SessionContextValue['request'] {
  return async <T>() => value as T;
}

describe('ApiWalletProvider', () => {
  it('normalizes a null transaction collection to an empty array', async () => {
    const provider = createApiWalletProvider(requestReturning({
      balance: {
        walletId: 'wallet-1',
        currency: 'EUR',
        availability: 'ready',
        availableBalanceMinor: 0,
        reservedBalanceMinor: 0,
        totalBalanceMinor: 0,
        asOf: '2026-08-26T20:00:00.000Z',
      },
      transactions: null,
      nextCursor: null,
    }));

    const snapshot = await provider.getSnapshot();

    expect(snapshot.transactions).toEqual([]);
    expect(snapshot.nextCursor).toBeNull();
  });

  it('normalizes a missing next cursor to null', async () => {
    const provider = createApiWalletProvider(requestReturning({
      balance: {
        walletId: 'wallet-1',
        currency: 'EUR',
        availability: 'ready',
        availableBalanceMinor: 0,
        reservedBalanceMinor: 0,
        totalBalanceMinor: 0,
        asOf: null,
      },
      transactions: [],
    }));

    await expect(provider.getSnapshot()).resolves.toMatchObject({ nextCursor: null });
  });
});
