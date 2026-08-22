import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Card, darkTheme } from '../../../../design-system';
import { BetControls } from '../components/BetControls';
import { MultiplierRow } from '../components/MultiplierRow';
import { PlinkoBoard } from '../components/PlinkoBoard';
import {
  disconnectedPlinkoSnapshot,
  type PlinkoProvider,
} from '../provider/PlinkoProvider';
import type { PlinkoAuthoritativeResult, PlinkoSnapshot } from '../types';
import { isRenderablePlinkoResult } from '../utils/validation';

export interface PlinkoGameScreenProps {
  snapshot?: PlinkoSnapshot;
  provider?: PlinkoProvider | null;
}

const VISUAL_PREVIEW_ROWS = 12;

function formatMoney(minor: number, currency: 'EUR') {
  return `${(minor / 100).toFixed(2).replace('.', ',')} ${currency === 'EUR' ? '€' : currency}`;
}

function ResultCard({ result }: { result: PlinkoAuthoritativeResult }) {
  return (
    <Card elevated style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <Badge label="Resultado confirmado" tone="success" />
        <Text style={styles.resultBetId}>#{result.betId}</Text>
      </View>
      <View style={styles.resultMetrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Multiplicador</Text>
          <Text style={styles.metricValue}>{(result.multiplierBps / 10_000).toFixed(2)}x</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Pagamento</Text>
          <Text style={styles.metricValue}>{formatMoney(result.payoutMinor, result.currency)}</Text>
        </View>
      </View>
      <Text style={styles.resultNote}>
        Estes valores são exibidos exatamente como recebidos do resultado autoritativo; a tela não recalcula settlement.
      </Text>
    </Card>
  );
}

export function PlinkoGameScreen({
  snapshot = disconnectedPlinkoSnapshot,
  provider = null,
}: PlinkoGameScreenProps) {
  const { width: windowWidth } = useWindowDimensions();
  const ruleset = snapshot.ruleset;
  const rows = ruleset?.rows ?? VISUAL_PREVIEW_ROWS;
  const boardWidth = Math.min(Math.max(windowWidth - 32, 280), 440);

  const initialStake = ruleset?.minStakeMinor ?? 0;
  const [stakeMinor, setStakeMinor] = useState(initialStake);
  const [lastResult, setLastResult] = useState<PlinkoAuthoritativeResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (ruleset) {
      setStakeMinor((current) =>
        current >= ruleset.minStakeMinor && current <= ruleset.maxStakeMinor
          ? current
          : ruleset.minStakeMinor,
      );
    }
  }, [ruleset]);

  const path = useMemo(() => lastResult?.path ?? [], [lastResult]);

  async function placeBet() {
    if (!provider || !ruleset || snapshot.availability !== 'ready') {
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    try {
      const result = await provider.placeBet({
        stakeMinor,
        rulesetVersion: ruleset.version,
      });

      if (!isRenderablePlinkoResult(result, ruleset)) {
        setLastResult(null);
        setErrorMessage('O servidor devolveu um resultado inconsistente. A animação foi bloqueada.');
        return;
      }

      setLastResult(result);
    } catch {
      setLastResult(null);
      setErrorMessage('Não foi possível confirmar a aposta. Nenhum resultado local foi gerado.');
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
              <Text style={styles.eyebrow}>VANTA ORIGINAL</Text>
              <Text style={styles.title}>Plinko</Text>
            </View>
            <Badge
              label={snapshot.availability === 'ready' ? 'Servidor ligado' : 'Modo protegido'}
              tone={snapshot.availability === 'ready' ? 'success' : 'neutral'}
            />
          </View>
          <Text style={styles.description}>
            A bola reproduz apenas o caminho devolvido pelo servidor. Sem resultado autoritativo, não existe RNG no dispositivo.
          </Text>
        </View>

        <PlinkoBoard
          rows={rows}
          width={boardWidth}
          path={path}
          activeSlot={lastResult?.slot ?? null}
        />

        <MultiplierRow
          rows={rows}
          multipliersBps={ruleset?.multipliersBps ?? null}
          activeSlot={lastResult?.slot ?? null}
        />

        {errorMessage ? (
          <Card style={styles.errorCard}>
            <Text accessibilityLiveRegion="polite" style={styles.errorText}>{errorMessage}</Text>
          </Card>
        ) : null}

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
          <Text style={styles.securityTitle}>Integridade financeira</Text>
          <Text style={styles.securityText}>
            {snapshot.message ??
              'A aceitação da aposta depende de autenticação, wallet, ledger, limites e regras de jogo responsável no backend.'}
          </Text>
        </Card>
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
    paddingTop: darkTheme.spacing.lg,
    paddingBottom: darkTheme.spacing['5xl'],
    gap: darkTheme.spacing.lg,
  },
  header: {
    gap: darkTheme.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: darkTheme.spacing.md,
  },
  titleBlock: {
    flex: 1,
    gap: darkTheme.spacing.xs,
  },
  eyebrow: {
    ...darkTheme.typography.labelSmall,
    color: darkTheme.colors.brand.primary,
    letterSpacing: 1.6,
  },
  title: {
    ...darkTheme.typography.display,
    color: darkTheme.colors.text.primary,
  },
  description: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
  },
  errorCard: {
    borderColor: darkTheme.colors.status.danger,
  },
  errorText: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.status.danger,
  },
  resultCard: {
    gap: darkTheme.spacing.lg,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.md,
  },
  resultBetId: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
  resultMetrics: {
    flexDirection: 'row',
    gap: darkTheme.spacing.lg,
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
    ...darkTheme.typography.heading3,
    color: darkTheme.colors.text.primary,
  },
  resultNote: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
  securityCard: {
    gap: darkTheme.spacing.sm,
    backgroundColor: darkTheme.colors.surface.default,
  },
  securityTitle: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.text.primary,
  },
  securityText: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
  },
});
