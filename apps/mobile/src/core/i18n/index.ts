// Public entry point for player-facing localization and locale-aware formatters.
export {
  LocalizationProvider,
  useI18n,
  type AppTranslationKey,
  type SupportedLocale,
} from './LocalizationProvider';
export type { AppTranslationKey as TranslationKey } from './LocalizationProvider';
export { formatCurrencyMinor } from './formatters';
