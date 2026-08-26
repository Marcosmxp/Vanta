import type { SupportedLocale } from './LocalizationProvider';

function localeTag(locale: SupportedLocale) {
  if (locale === 'en') return 'en-US';
  if (locale === 'es') return 'es-ES';
  return 'pt-BR';
}

export function formatCurrencyMinor(amountMinor: number, currency: string, locale: SupportedLocale) {
  try {
    return new Intl.NumberFormat(localeTag(locale), {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amountMinor / 100);
  } catch {
    const symbol = currency === 'EUR' ? '€' : currency;
    return `${(amountMinor / 100).toFixed(2)} ${symbol}`;
  }
}
