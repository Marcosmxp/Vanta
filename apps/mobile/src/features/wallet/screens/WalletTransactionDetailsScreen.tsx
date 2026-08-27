import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatCurrencyMinor, useI18n, type TranslationKey } from '../../../core/i18n';
import { SystemStateScreen } from '../../../core/system-state/screens/SystemStateScreen';
import { Badge, Card, darkTheme } from '../../../design-system';
import type { WalletTransactionDetailReadModel, WalletTransactionKind, WalletTransactionStatus } from '../types';

export interface WalletTransactionDetailsScreenProps {
  transactionId: string;
  transaction: WalletTransactionDetailReadModel | null;
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text selectable style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export function WalletTransactionDetailsScreen({ transactionId, transaction }: WalletTransactionDetailsScreenProps) {
  const { locale, t } = useI18n();

  if (!transaction) {
    return <SystemStateScreen kind="loading" title={t('wallet.detailLoadingTitle')} description={t('wallet.detailLoadingDescription')} />;
  }

  const signedAmount = transaction.direction === 'debit' ? -transaction.amountMinor : transaction.amountMinor;
  const tone = transaction.status === 'completed' ? 'success' : transaction.status === 'pending' ? 'warning' : transaction.status === 'failed' ? 'danger' : 'neutral';

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Badge label={t(statusKeys[transaction.status])} tone={tone} />
          <Text style={styles.eyebrow}>{t(kindKeys[transaction.kind]).toUpperCase()}</Text>
          <Text style={styles.title}>{transaction.description}</Text>
          <Text style={styles.amount}>{transaction.direction === 'credit' ? '+' : ''}{formatCurrencyMinor(signedAmount, transaction.currency, locale)}</Text>
        </View>

        <Card style={styles.card}>
          <DetailRow label={t('wallet.detailReference')} value={transaction.referenceId ?? transactionId} />
          <DetailRow label={t('wallet.detailDirection')} value={transaction.direction === 'credit' ? t('wallet.detailCredit') : t('wallet.detailDebit')} />
          <DetailRow label={t('wallet.detailRecorded')} value={transaction.occurredAt} />
          {transaction.settledAt ? <DetailRow label={t('wallet.detailSettled')} value={transaction.settledAt} /> : null}
          {transaction.balanceAfterMinor !== undefined ? (
            <DetailRow label={t('wallet.detailBalanceAfter')} value={formatCurrencyMinor(transaction.balanceAfterMinor, transaction.currency, locale)} />
          ) : null}
        </Card>

        <Text style={styles.footerNote}>{t('wallet.detailFooter')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: darkTheme.colors.background.app },
  content: { padding: darkTheme.spacing.lg, paddingBottom: darkTheme.spacing['4xl'], gap: darkTheme.spacing.xl },
  hero: { gap: darkTheme.spacing.sm },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.3 },
  title: { ...darkTheme.typography.heading2, color: darkTheme.colors.text.primary },
  amount: { ...darkTheme.typography.display, color: darkTheme.colors.text.primary, paddingTop: darkTheme.spacing.sm },
  card: { gap: darkTheme.spacing.md },
  detailRow: { paddingBottom: darkTheme.spacing.md, borderBottomWidth: 1, borderBottomColor: darkTheme.colors.border.default, gap: darkTheme.spacing.xs },
  detailLabel: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  detailValue: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  footerNote: { ...darkTheme.typography.caption, textAlign: 'center', color: darkTheme.colors.text.disabled },
});
