import { afterEach, describe, expect, it, vi } from 'vitest';

const secureStore = vi.hoisted(() => ({
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
}));

vi.mock('expo-secure-store', () => secureStore);

import { clearStoredSession, loadStoredSession, saveStoredSession } from './secureSessionStore';
import type { SessionTokenPair } from './types';

const session: SessionTokenPair = {
  accessToken: 'access-token',
  accessExpiresAt: '2026-08-26T20:15:00.000Z',
  refreshToken: 'refresh-token',
  refreshExpiresAt: '2026-09-25T20:00:00.000Z',
  sessionId: 'session-1',
  playerId: 'player-1',
};

afterEach(() => {
  vi.clearAllMocks();
});

describe('secureSessionStore', () => {
  it('returns null when no stored session exists', async () => {
    secureStore.getItemAsync.mockResolvedValue(null);

    await expect(loadStoredSession()).resolves.toBeNull();
    expect(secureStore.deleteItemAsync).not.toHaveBeenCalled();
  });

  it('loads a complete stored token pair', async () => {
    secureStore.getItemAsync.mockResolvedValue(JSON.stringify(session));

    await expect(loadStoredSession()).resolves.toEqual(session);
    expect(secureStore.deleteItemAsync).not.toHaveBeenCalled();
  });

  it('fails closed and clears malformed JSON', async () => {
    secureStore.getItemAsync.mockResolvedValue('{broken');

    await expect(loadStoredSession()).resolves.toBeNull();
    expect(secureStore.deleteItemAsync).toHaveBeenCalledWith('vanta.auth.session.v1');
  });

  it('fails closed and clears incomplete token data', async () => {
    secureStore.getItemAsync.mockResolvedValue(JSON.stringify({ ...session, refreshToken: '' }));

    await expect(loadStoredSession()).resolves.toBeNull();
    expect(secureStore.deleteItemAsync).toHaveBeenCalledWith('vanta.auth.session.v1');
  });

  it('stores the session using device-only unlocked keychain accessibility', async () => {
    secureStore.setItemAsync.mockResolvedValue(undefined);

    await saveStoredSession(session);

    expect(secureStore.setItemAsync).toHaveBeenCalledWith(
      'vanta.auth.session.v1',
      JSON.stringify(session),
      { keychainAccessible: secureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY },
    );
  });

  it('deletes the canonical session key', async () => {
    secureStore.deleteItemAsync.mockResolvedValue(undefined);

    await clearStoredSession();

    expect(secureStore.deleteItemAsync).toHaveBeenCalledWith('vanta.auth.session.v1');
  });
});
