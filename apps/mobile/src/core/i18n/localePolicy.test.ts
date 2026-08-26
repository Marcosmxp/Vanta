import { describe, expect, it } from 'vitest';

import { isSupportedLocale, normalizeDeviceLocale } from './localePolicy';

describe('locale policy', () => {
  it('accepts only the currently supported persisted locales', () => {
    expect(isSupportedLocale('pt-BR')).toBe(true);
    expect(isSupportedLocale('en')).toBe(true);
    expect(isSupportedLocale('es')).toBe(true);
    expect(isSupportedLocale('pt-PT')).toBe(false);
    expect(isSupportedLocale('fr')).toBe(false);
  });

  it('maps Portuguese device locales to the current pt-BR product locale', () => {
    expect(normalizeDeviceLocale('pt-BR')).toBe('pt-BR');
    expect(normalizeDeviceLocale('pt-PT')).toBe('pt-BR');
  });

  it('maps English and Spanish regional locales to their supported catalogs', () => {
    expect(normalizeDeviceLocale('en-GB')).toBe('en');
    expect(normalizeDeviceLocale('es-MX')).toBe('es');
  });

  it('falls back to pt-BR for unsupported or missing device locales', () => {
    expect(normalizeDeviceLocale('fr-FR')).toBe('pt-BR');
    expect(normalizeDeviceLocale(undefined)).toBe('pt-BR');
  });
});
