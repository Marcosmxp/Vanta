import { StyleSheet, Text, View } from 'react-native';

import { Badge, Card, darkTheme } from '../../../../design-system';
import type { BetHistoryItem, BetStatus } from '../types';
import { formatBetDate, formatEuroMinor, formatMultiplierBps } from '../utils/formatting';

export interface BetHistoryItemCardProps {
  bet: BetHistoryItem;
  onPress: () => void;
}

const statusLabels: Record<BetStatus, string> = {
  accepted: 'Em processamento',
  settled: 'Liquidada',
  voided: 'Anulada',
};

const statusTones: Record<BetStatus, 'warning' | 'success' | 'neutral'> = {
  accepted: 'warning',
  settled: 'success',
  voided: 'neutral',
};

export function BetHistoryItemCard({ bet, onPress }: BetHistoryItemCardProps) {
  return (
    <Card
      accessibilityLabel={`Abrir aposta ${bet.betId}`}
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
        <Badge label={statusLabels[bet.status]} tone={statusTones[bet.status]} />
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Aposta</Text>
          <Text style={styles.metricValue}>{formatEuroMinor(bet.stakeMinor)}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Multiplicador</Text>
          <Text style={styles.metricValue}>{formatMultiplierBps(bet.multiplierBps)}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Retorno</Text>
          <Text style={styles.metricValue}>
            {bet.payoutMinor === null ? '—' : formatEuroMinor(bet.payoutMinor)}
          </Text>
        </View>
      </View>

      <Text style={styles.timestamp}>{formatBetDate(bet.placedAt)}</Text>
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
