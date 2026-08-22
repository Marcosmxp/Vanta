import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Card, darkTheme } from '../../../../design-system';
import { BetHistoryItemCard } from '../components/BetHistoryItemCard';
import { disconnectedBetHistorySnapshot } from '../provider/BetHistoryProvider';
import type { BetHistorySnapshot } from '../types';

export interface BetHistoryScreenProps {
  snapshot?: BetHistorySnapshot;
  onOpenBet: (betId: string) => void;
}

export function BetHistoryScreen({
  snapshot = disconnectedBetHistorySnapshot,
  onOpenBet,
}: BetHistoryScreenProps) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Badge label="APOSTAS" tone="brand" />
          <Text style={styles.title}>Histórico de apostas</Text>
          <Text style={styles.description}>
            Consulte apostas registadas pelo servidor, incluindo stake, estado, multiplicador e retorno.
          </Text>
        </View>

        {snapshot.items.length === 0 ? (
          <Card style={styles.emptyCard}>
            <View style={styles.emptyMark} />
            <View style={styles.emptyCopy}>
              <Text style={styles.emptyTitle}>
                {snapshot.availability === 'restricted'
                  ? 'Histórico indisponível'
                  : 'Nenhuma aposta disponível'}
              </Text>
              <Text style={styles.emptyDescription}>
                {snapshot.message ??
                  'As apostas aparecerão aqui apenas depois de serem recebidas da API autenticada.'}
              </Text>
            </View>
          </Card>
        ) : (
          <View style={styles.list}>
            {snapshot.items.map((bet) => (
              <BetHistoryItemCard
                key={bet.betId}
                bet={bet}
                onPress={() => onOpenBet(bet.betId)}
              />
            ))}
          </View>
        )}

        <Text style={styles.footer}>
          Este ecrã é uma projeção read-only. Liquidação, saldo e estado canónico permanecem no backend Vanta.
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
  description: {
    ...darkTheme.typography.bodyLarge,
    color: darkTheme.colors.text.secondary,
  },
  list: {
    gap: darkTheme.spacing.md,
  },
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.lg,
  },
  emptyMark: {
    width: 44,
    height: 44,
    borderRadius: darkTheme.radius.full,
    borderWidth: 1,
    borderColor: darkTheme.colors.border.strong,
    backgroundColor: darkTheme.colors.surface.raised,
  },
  emptyCopy: {
    flex: 1,
    gap: darkTheme.spacing.xs,
  },
  emptyTitle: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.text.primary,
  },
  emptyDescription: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
  },
  footer: {
    ...darkTheme.typography.caption,
    textAlign: 'center',
    color: darkTheme.colors.text.disabled,
  },
});
