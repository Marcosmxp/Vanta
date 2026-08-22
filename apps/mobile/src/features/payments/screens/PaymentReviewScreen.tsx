import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, Card, darkTheme } from '../../../design-system';
import type { PaymentFlowKind } from '../types';
import { formatEuroMinor } from '../utils/money';

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
  const isDeposit = kind === 'deposit';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Badge label="Revisão" tone="brand" />
          <Text style={styles.title}>{isDeposit ? 'Confirmar depósito' : 'Confirmar levantamento'}</Text>
          <Text style={styles.subtitle}>
            Verifique os dados antes de enviar a intenção ao backend. Nenhum saldo é alterado nesta tela.
          </Text>
        </View>

        <Card style={styles.card}>
          <Row label="Operação" value={isDeposit ? 'Depósito' : 'Levantamento'} />
          <Row label="Montante" value={formatEuroMinor(amountMinor)} />
          <Row label="Método" value={methodLabel} />
          <Row label="Moeda" value="EUR" />
        </Card>

        <Card style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>Validação obrigatória no servidor</Text>
          <Text style={styles.noticeText}>
            A operação só pode avançar após autenticação, ownership da carteira, KYC/AML, jurisdição, limites, idempotência e regras do provider.
          </Text>
        </Card>

        <View style={styles.actions}>
          <Button
            label={isDeposit ? 'Confirmar depósito' : 'Confirmar levantamento'}
            fullWidth
            loading={submitting}
            disabled={!onConfirm}
            onPress={onConfirm}
          />
          {onEdit ? <Button label="Editar" variant="secondary" fullWidth onPress={onEdit} /> : null}
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
