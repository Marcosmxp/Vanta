import { StyleSheet, Text, View } from 'react-native';

import { formatCurrencyMinor, formatDateTime, formatNumber, useI18n } from '../../../../core/i18n';
import { Badge, Card, darkTheme } from '../../../../design-system';
import type { BetHistoryItem, BetStatus } from '../types';

export interface BetHistoryItemCardProps {
  bet: BetHistoryItem;
  onPress: () => void;
}

const statusTones: Record<BetStatus, 'warning' | 'success' | 'neutral'> = {
  accepted: 'warning',
  settled: 'success',
  voided: 'neutral',
};

export function BetHistoryItemCard({ bet, onPress }: BetHistoryItemCardProps) {
  const { locale, t } = useI18n();
  const statusLabel = bet.status === 'accepted'
    ? t('betting.status.accepted')
    : bet.status === 'settled'
      ? t('betting.status.settled')
      : t('betting.status.voided');
  const multiplier = bet.multiplierBps === null
    ? '—'
    : `${formatNumber(bet.multiplierBps / 10_000, locale, 2)}×`;
  const placedAt = formatDateTime(bet.placedAt, locale) ?? t('betting.dateUnavailable');

  return (
    <Card
      accessibilityLabel={`${t('betting.open')} ${bet.betId}`}
      elevated
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.game}>PLINKO</Text>
          <Text numberOfLines={1} style={styles.id}>
            {bet.betId}
          </Text>
        </View>
        <Badge label={statusLabel} tone={statusTones[bet.status]} />
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>{t('betting.metric.stake')}</Text>
          <Text style={styles.metricValue}>{formatCurrencyMinor(bet.stakeMinor, bet.currency, locale)}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>{t('betting.metric.multiplier')}</Text>
          <Text style={styles.metricValue}>{multiplier}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>{t('betting.metric.payout')}</Text>
          <Text style={styles.metricValue}>
            {bet.payoutMinor === null ? '—' : formatCurrencyMinor(bet.payoutMinor, bet.currency, locale)}
          </Text>
        </View>
      </View>

      <Text style={styles.timestamp}>{placedAt}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: darkTheme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.md,
  },
  titleGroup: {
    flex: 1,
    gap: darkTheme.spacing.xs,
  },
  game: {
    ...darkTheme.typography.labelSmall,
    color: darkTheme.colors.brand.primary,
    letterSpacing: 1.2,
  },
  id: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.disabled,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: darkTheme.spacing.md,
  },
  metric: {
    flex: 1,
    gap: darkTheme.spacing.xs,
  },
  metricLabel: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
  metricValue: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.text.primary,
  },
  timestamp: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.disabled,
  },
});
