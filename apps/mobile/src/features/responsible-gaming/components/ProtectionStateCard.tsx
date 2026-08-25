import { StyleSheet, Text, View } from 'react-native';

import { useI18n, type TranslationKey } from '../../../core/i18n';
import { Badge, Card, darkTheme } from '../../../design-system';
import type { ProtectionState, ResponsibleGamingSnapshot } from '../types';

export interface ProtectionStateCardProps {
  snapshot: ResponsibleGamingSnapshot;
}

const stateKeys: Record<ProtectionState, TranslationKey> = {
  standard: 'rg.protection.standard',
  'limits-configured': 'rg.protection.limits-configured',
  'time-out': 'rg.protection.time-out',
  'self-excluded': 'rg.protection.self-excluded',
  restricted: 'rg.protection.restricted',
};

export function ProtectionStateCard({ snapshot }: ProtectionStateCardProps) {
  const { locale, t } = useI18n();
  const activeRestriction = snapshot.selfExclusion ?? snapshot.activeTimeOut;
  const tone =
    snapshot.state === 'self-excluded'
      ? 'danger'
      : snapshot.state === 'time-out' || snapshot.state === 'restricted'
        ? 'warning'
        : snapshot.state === 'limits-configured'
          ? 'success'
          : 'neutral';

  const formatTimestamp = (value: string | null) => value ? new Date(value).toLocaleString(locale) : t('rg.noEndDate');

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>{t('rg.protectionEyebrow')}</Text>
          <Text style={styles.title}>{t(stateKeys[snapshot.state])}</Text>
        </View>
        <Badge label={snapshot.availability === 'ready' ? t('common.updated') : t('common.unavailable')} tone={tone} />
      </View>

      <Text style={styles.description}>{t('rg.protectionDescription')}</Text>

      {activeRestriction ? (
        <View style={styles.restriction}>
          <Text style={styles.restrictionTitle}>{activeRestriction.label}</Text>
          <Text style={styles.restrictionText}>{t('rg.startedAt')}: {formatTimestamp(activeRestriction.startedAt)}</Text>
          <Text style={styles.restrictionText}>{t('rg.endsAt')}: {formatTimestamp(activeRestriction.endsAt)}</Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: darkTheme.spacing.md },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  copy: { flex: 1, gap: darkTheme.spacing.xs },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.1 },
  title: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  description: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  restriction: {
    gap: darkTheme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border.default,
    paddingTop: darkTheme.spacing.md,
  },
  restrictionTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  restrictionText: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
});
