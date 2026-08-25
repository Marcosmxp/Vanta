import * as SecureStore from 'expo-secure-store';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { en, es, ptBR, type TranslationDictionary, type TranslationKey } from './translations';

export type SupportedLocale = 'pt-BR' | 'en' | 'es';

const STORAGE_KEY = 'vanta.locale.v1';
const dictionaries: Record<SupportedLocale, TranslationDictionary> = {
  'pt-BR': ptBR,
  en,
  es,
};

interface LocalizationContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: TranslationKey) => string;
}

const LocalizationContext = createContext<LocalizationContextValue | null>(null);

function isSupportedLocale(value: string | null | undefined): value is SupportedLocale {
  return value === 'pt-BR' || value === 'en' || value === 'es';
}

function detectDeviceLocale(): SupportedLocale {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();
    if (locale.startsWith('es')) return 'es';
    if (locale.startsWith('en')) return 'en';
    if (locale.startsWith('pt')) return 'pt-BR';
  } catch {
    // Fall through to the product default.
  }
  return 'pt-BR';
}

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => detectDeviceLocale());

  useEffect(() => {
    let mounted = true;
    void SecureStore.getItemAsync(STORAGE_KEY)
      .then((stored) => {
        if (mounted && isSupportedLocale(stored)) {
          setLocaleState(stored);
        }
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  const setLocale = useCallback((next: SupportedLocale) => {
    setLocaleState(next);
    void SecureStore.setItemAsync(STORAGE_KEY, next).catch(() => undefined);
  }, []);

  const value = useMemo<LocalizationContextValue>(() => ({
    locale,
    setLocale,
    t: (key) => dictionaries[locale][key] ?? ptBR[key],
  }), [locale, setLocale]);

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useI18n(): LocalizationContextValue {
  const value = useContext(LocalizationContext);
  if (!value) {
    throw new Error('useI18n must be used inside LocalizationProvider.');
  }
  return value;
}
