import * as SecureStore from 'expo-secure-store';

import type { SessionTokenPair } from './types';

const SESSION_KEY = 'vanta.auth.session.v1';

function isTokenPair(value: unknown): value is SessionTokenPair {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Partial<SessionTokenPair>;
  return [
    candidate.accessToken,
    candidate.accessExpiresAt,
    candidate.refreshToken,
    candidate.refreshExpiresAt,
    candidate.sessionId,
    candidate.playerId,
  ].every((item) => typeof item === 'string' && item.length > 0);
}

export async function loadStoredSession(): Promise<SessionTokenPair | null> {
  const serialized = await SecureStore.getItemAsync(SESSION_KEY);
  if (!serialized) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(serialized);
    if (!isTokenPair(parsed)) {
      await clearStoredSession();
      return null;
    }
    return parsed;
  } catch {
    await clearStoredSession();
    return null;
  }
}

export async function saveStoredSession(session: SessionTokenPair): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session), {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function clearStoredSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
