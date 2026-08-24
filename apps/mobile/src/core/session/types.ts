import type { ApiRequestOptions } from '../api/ApiClient';

export interface SessionTokenPair {
  accessToken: string;
  accessExpiresAt: string;
  refreshToken: string;
  refreshExpiresAt: string;
  sessionId: string;
  playerId: string;
}

export type SessionStatus = 'bootstrapping' | 'anonymous' | 'authenticated' | 'expired' | 'unavailable';

export interface SignInInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
  countryCode: string;
  termsAccepted: boolean;
}

export interface SessionContextValue {
  status: SessionStatus;
  session: SessionTokenPair | null;
  lastError: string | null;
  signIn(input: SignInInput): Promise<void>;
  register(input: RegisterInput): Promise<void>;
  signOut(): Promise<void>;
  retryBootstrap(): Promise<void>;
  request<T>(path: string, options?: Omit<ApiRequestOptions, 'accessToken'>): Promise<T>;
  publicRequest<T>(path: string, options?: ApiRequestOptions): Promise<T>;
}
