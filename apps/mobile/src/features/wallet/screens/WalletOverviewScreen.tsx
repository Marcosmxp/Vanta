import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, SystemState, darkTheme } from '../../../design-system';
import { WalletActionsCard } from '../components/WalletActionsCard';
import { WalletBalanceCard } from '../components/WalletBalanceCard';
import { WalletTransactionItemCard } from '../components/WalletTransactionItemCard';
import { disconnectedWalletSnapshot } from '../provider/WalletProvider';
import type { WalletSnapshot } from '../types';

export interface WalletOverviewScreenProps {
  snapshot?: WalletSnapshot;
  onDeposit: () => void;
  onWithdraw: () => void;
  onOpenBetHistory: () => void;
  onOpenTransaction: (transactionId: string) => void;
}

export function WalletOverviewScreen({
  snapshot = disconnectedWalletSnapshot,
  onDeposit,
  onWithdraw,
  onOpenBetHistory,
  onOpenTransaction,
}: WalletOverviewScreenProps) {
  const walletReady = snapshot.balance.availability === 'ready';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>CARTEIRA</Text>
            <Text style={styles.title}>O seu dinheiro, com rastreabilidade.</Text>
            <Text style={styles.subtitle}>
              Saldos e movimentos apresentados aqui são projeções read-only do estado financeiro autorizado pelo servidor.
            </Text>
          </View>
          <Badge label="EUR" tone="neutral" />
        </View>

        <WalletBalanceCard balance={snapshot.balance} />
        <WalletActionsCard onDeposit={onDeposit} onWithdraw={onWithdraw} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionCopy}>
              <Text style={styles.eyebrow}>MOVIMENTOS</Text>
              <Text style={styles.sectionTitle}>Atividade financeira</Text>
            </View>
            <Badge
              label={snapshot.transactions.length > 0 ? `${snapshot.transactions.length} movimentos` : 'Sem movimentos'}
              tone="neutral"
            />
          </View>

          {snapshot.transactions.length === 0 ? (
            <SystemState
              kind={walletReady ? 'empty' : 'error'}
              compact
              title={walletReady ? 'Nenhum movimento disponível' : 'Movimentos indisponíveis'}
              description={
                snapshot.message ??
                (walletReady
                  ? 'As transações aparecerão quando existirem movimentos registados no ledger.'
                  : 'O cliente não apresenta transações ou saldos locais como substituto da API financeira autenticada.')
              }
            />
          ) : (
            <View style={styles.list}>
              {snapshot.transactions.map((transaction) => (
                <WalletTransactionItemCard
                  key={transaction.transactionId}
                  transaction={transaction}
                  onPress={() => onOpenTransaction(transaction.transactionId)}
                />
              ))}
            </View>
          )}
        </View>

        <Button
          label="Ver histórico de apostas"
          variant="secondary"
          fullWidth
          onPress={onOpenBetHistory}
        />

        <Text style={styles.footerNote}>
          O cliente nunca reconcilia saldos, confirma depósitos, autoriza levantamentos ou altera o ledger.
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
    paddingTop: darkTheme.spacing.lg,
    paddingBottom: darkTheme.spacing['4xl'],
    gap: darkTheme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: darkTheme.spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: darkTheme.spacing.sm,
  },
  eyebrow: {
    ...darkTheme.typography.labelSmall,
    color: darkTheme.colors.brand.primary,
    letterSpacing: 1.3,
  },
  title: {
    ...darkTheme.typography.heading1,
    color: darkTheme.colors.text.primary,
  },
  subtitle: {
    ...darkTheme.typography.bodyLarge,
    color: darkTheme.colors.text.secondary,
  },
  section: {
    gap: darkTheme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.md,
  },
  sectionCopy: {
    flex: 1,
    gap: darkTheme.spacing.xs,
  },
  sectionTitle: {
    ...darkTheme.typography.heading3,
    color: darkTheme.colors.text.primary,
  },
  list: {
    gap: darkTheme.spacing.sm,
  },
  footerNote: {
    ...darkTheme.typography.caption,
    textAlign: 'center',
    color: darkTheme.colors.text.disabled,
  },
});
