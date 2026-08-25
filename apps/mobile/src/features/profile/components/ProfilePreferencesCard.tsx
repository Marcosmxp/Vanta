import { StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../../../core/i18n';
import { Card, darkTheme } from '../../../design-system';
import type { ProfileSnapshot } from '../types';

export interface ProfilePreferencesCardProps {
  snapshot: ProfileSnapshot;
}

export function ProfilePreferencesCard({ snapshot }: ProfilePreferencesCardProps) {
  const { t } = useI18n();
  const { preferences } = snapshot;
  const protectionLabel = preferences.protectionStatus === 'standard'
    ? t('profile.protectionStandard')
    : preferences.protectionStatus === 'limits-configured'
      ? t('profile.protectionLimits')
      : t('profile.protectionRestricted');

  return (
    <Card style={styles.card}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>{t('profile.preferencesEyebrow')}</Text>
        <Text style={styles.title}>{t('profile.preferencesTitle')}</Text>
      </View>

      <View style={styles.rows}>
        <View style={styles.row}>
          <Text style={styles.label}>{t('profile.marketing')}</Text>
          <Text style={styles.value}>
            {preferences.marketingOptIn === true
              ? t('profile.marketingOn')
              : preferences.marketingOptIn === false
                ? t('profile.marketingOff')
                : t('profile.marketingUnavailable')}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{t('profile.protection')}</Text>
          <Text style={styles.value}>{protectionLabel}</Text>
        </View>
      </View>

      <Text style={styles.note}>{t('profile.preferencesNote')}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: darkTheme.spacing.lg },
  copy: { gap: darkTheme.spacing.xs },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.2 },
  title: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  rows: { gap: darkTheme.spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: darkTheme.spacing.lg },
  label: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  value: { ...darkTheme.typography.bodyStrong, textAlign: 'right', color: darkTheme.colors.text.primary },
  note: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
});
