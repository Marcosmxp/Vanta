import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatCurrencyMinor, useI18n, type AppTranslationKey } from '../../../../core/i18n';
import { Badge, Card, SystemState, darkTheme } from '../../../../design-system';
import { BetControls } from '../components/BetControls';
import { MultiplierRow } from '../components/MultiplierRow';
import { PlinkoBoard } from '../components/PlinkoBoard';
import { disconnectedPlinkoSnapshot, type PlinkoProvider } from '../provider/PlinkoProvider';
import type { PlinkoAuthoritativeResult, PlinkoSnapshot } from '../types';
import { isRenderablePlinkoResult } from '../utils/validation';

export interface PlinkoGameScreenProps {
  snapshot?: PlinkoSnapshot;
  provider?: PlinkoProvider | null;
}

const VISUAL_PREVIEW_ROWS = 12;

function ResultCard({ result }: { result: PlinkoAuthoritativeResult }) {
  const { locale, t } = useI18n();
  return (
    <Card elevated style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <Badge label={t('plinko.resultConfirmed')} tone="success" />
        <Text style={styles.resultBetId}>#{result.betId}</Text>
      </View>
      <View style={styles.resultMetrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>{t('plinko.multiplier')}</Text>
          <Text style={styles.metricValue}>{(result.multiplierBps / 10_000).toFixed(2)}x</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>{t('plinko.payout')}</Text>
          <Text style={styles.metricValue}>{formatCurrencyMinor(result.payoutMinor, result.currency, locale)}</Text>
        </View>
      </View>
      <Text style={styles.resultNote}>{t('plinko.resultNote')}</Text>
    </Card>
  );
}

export function PlinkoGameScreen({ snapshot = disconnectedPlinkoSnapshot, provider = null }: PlinkoGameScreenProps) {
  const { t } = useI18n();
  const { width: windowWidth } = useWindowDimensions();
  const ruleset = snapshot.ruleset;
  const rows = ruleset?.rows ?? VISUAL_PREVIEW_ROWS;
  const boardWidth = Math.min(Math.max(windowWidth - 32, 280), 440);
  const initialStake = ruleset?.minStakeMinor ?? 0;
  const [stakeMinor, setStakeMinor] = useState(initialStake);
  const [lastResult, setLastResult] = useState<PlinkoAuthoritativeResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorKey, setErrorKey] = useState<AppTranslationKey | null>(null);

  useEffect(() => {
    if (ruleset) {
      setStakeMinor((current) => current >= ruleset.minStakeMinor && current <= ruleset.maxStakeMinor ? current : ruleset.minStakeMinor);
    }
  }, [ruleset]);

  const path = useMemo(() => lastResult?.path ?? [], [lastResult]);

  async function placeBet() {
    if (!provider || !ruleset || snapshot.availability !== 'ready') return;
    setSubmitting(true);
    setErrorKey(null);
    try {
      const result = await provider.placeBet({ stakeMinor, rulesetVersion: ruleset.version });
      if (!isRenderablePlinkoResult(result, ruleset)) {
        setLastResult(null);
        setErrorKey('plinko.errorInconsistent');
        return;
      }
      setLastResult(result);
    } catch {
      setLastResult(null);
      setErrorKey('plinko.errorFailed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.titleBlock}>
              <Text style={styles.eyebrow}>{t('plinko.eyebrow')}</Text>
              <Text style={styles.title}>Plinko</Text>
            </View>
            <Badge label={snapshot.availability === 'ready' ? t('plinko.available') : t('plinko.unavailable')} tone={snapshot.availability === 'ready' ? 'success' : 'neutral'} />
          </View>
          <Text style={styles.description}>{t('plinko.description')}</Text>
        </View>

        {snapshot.availability !== 'ready' ? (
          <SystemState kind="offline" compact title={t('plinko.offlineTitle')} description={t('plinko.offlineDescription')} />
        ) : null}

        <PlinkoBoard rows={rows} width={boardWidth} path={path} activeSlot={lastResult?.slot ?? null} />
        <MultiplierRow rows={rows} multipliersBps={ruleset?.multipliersBps ?? null} activeSlot={lastResult?.slot ?? null} />

        {errorKey ? <SystemState kind="error" compact title={t('plinko.errorTitle')} description={t(errorKey)} /> : null}
        {lastResult ? <ResultCard result={lastResult} /> : null}

        <BetControls
          ruleset={ruleset}
          stakeMinor={stakeMinor}
          disabled={snapshot.availability !== 'ready' || !provider}
          loading={submitting}
          onStakeChange={setStakeMinor}
          onPlaceBet={placeBet}
        />

        <Card style={styles.securityCard}>
          <Text style={styles.securityTitle}>{t('plinko.integrityTitle')}</Text>
          <Text style={styles.securityText}>{t('plinko.integrityText')}</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: darkTheme.colors.background.app },
  content: { paddingHorizontal: darkTheme.spacing.lg, paddingTop: darkTheme.spacing.lg, paddingBottom: darkTheme.spacing['5xl'], gap: darkTheme.spacing.lg },
  header: { gap: darkTheme.spacing.sm },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: darkTheme.spacing.md },
  titleBlock: { flex: 1, gap: darkTheme.spacing.xs },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.6 },
  title: { ...darkTheme.typography.display, color: darkTheme.colors.text.primary },
  description: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  resultCard: { gap: darkTheme.spacing.lg },
  resultHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  resultBetId: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  resultMetrics: { flexDirection: 'row', gap: darkTheme.spacing.lg },
  metric: { flex: 1, gap: darkTheme.spacing.xs },
  metricLabel: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  metricValue: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  resultNote: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  securityCard: { gap: darkTheme.spacing.sm, backgroundColor: darkTheme.colors.surface.default },
  securityTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  securityText: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
});
