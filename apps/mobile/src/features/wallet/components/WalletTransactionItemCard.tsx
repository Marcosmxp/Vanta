import { StyleSheet, Text, View } from 'react-native';

import { Badge, Card, darkTheme } from '../../../design-system';
import type { WalletTransactionReadModel } from '../types';
import {
  formatWalletAmount,
  walletTransactionKindLabel,
  walletTransactionStatusLabel,
} from '../utils/formatting';

export interface WalletTransactionItemCardProps {
  transaction: WalletTransactionReadModel;
  onPress?: () => void;
}

export function WalletTransactionItemCard({ transaction, onPress }: WalletTransactionItemCardProps) {
  const signedAmount = transaction.direction === 'debit' ? -transaction.amountMinor : transaction.amountMinor;
  const tone =
    transaction.status === 'completed'
      ? 'success'
      : transaction.status === 'pending'
        ? 'warning'
        : transaction.status === 'failed'
          ? 'danger'
          : 'neutral';

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${walletTransactionKindLabel(transaction.kind)} ${transaction.description}`}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.kind}>{walletTransactionKindLabel(transaction.kind)}</Text>
          <Text numberOfLines={1} style={styles.description}>{transaction.description}</Text>
        </View>
        <Text style={[styles.amount, transaction.direction === 'credit' && styles.creditAmount]}>
          {transaction.direction === 'credit' ? '+' : ''}{formatWalletAmount(signedAmount, transaction.currency)}
        </Text>
      </View>

      <View style={styles.footer}>
        <Badge label={walletTransactionStatusLabel(transaction.status)} tone={tone} />
        <Text style={styles.timestamp}>{transaction.occurredAt}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: darkTheme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.md,
  },
  copy: {
    flex: 1,
    gap: darkTheme.spacing.xs,
  },
  kind: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.text.primary,
  },
  description: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
  },
  amount: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.text.primary,
  },
  creditAmount: {
    color: darkTheme.colors.status.success,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.md,
  },
  timestamp: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.disabled,
  },
});
