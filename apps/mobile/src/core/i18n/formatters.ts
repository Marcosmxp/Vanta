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

export function formatNumber(value: number, locale: SupportedLocale, fractionDigits = 2) {
  try {
    return new Intl.NumberFormat(localeTag(locale), {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value);
  } catch {
    return value.toFixed(fractionDigits);
  }
}

export function formatDateTime(value: string, locale: SupportedLocale): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  try {
    return new Intl.DateTimeFormat(localeTag(locale), {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return date.toISOString();
  }
}
