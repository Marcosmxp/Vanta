import { resolveApiConfiguration } from './apiConfig';

interface ApiErrorPayload {
  error?: {
    code?: string;
    message?: string;
    requestId?: string;
  };
}

export class ApiError extends Error {
  readonly status: number | null;
  readonly code: string;
  readonly requestId: string | null;

  constructor(message: string, options?: { status?: number | null; code?: string; requestId?: string | null }) {
    super(message);
    this.name = 'ApiError';
    this.status = options?.status ?? null;
    this.code = options?.code ?? 'api_error';
    this.requestId = options?.requestId ?? null;
  }
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  accessToken?: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export class ApiClient {
  async request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const config = resolveApiConfiguration();
    if (!config.baseUrl) {
      throw new ApiError(config.error ?? 'Vanta API is not configured.', { code: 'api_not_configured' });
    }
    if (!path.startsWith('/')) {
      throw new ApiError('API paths must be absolute.', { code: 'invalid_api_path' });
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...options.headers,
    };
    if (options.accessToken) {
      headers.Authorization = `Bearer ${options.accessToken}`;
    }
    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    let response: Response;
    try {
      response = await fetch(`${config.baseUrl}${path}`, {
        method: options.method ?? 'GET',
        headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: options.signal,
      });
    } catch (error) {
      throw new ApiError(error instanceof Error ? error.message : 'Network request failed.', { code: 'network_error' });
    }

    const requestId = response.headers.get('X-Request-ID');
    if (!response.ok) {
      let payload: ApiErrorPayload | null = null;
      try {
        payload = (await response.json()) as ApiErrorPayload;
      } catch {
        payload = null;
      }
      throw new ApiError(payload?.error?.message ?? `Vanta API returned HTTP ${response.status}.`, {
        status: response.status,
        code: payload?.error?.code ?? 'http_error',
        requestId: payload?.error?.requestId ?? requestId,
      });
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    if (!text) {
      return undefined as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new ApiError('Vanta API returned an invalid JSON response.', {
        status: response.status,
        code: 'invalid_json_response',
        requestId,
      });
    }
  }
}

export const apiClient = new ApiClient();
