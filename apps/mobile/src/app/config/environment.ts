export type PublicEnvironment = Readonly<{
  name: 'development' | 'staging' | 'production';
  apiUrl: string;
}>;

const DEFAULT_DEVELOPMENT_API_URL = 'http://localhost:8080';

function parseEnvironmentName(value: string | undefined): PublicEnvironment['name'] {
  if (value === 'staging' || value === 'production') {
    return value;
  }

  return 'development';
}

export function getPublicEnvironment(): PublicEnvironment {
  const name = parseEnvironmentName(process.env.EXPO_PUBLIC_VANTA_ENV);
  const apiUrl = process.env.EXPO_PUBLIC_VANTA_API_URL ?? DEFAULT_DEVELOPMENT_API_URL;

  if (name === 'production' && apiUrl.startsWith('http://')) {
    throw new Error('Production API URL must use HTTPS.');
  }

  return Object.freeze({ name, apiUrl });
}
