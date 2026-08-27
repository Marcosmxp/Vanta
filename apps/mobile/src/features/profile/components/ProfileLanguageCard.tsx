import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useI18n, type SupportedLocale } from '../../../core/i18n';
import { Badge, Card, darkTheme } from '../../../design-system';

const options: readonly { locale: SupportedLocale; label: string }[] = [
  { locale: 'pt-BR', label: 'Português (Brasil)' },
  { locale: 'en', label: 'English' },
  { locale: 'es', label: 'Español' },
];

export function ProfileLanguageCard() {
  const { locale, setLocale, t } = useI18n();

  return (
    <Card style={styles.card}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>{t('profile.languageEyebrow')}</Text>
        <Text style={styles.title}>{t('profile.languageTitle')}</Text>
        <Text style={styles.description}>{t('profile.languageDescription')}</Text>
      </View>

      <View style={styles.list}>
        {options.map((option) => {
          const selected = option.locale === locale;
          return (
            <Pressable
              key={option.locale}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setLocale(option.locale)}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <Text style={styles.label}>{option.label}</Text>
              {selected ? <Badge label={t('common.selected')} tone="success" /> : <Text style={styles.chevron}>›</Text>}
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: darkTheme.spacing.lg },
  copy: { gap: darkTheme.spacing.xs },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.2 },
  title: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  description: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  list: { gap: darkTheme.spacing.xs },
  row: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border.default,
  },
  pressed: { opacity: 0.7 },
  label: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  chevron: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.secondary },
});
