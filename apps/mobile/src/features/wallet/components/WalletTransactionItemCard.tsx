import { StyleSheet, Text, View } from 'react-native';

import { formatCurrencyMinor, useI18n, type TranslationKey } from '../../../core/i18n';
import { Badge, Card, darkTheme } from '../../../design-system';
import type { WalletTransactionKind, WalletTransactionReadModel, WalletTransactionStatus } from '../types';

export interface WalletTransactionItemCardProps {
  transaction: WalletTransactionReadModel;
  onPress?: () => void;
}

const kindKeys: Record<WalletTransactionKind, TranslationKey> = {
  deposit: 'wallet.kind.deposit',
  withdrawal: 'wallet.kind.withdrawal',
  wager: 'wallet.kind.wager',
  payout: 'wallet.kind.payout',
  refund: 'wallet.kind.refund',
  adjustment: 'wallet.kind.adjustment',
};

const statusKeys: Record<WalletTransactionStatus, TranslationKey> = {
  pending: 'wallet.status.pending',
  completed: 'wallet.status.completed',
  failed: 'wallet.status.failed',
  reversed: 'wallet.status.reversed',
};

export function WalletTransactionItemCard({ transaction, onPress }: WalletTransactionItemCardProps) {
  const { locale, t } = useI18n();
  const signedAmount = transaction.direction === 'debit' ? -transaction.amountMinor : transaction.amountMinor;
  const tone = transaction.status === 'completed'
    ? 'success'
    : transaction.status === 'pending'
      ? 'warning'
      : transaction.status === 'failed'
        ? 'danger'
        : 'neutral';
  const kind = t(kindKeys[transaction.kind]);

  return (
    <Card onPress={onPress} accessibilityLabel={`${kind} ${transaction.description}`} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.kind}>{kind}</Text>
          <Text numberOfLines={1} style={styles.description}>{transaction.description}</Text>
        </View>
        <Text style={[styles.amount, transaction.direction === 'credit' && styles.creditAmount]}>
          {transaction.direction === 'credit' ? '+' : ''}{formatCurrencyMinor(signedAmount, transaction.currency, locale)}
        </Text>
      </View>
      <View style={styles.footer}>
        <Badge label={t(statusKeys[transaction.status])} tone={tone} />
        <Text style={styles.timestamp}>{transaction.occurredAt}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: darkTheme.spacing.md },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  copy: { flex: 1, gap: darkTheme.spacing.xs },
  kind: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  description: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  amount: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  creditAmount: { color: darkTheme.colors.status.success },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  timestamp: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled },
});
