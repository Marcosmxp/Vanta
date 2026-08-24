import { afterEach, describe, expect, it } from 'vitest';

import { resolveApiConfiguration } from './apiConfig';

const originalEnvironment = process.env.EXPO_PUBLIC_VANTA_ENV;
const originalApiUrl = process.env.EXPO_PUBLIC_VANTA_API_URL;

afterEach(() => {
  if (originalEnvironment === undefined) delete process.env.EXPO_PUBLIC_VANTA_ENV;
  else process.env.EXPO_PUBLIC_VANTA_ENV = originalEnvironment;

  if (originalApiUrl === undefined) delete process.env.EXPO_PUBLIC_VANTA_API_URL;
  else process.env.EXPO_PUBLIC_VANTA_API_URL = originalApiUrl;
});

describe('resolveApiConfiguration', () => {
  it('fails closed when the API URL is missing', () => {
    process.env.EXPO_PUBLIC_VANTA_ENV = 'production';
    delete process.env.EXPO_PUBLIC_VANTA_API_URL;

    const result = resolveApiConfiguration();

    expect(result.baseUrl).toBeNull();
    expect(result.error).toMatch(/not configured/i);
  });

  it('rejects plaintext HTTP outside development', () => {
    process.env.EXPO_PUBLIC_VANTA_ENV = 'production';
    process.env.EXPO_PUBLIC_VANTA_API_URL = 'http://api.example.test';

    const result = resolveApiConfiguration();

    expect(result.baseUrl).toBeNull();
    expect(result.error).toMatch(/HTTPS/i);
  });

  it('permits local HTTP only in development and removes trailing slashes', () => {
    process.env.EXPO_PUBLIC_VANTA_ENV = 'development';
    process.env.EXPO_PUBLIC_VANTA_API_URL = 'http://127.0.0.1:8080///';

    expect(resolveApiConfiguration()).toEqual({
      environment: 'development',
      baseUrl: 'http://127.0.0.1:8080',
      error: null,
    });
  });

  it('accepts HTTPS in staging', () => {
    process.env.EXPO_PUBLIC_VANTA_ENV = 'staging';
    process.env.EXPO_PUBLIC_VANTA_API_URL = 'https://api.vanta.example';

    expect(resolveApiConfiguration()).toEqual({
      environment: 'staging',
      baseUrl: 'https://api.vanta.example',
      error: null,
    });
  });
});
