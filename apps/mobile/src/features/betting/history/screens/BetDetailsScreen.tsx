import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatCurrencyMinor, formatDateTime, formatNumber, useI18n } from '../../../../core/i18n';
import { Badge, Card, SystemState, darkTheme } from '../../../../design-system';
import type { BetDetails, BetStatus } from '../types';

export interface BetDetailsScreenProps {
  betId: string;
  details?: BetDetails | null;
}

const statusTones: Record<BetStatus, 'warning' | 'success' | 'neutral'> = {
  accepted: 'warning',
  settled: 'success',
  voided: 'neutral',
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text selectable style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export function BetDetailsScreen({ betId, details = null }: BetDetailsScreenProps) {
  const { locale, t } = useI18n();

  const statusLabel = details
    ? details.status === 'accepted'
      ? t('betting.status.accepted')
      : details.status === 'settled'
        ? t('betting.status.settled')
        : t('betting.status.voided')
    : null;
  const riskLabel = details
    ? details.risk === 'low'
      ? t('betting.details.risk.low')
      : details.risk === 'medium'
        ? t('betting.details.risk.medium')
        : t('betting.details.risk.high')
    : null;

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Badge label={t('betting.details.badge')} tone="brand" />
          <Text style={styles.title}>{t('betting.details.title')}</Text>
          <Text selectable style={styles.betId}>{betId}</Text>
        </View>

        {details === null ? (
          <SystemState
            kind="loading"
            title={t('betting.details.loadingTitle')}
            description={t('betting.details.loadingDescription')}
          />
        ) : (
          <>
            <Card elevated style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View>
                  <Text style={styles.game}>PLINKO</Text>
                  <Text style={styles.placedAt}>
                    {formatDateTime(details.placedAt, locale) ?? t('betting.dateUnavailable')}
                  </Text>
                </View>
                <Badge label={statusLabel ?? '—'} tone={statusTones[details.status]} />
              </View>

              <View style={styles.summaryMetrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>{t('betting.metric.stake')}</Text>
                  <Text style={styles.metricValue}>
                    {formatCurrencyMinor(details.stakeMinor, details.currency, locale)}
                  </Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>{t('betting.metric.multiplier')}</Text>
                  <Text style={styles.metricValue}>
                    {details.multiplierBps === null
                      ? '—'
                      : `${formatNumber(details.multiplierBps / 10_000, locale, 2)}×`}
                  </Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>{t('betting.metric.payout')}</Text>
                  <Text style={styles.metricValue}>
                    {details.payoutMinor === null
                      ? '—'
                      : formatCurrencyMinor(details.payoutMinor, details.currency, locale)}
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.detailsCard}>
              <Text style={styles.sectionTitle}>{t('betting.details.section')}</Text>
              <DetailRow label={t('betting.details.reference')} value={details.betId} />
              <DetailRow
                label={t('betting.details.rules')}
                value={`${details.rulesetId} · ${details.rulesetVersion}`}
              />
              <DetailRow label={t('betting.details.rows')} value={String(details.rows)} />
              <DetailRow label={t('betting.details.risk')} value={riskLabel ?? '—'} />
              <DetailRow
                label={t('betting.details.slot')}
                value={details.slot === null ? '—' : String(details.slot)}
              />
              <DetailRow
                label={t('betting.details.created')}
                value={formatDateTime(details.placedAt, locale) ?? t('betting.dateUnavailable')}
              />
              <DetailRow
                label={t('betting.details.settled')}
                value={
                  details.settledAt === null
                    ? '—'
                    : formatDateTime(details.settledAt, locale) ?? t('betting.dateUnavailable')
                }
              />
            </Card>
          </>
        )}

        <Text style={styles.footer}>{t('betting.details.footer')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: darkTheme.colors.background.app,
  },
  content: {
    paddingHorizontal: darkTheme.spacing.lg,
    paddingTop: darkTheme.spacing.xl,
    paddingBottom: darkTheme.spacing['4xl'],
    gap: darkTheme.spacing.xl,
  },
  header: {
    gap: darkTheme.spacing.sm,
  },
  title: {
    ...darkTheme.typography.heading1,
    color: darkTheme.colors.text.primary,
  },
  betId: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.disabled,
  },
  summaryCard: {
    gap: darkTheme.spacing.xl,
    backgroundColor: darkTheme.colors.surface.raised,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.md,
  },
  game: {
    ...darkTheme.typography.heading3,
    color: darkTheme.colors.text.primary,
  },
  placedAt: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
  summaryMetrics: {
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
  detailsCard: {
    gap: darkTheme.spacing.md,
  },
  sectionTitle: {
    ...darkTheme.typography.heading3,
    color: darkTheme.colors.text.primary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.lg,
    paddingVertical: darkTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.colors.border.default,
  },
  detailLabel: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
  },
  detailValue: {
    flex: 1,
    ...darkTheme.typography.bodyStrong,
    textAlign: 'right',
    color: darkTheme.colors.text.primary,
  },
  footer: {
    ...darkTheme.typography.caption,
    textAlign: 'center',
    color: darkTheme.colors.text.disabled,
  },
});
