import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Card, SystemState, darkTheme } from '../../../../design-system';
import type { BetDetails, BetStatus } from '../types';
import { formatBetDate, formatEuroMinor, formatMultiplierBps } from '../utils/formatting';

export interface BetDetailsScreenProps {
  betId: string;
  details?: BetDetails | null;
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text selectable style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export function BetDetailsScreen({ betId, details = null }: BetDetailsScreenProps) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Badge label="DETALHE" tone="brand" />
          <Text style={styles.title}>Detalhe da aposta</Text>
          <Text selectable style={styles.betId}>{betId}</Text>
        </View>

        {details === null ? (
          <SystemState
            kind="loading"
            title="A carregar detalhe da aposta"
            description="O detalhe será obtido pela API autenticada. O cliente não reconstrói nem inventa liquidação localmente."
          />
        ) : (
          <>
            <Card elevated style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View>
                  <Text style={styles.game}>PLINKO</Text>
                  <Text style={styles.placedAt}>{formatBetDate(details.placedAt)}</Text>
                </View>
                <Badge label={statusLabels[details.status]} tone={statusTones[details.status]} />
              </View>

              <View style={styles.summaryMetrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Aposta</Text>
                  <Text style={styles.metricValue}>{formatEuroMinor(details.stakeMinor)}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Multiplicador</Text>
                  <Text style={styles.metricValue}>{formatMultiplierBps(details.multiplierBps)}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Retorno</Text>
                  <Text style={styles.metricValue}>
                    {details.payoutMinor === null ? '—' : formatEuroMinor(details.payoutMinor)}
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.detailsCard}>
              <Text style={styles.sectionTitle}>Auditoria da aposta</Text>
              <DetailRow label="Bet ID" value={details.betId} />
              <DetailRow label="Ruleset" value={`${details.rulesetId} · ${details.rulesetVersion}`} />
              <DetailRow label="Linhas" value={String(details.rows)} />
              <DetailRow label="Risco" value={details.risk.toUpperCase()} />
              <DetailRow label="Slot" value={details.slot === null ? '—' : String(details.slot)} />
              <DetailRow label="Criada" value={formatBetDate(details.placedAt)} />
              <DetailRow
                label="Liquidada"
                value={details.settledAt === null ? '—' : formatBetDate(details.settledAt)}
              />
            </Card>
          </>
        )}

        <Text style={styles.footer}>
          Os valores exibidos refletem o read model recebido do backend. O mobile não recalcula payout nem altera o estado da aposta.
        </Text>
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
