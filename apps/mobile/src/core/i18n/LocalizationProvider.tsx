import * as SecureStore from 'expo-secure-store';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { kycEn, kycEs, kycPtBR, type KycTranslationKey } from './kycTranslations';
import { detectDeviceLocale, isSupportedLocale, type SupportedLocale } from './localePolicy';
import { productEn, productEs, productPtBR, type ProductTranslationKey } from './productTranslations';
import { securityEn, securityEs, securityPtBR, type SecurityTranslationKey } from './securityTranslations';
import { en, es, ptBR, type TranslationKey } from './translations';

export type { SupportedLocale } from './localePolicy';
export type AppTranslationKey = TranslationKey | ProductTranslationKey | SecurityTranslationKey | KycTranslationKey;

type AppTranslationDictionary = Record<AppTranslationKey, string>;

const STORAGE_KEY = 'vanta.locale.v1';
const dictionaries: Record<SupportedLocale, AppTranslationDictionary> = {
  'pt-BR': { ...ptBR, ...productPtBR, ...securityPtBR, ...kycPtBR },
  en: { ...en, ...productEn, ...securityEn, ...kycEn },
  es: { ...es, ...productEs, ...securityEs, ...kycEs },
};

interface LocalizationContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: AppTranslationKey) => string;
}

const LocalizationContext = createContext<LocalizationContextValue | null>(null);

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
    t: (key) => dictionaries[locale][key] ?? dictionaries['pt-BR'][key],
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
