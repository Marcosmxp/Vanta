import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SystemStateScreen } from '../../../core/system-state/screens/SystemStateScreen';
import { Badge, Card, darkTheme } from '../../../design-system';
import type { WalletTransactionDetailReadModel } from '../types';
import {
  formatWalletAmount,
  walletTransactionKindLabel,
  walletTransactionStatusLabel,
} from '../utils/formatting';

export interface WalletTransactionDetailsScreenProps {
  transactionId: string;
  transaction: WalletTransactionDetailReadModel | null;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text selectable style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export function WalletTransactionDetailsScreen({
  transactionId,
  transaction,
}: WalletTransactionDetailsScreenProps) {
  if (!transaction) {
    return (
      <SystemStateScreen
        kind="loading"
        title="A carregar movimento"
        description={`O detalhe de ${transactionId} será carregado apenas pela API financeira autenticada e com verificação de ownership.`}
      />
    );
  }

  const signedAmount = transaction.direction === 'debit' ? -transaction.amountMinor : transaction.amountMinor;

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Badge label={walletTransactionStatusLabel(transaction.status)} tone={transaction.status === 'completed' ? 'success' : transaction.status === 'pending' ? 'warning' : transaction.status === 'failed' ? 'danger' : 'neutral'} />
          <Text style={styles.eyebrow}>{walletTransactionKindLabel(transaction.kind).toUpperCase()}</Text>
          <Text style={styles.title}>{transaction.description}</Text>
          <Text style={styles.amount}>
            {transaction.direction === 'credit' ? '+' : ''}{formatWalletAmount(signedAmount, transaction.currency)}
          </Text>
        </View>

        <Card style={styles.card}>
          <DetailRow label="Transaction ID" value={transaction.transactionId} />
          <DetailRow label="Wallet ID" value={transaction.walletId} />
          <DetailRow label="Direção" value={transaction.direction === 'credit' ? 'Crédito' : 'Débito'} />
          <DetailRow label="Registado em" value={transaction.occurredAt} />
          {transaction.settledAt ? <DetailRow label="Liquidado em" value={transaction.settledAt} /> : null}
          {transaction.referenceId ? <DetailRow label="Referência" value={transaction.referenceId} /> : null}
          {transaction.balanceAfterMinor !== undefined ? (
            <DetailRow
              label="Saldo após movimento"
              value={formatWalletAmount(transaction.balanceAfterMinor, transaction.currency)}
            />
          ) : null}
        </Card>

        <Text style={styles.footerNote}>
          Este ecrã apresenta um read model de auditoria. Não altera a transação nem o saldo contabilístico.
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
    padding: darkTheme.spacing.lg,
    paddingBottom: darkTheme.spacing['4xl'],
    gap: darkTheme.spacing.xl,
  },
  hero: {
    gap: darkTheme.spacing.sm,
  },
  eyebrow: {
    ...darkTheme.typography.labelSmall,
    color: darkTheme.colors.brand.primary,
    letterSpacing: 1.3,
  },
  title: {
    ...darkTheme.typography.heading2,
    color: darkTheme.colors.text.primary,
  },
  amount: {
    ...darkTheme.typography.display,
    color: darkTheme.colors.text.primary,
    paddingTop: darkTheme.spacing.sm,
  },
  card: {
    gap: darkTheme.spacing.md,
  },
  detailRow: {
    paddingBottom: darkTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.colors.border.default,
    gap: darkTheme.spacing.xs,
  },
  detailLabel: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
  detailValue: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.text.primary,
  },
  footerNote: {
    ...darkTheme.typography.caption,
    textAlign: 'center',
    color: darkTheme.colors.text.disabled,
  },
});
