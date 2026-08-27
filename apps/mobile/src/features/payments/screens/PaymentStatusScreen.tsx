import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatCurrencyMinor, useI18n } from '../../../core/i18n';
import { Badge, Button, Card, darkTheme } from '../../../design-system';
import type { PaymentIntentReadModel } from '../types';

export interface PaymentStatusScreenProps {
  intent: PaymentIntentReadModel;
  onDone?: () => void;
}

export function PaymentStatusScreen({ intent, onDone }: PaymentStatusScreenProps) {
  const { locale, t } = useI18n();
  const copy = (() => {
    switch (intent.status) {
      case 'requires_action':
        return {
          label: t('payment.status.requiresActionLabel'),
          tone: 'warning' as const,
          title: t('payment.status.requiresActionTitle'),
        };
      case 'processing':
        return {
          label: t('payment.status.processingLabel'),
          tone: 'warning' as const,
          title: t('payment.status.processingTitle'),
        };
      case 'succeeded':
        return {
          label: t('payment.status.succeededLabel'),
          tone: 'success' as const,
          title: t('payment.status.succeededTitle'),
        };
      case 'failed':
        return {
          label: t('payment.status.failedLabel'),
          tone: 'danger' as const,
          title: t('payment.status.failedTitle'),
        };
      case 'cancelled':
        return {
          label: t('payment.status.cancelledLabel'),
          tone: 'neutral' as const,
          title: t('payment.status.cancelledTitle'),
        };
    }
  })();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Badge label={copy.label} tone={copy.tone} />
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{t('payment.status.subtitle')}</Text>
        </View>

        <Card style={styles.card}>
          <Row
            label={t('payment.status.operation')}
            value={intent.kind === 'deposit' ? t('payment.review.deposit') : t('payment.review.withdrawal')}
          />
          <Row
            label={t('payment.status.amount')}
            value={formatCurrencyMinor(intent.amountMinor, 'EUR', locale)}
          />
          <Row label={t('payment.status.method')} value={intent.methodLabel} />
          <Row label={t('payment.status.reference')} value={intent.paymentIntentId} />
          <Row label={t('payment.status.updated')} value={intent.updatedAt} />
        </Card>

        {intent.userMessage ? <Text style={styles.message}>{intent.userMessage}</Text> : null}

        {onDone ? <Button label={t('payment.status.backWallet')} fullWidth onPress={onDone} /> : null}

        <Text style={styles.footer}>{t('payment.status.footer')}</Text>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: darkTheme.spacing.lg },
  rowLabel: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  rowValue: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary, flexShrink: 1, textAlign: 'right' },
  message: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  footer: { ...darkTheme.typography.caption, textAlign: 'center', color: darkTheme.colors.text.disabled },
});
