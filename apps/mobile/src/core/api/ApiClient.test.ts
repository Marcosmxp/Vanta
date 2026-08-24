import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiClient, ApiError } from './ApiClient';

const originalEnvironment = process.env.EXPO_PUBLIC_VANTA_ENV;
const originalApiUrl = process.env.EXPO_PUBLIC_VANTA_API_URL;

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalEnvironment === undefined) delete process.env.EXPO_PUBLIC_VANTA_ENV;
  else process.env.EXPO_PUBLIC_VANTA_ENV = originalEnvironment;
  if (originalApiUrl === undefined) delete process.env.EXPO_PUBLIC_VANTA_API_URL;
  else process.env.EXPO_PUBLIC_VANTA_API_URL = originalApiUrl;
});

function configureApi() {
  process.env.EXPO_PUBLIC_VANTA_ENV = 'production';
  process.env.EXPO_PUBLIC_VANTA_API_URL = 'https://api.vanta.example';
}

describe('ApiClient', () => {
  it('fails before network access when API configuration is unsafe', async () => {
    process.env.EXPO_PUBLIC_VANTA_ENV = 'production';
    process.env.EXPO_PUBLIC_VANTA_API_URL = 'http://api.vanta.example';
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(new ApiClient().request('/v1/profile')).rejects.toMatchObject({
      name: 'ApiError',
      code: 'api_not_configured',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('attaches bearer credentials without placing them in the URL', async () => {
    configureApi();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await new ApiClient().request('/v1/profile', { accessToken: 'opaque-secret-token' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.vanta.example/v1/profile');
    expect(url).not.toContain('opaque-secret-token');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer opaque-secret-token');
  });

  it('returns undefined for a successful 204 response', async () => {
    configureApi();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })));

    await expect(new ApiClient().request<void>('/v1/auth/logout', { method: 'POST' })).resolves.toBeUndefined();
  });

  it('surfaces sanitized structured API errors and request IDs', async () => {
    configureApi();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ error: { code: 'invalid_access_token', message: 'The access token is invalid.', requestId: 'req_public' } }),
          { status: 401, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );

    try {
      await new ApiClient().request('/v1/profile');
      throw new Error('expected request to fail');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({ status: 401, code: 'invalid_access_token', requestId: 'req_public' });
    }
  });

  it('rejects successful responses that are not valid JSON', async () => {
    configureApi();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('not-json', { status: 200 })));

    await expect(new ApiClient().request('/v1/profile')).rejects.toMatchObject({
      code: 'invalid_json_response',
      status: 200,
    });
  });
});
