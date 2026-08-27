export type SupportedLocale = 'pt-BR' | 'en' | 'es';

export function isSupportedLocale(value: string | null | undefined): value is SupportedLocale {
  return value === 'pt-BR' || value === 'en' || value === 'es';
}

export function normalizeDeviceLocale(value: string | null | undefined): SupportedLocale {
  const locale = value?.toLowerCase() ?? '';
  if (locale.startsWith('es')) return 'es';
  if (locale.startsWith('en')) return 'en';
  if (locale.startsWith('pt')) return 'pt-BR';
  return 'pt-BR';
}

export function detectDeviceLocale(): SupportedLocale {
  try {
    return normalizeDeviceLocale(Intl.DateTimeFormat().resolvedOptions().locale);
  } catch {
    return 'pt-BR';
  }
}
