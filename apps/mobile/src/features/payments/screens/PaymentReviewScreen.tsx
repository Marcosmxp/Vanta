import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatCurrencyMinor, useI18n } from '../../../core/i18n';
import { Badge, Button, Card, darkTheme } from '../../../design-system';
import type { PaymentFlowKind } from '../types';

export interface PaymentReviewScreenProps {
  kind: PaymentFlowKind;
  amountMinor: number;
  methodLabel: string;
  submitting?: boolean;
  onConfirm?: () => void;
  onEdit?: () => void;
}

export function PaymentReviewScreen({
  kind,
  amountMinor,
  methodLabel,
  submitting = false,
  onConfirm,
  onEdit,
}: PaymentReviewScreenProps) {
  const { locale, t } = useI18n();
  const isDeposit = kind === 'deposit';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Badge label={t('payment.review.badge')} tone="brand" />
          <Text style={styles.title}>
            {isDeposit ? t('payment.review.depositTitle') : t('payment.review.withdrawalTitle')}
          </Text>
          <Text style={styles.subtitle}>{t('payment.review.subtitle')}</Text>
        </View>

        <Card style={styles.card}>
          <Row
            label={t('payment.review.operation')}
            value={isDeposit ? t('payment.review.deposit') : t('payment.review.withdrawal')}
          />
          <Row label={t('payment.review.amount')} value={formatCurrencyMinor(amountMinor, 'EUR', locale)} />
          <Row label={t('payment.review.method')} value={methodLabel} />
          <Row label={t('payment.review.currency')} value="EUR" />
        </Card>

        <Card style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>{t('payment.review.noticeTitle')}</Text>
          <Text style={styles.noticeText}>{t('payment.review.noticeText')}</Text>
        </Card>

        <View style={styles.actions}>
          <Button
            label={
              isDeposit ? t('payment.review.confirmDeposit') : t('payment.review.confirmWithdrawal')
            }
            fullWidth
            loading={submitting}
            disabled={!onConfirm}
            onPress={onConfirm}
          />
          {onEdit ? (
            <Button label={t('payment.review.edit')} variant="secondary" fullWidth onPress={onEdit} />
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: darkTheme.colors.background.app },
  content: { flex: 1, padding: darkTheme.spacing.lg, gap: darkTheme.spacing.xl },
  header: { gap: darkTheme.spacing.sm },
  title: { ...darkTheme.typography.heading1, color: darkTheme.colors.text.primary },
  subtitle: { ...darkTheme.typography.bodyLarge, color: darkTheme.colors.text.secondary },
  card: { gap: darkTheme.spacing.md },
  noticeCard: { gap: darkTheme.spacing.sm },
  noticeTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  noticeText: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: darkTheme.spacing.lg },
  rowLabel: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  rowValue: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary, textAlign: 'right' },
  actions: { gap: darkTheme.spacing.sm },
});
