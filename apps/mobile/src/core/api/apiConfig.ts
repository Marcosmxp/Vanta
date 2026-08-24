export type VantaPublicEnvironment = 'development' | 'staging' | 'production';

export interface VantaApiConfiguration {
  environment: VantaPublicEnvironment;
  baseUrl: string | null;
  error: string | null;
}

function readEnvironment(): VantaPublicEnvironment {
  const value = process.env.EXPO_PUBLIC_VANTA_ENV?.trim().toLowerCase();
  if (value === 'staging' || value === 'production') {
    return value;
  }
  return 'development';
}

export function resolveApiConfiguration(): VantaApiConfiguration {
  const environment = readEnvironment();
  const configuredUrl = process.env.EXPO_PUBLIC_VANTA_API_URL?.trim();

  if (!configuredUrl) {
    return { environment, baseUrl: null, error: 'EXPO_PUBLIC_VANTA_API_URL is not configured.' };
  }

  try {
    const parsed = new URL(configuredUrl);
    if (parsed.protocol !== 'https:' && !(environment === 'development' && parsed.protocol === 'http:')) {
      return { environment, baseUrl: null, error: 'The Vanta API URL must use HTTPS outside development.' };
    }
    return { environment, baseUrl: configuredUrl.replace(/\/+$/, ''), error: null };
  } catch {
    return { environment, baseUrl: null, error: 'EXPO_PUBLIC_VANTA_API_URL is not a valid URL.' };
  }
}
