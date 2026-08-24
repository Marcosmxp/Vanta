import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

import { ApiError, apiClient, type ApiRequestOptions } from '../api/ApiClient';
import { queryClient } from '../query/queryClient';
import { clearStoredSession, loadStoredSession, saveStoredSession } from './secureSessionStore';
import type {
  RegisterInput,
  SessionContextValue,
  SessionStatus,
  SessionTokenPair,
  SignInInput,
} from './types';

const SessionContext = createContext<SessionContextValue | null>(null);
const ACCESS_REFRESH_SKEW_MS = 30_000;

function expiresAtOrBefore(isoDate: string, threshold: number): boolean {
  const timestamp = Date.parse(isoDate);
  return !Number.isFinite(timestamp) || timestamp <= threshold;
}

function safeErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  return 'A sessão segura não pôde ser preparada neste momento.';
}

function deviceMetadata() {
  return {
    deviceLabel: `Vanta ${Platform.OS}`,
    platform: Platform.OS,
  };
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>('bootstrapping');
  const [session, setSession] = useState<SessionTokenPair | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const sessionRef = useRef<SessionTokenPair | null>(null);
  const refreshPromiseRef = useRef<Promise<SessionTokenPair> | null>(null);

  const setCurrentSession = useCallback((next: SessionTokenPair | null) => {
    sessionRef.current = next;
    setSession(next);
  }, []);

  const clearSession = useCallback(async (nextStatus: SessionStatus) => {
    setCurrentSession(null);
    queryClient.clear();
    try {
      await clearStoredSession();
    } finally {
      setStatus(nextStatus);
    }
  }, [setCurrentSession]);

  const persistIssuedSession = useCallback(async (pair: SessionTokenPair) => {
    try {
      await saveStoredSession(pair);
    } catch {
      try {
        await apiClient.request<void>('/v1/auth/logout', {
          method: 'POST',
          accessToken: pair.accessToken,
        });
      } catch {
        // The server-side session may remain valid until expiry if storage failed and revocation is unavailable.
      }
      await clearStoredSession().catch(() => undefined);
      throw new ApiError('Não foi possível guardar a sessão no armazenamento seguro do dispositivo.', {
        code: 'secure_storage_unavailable',
      });
    }

    setCurrentSession(pair);
    setLastError(null);
    setStatus('authenticated');
  }, [setCurrentSession]);

  const refreshCurrentSession = useCallback(async (): Promise<SessionTokenPair> => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const current = sessionRef.current;
    if (!current) {
      throw new ApiError('Não existe uma sessão para atualizar.', { status: 401, code: 'session_missing' });
    }
    if (expiresAtOrBefore(current.refreshExpiresAt, Date.now())) {
      await clearSession('expired');
      throw new ApiError('A sessão expirou.', { status: 401, code: 'refresh_expired' });
    }

    const refreshPromise = (async () => {
      try {
        const pair = await apiClient.request<SessionTokenPair>('/v1/auth/refresh', {
          method: 'POST',
          body: { refreshToken: current.refreshToken },
        });
        await persistIssuedSession(pair);
        return pair;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          await clearSession('expired');
        }
        throw error;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    refreshPromiseRef.current = refreshPromise;
    return refreshPromise;
  }, [clearSession, persistIssuedSession]);

  const bootstrap = useCallback(async () => {
    setStatus('bootstrapping');
    setLastError(null);

    try {
      const stored = await loadStoredSession();
      if (!stored) {
        setCurrentSession(null);
        setStatus('anonymous');
        return;
      }

      setCurrentSession(stored);
      if (expiresAtOrBefore(stored.refreshExpiresAt, Date.now())) {
        await clearSession('anonymous');
        return;
      }

      if (!expiresAtOrBefore(stored.accessExpiresAt, Date.now() + ACCESS_REFRESH_SKEW_MS)) {
        setStatus('authenticated');
        return;
      }

      await refreshCurrentSession();
    } catch (error) {
      if (sessionRef.current) {
        setStatus('unavailable');
      } else {
        setStatus('anonymous');
      }
      setLastError(safeErrorMessage(error));
    }
  }, [clearSession, refreshCurrentSession, setCurrentSession]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const signIn = useCallback(async (input: SignInInput) => {
    setLastError(null);
    const pair = await apiClient.request<SessionTokenPair>('/v1/auth/login', {
      method: 'POST',
      body: {
        email: input.email,
        password: input.password,
        ...deviceMetadata(),
      },
    });
    await persistIssuedSession(pair);
  }, [persistIssuedSession]);

  const register = useCallback(async (input: RegisterInput) => {
    setLastError(null);
    const pair = await apiClient.request<SessionTokenPair>('/v1/auth/register', {
      method: 'POST',
      body: {
        email: input.email,
        password: input.password,
        displayName: input.displayName,
        countryCode: input.countryCode,
        termsAccepted: input.termsAccepted,
        ...deviceMetadata(),
      },
    });
    await persistIssuedSession(pair);
  }, [persistIssuedSession]);

  const signOut = useCallback(async () => {
    const current = sessionRef.current;
    let revocationError: unknown = null;

    if (current) {
      try {
        await apiClient.request<void>('/v1/auth/logout', {
          method: 'POST',
          accessToken: current.accessToken,
        });
      } catch (error) {
        revocationError = error;
      }
    }

    await clearSession('anonymous');
    if (revocationError) {
      throw new ApiError('A sessão foi removida deste dispositivo, mas a revogação remota não pôde ser confirmada.', {
        code: 'remote_logout_unconfirmed',
      });
    }
  }, [clearSession]);

  const request = useCallback(async <T,>(path: string, options: Omit<ApiRequestOptions, 'accessToken'> = {}) => {
    let current = sessionRef.current;
    if (!current) {
      throw new ApiError('Authentication is required.', { status: 401, code: 'session_missing' });
    }

    if (expiresAtOrBefore(current.refreshExpiresAt, Date.now())) {
      await clearSession('expired');
      throw new ApiError('The session expired.', { status: 401, code: 'refresh_expired' });
    }

    if (expiresAtOrBefore(current.accessExpiresAt, Date.now() + ACCESS_REFRESH_SKEW_MS)) {
      current = await refreshCurrentSession();
    }

    const tokenUsed = current.accessToken;
    try {
      return await apiClient.request<T>(path, { ...options, accessToken: tokenUsed });
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) {
        throw error;
      }

      const latest = sessionRef.current;
      if (latest && latest.accessToken !== tokenUsed) {
        return apiClient.request<T>(path, { ...options, accessToken: latest.accessToken });
      }

      const refreshed = await refreshCurrentSession();
      return apiClient.request<T>(path, { ...options, accessToken: refreshed.accessToken });
    }
  }, [clearSession, refreshCurrentSession]);

  const publicRequest = useCallback(async <T,>(path: string, options?: ApiRequestOptions) => {
    return apiClient.request<T>(path, options);
  }, []);

  const value = useMemo<SessionContextValue>(() => ({
    status,
    session,
    lastError,
    signIn,
    register,
    signOut,
    retryBootstrap: bootstrap,
    request,
    publicRequest,
  }), [bootstrap, lastError, publicRequest, register, request, session, signIn, signOut, status]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error('useSession must be used inside SessionProvider.');
  }
  return value;
}
