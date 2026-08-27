import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useI18n } from '../../../../core/i18n';
import { Badge, SystemState, darkTheme } from '../../../../design-system';
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
  const { t } = useI18n();
  const emptyKind = snapshot.availability === 'ready' ? 'empty' : 'error';
  const emptyTitle =
    snapshot.availability === 'ready'
      ? t('betting.history.emptyTitle')
      : snapshot.availability === 'restricted'
        ? t('betting.history.restrictedTitle')
        : t('betting.history.unavailableTitle');

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Badge label={t('betting.history.badge')} tone="brand" />
          <Text style={styles.title}>{t('betting.history.title')}</Text>
          <Text style={styles.description}>{t('betting.history.description')}</Text>
        </View>

        {snapshot.items.length === 0 ? (
          <SystemState
            kind={emptyKind}
            title={emptyTitle}
            description={
              snapshot.message ??
              (snapshot.availability === 'ready'
                ? t('betting.history.emptyDescription')
                : t('betting.history.unavailableDescription'))
            }
          />
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

        <Text style={styles.footer}>{t('betting.history.footer')}</Text>
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
  footer: {
    ...darkTheme.typography.caption,
    textAlign: 'center',
    color: darkTheme.colors.text.disabled,
  },
});
