import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, Card, darkTheme } from '../../../design-system';
import type { PaymentIntentReadModel } from '../types';
import { formatEuroMinor } from '../utils/money';

export interface PaymentStatusScreenProps {
  intent: PaymentIntentReadModel;
  onDone?: () => void;
}

function statusCopy(status: PaymentIntentReadModel['status']) {
  switch (status) {
    case 'requires_action':
      return { label: 'Ação necessária', tone: 'warning' as const, title: 'Confirmação pendente' };
    case 'processing':
      return { label: 'Em processamento', tone: 'warning' as const, title: 'Estamos a processar' };
    case 'succeeded':
      return { label: 'Concluído', tone: 'success' as const, title: 'Operação concluída' };
    case 'failed':
      return { label: 'Falhou', tone: 'danger' as const, title: 'Não foi possível concluir' };
    case 'cancelled':
      return { label: 'Cancelado', tone: 'neutral' as const, title: 'Operação cancelada' };
  }
}

export function PaymentStatusScreen({ intent, onDone }: PaymentStatusScreenProps) {
  const copy = statusCopy(intent.status);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Badge label={copy.label} tone={copy.tone} />
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>
            Este estado é uma projeção do payment intent autorizado pelo backend.
          </Text>
        </View>

        <Card style={styles.card}>
          <Row label="Operação" value={intent.kind === 'deposit' ? 'Depósito' : 'Levantamento'} />
          <Row label="Montante" value={formatEuroMinor(intent.amountMinor)} />
          <Row label="Método" value={intent.methodLabel} />
          <Row label="Payment intent" value={intent.paymentIntentId} />
          <Row label="Atualizado" value={intent.updatedAt} />
        </Card>

        {intent.userMessage ? <Text style={styles.message}>{intent.userMessage}</Text> : null}

        {onDone ? <Button label="Voltar à carteira" fullWidth onPress={onDone} /> : null}

        <Text style={styles.footer}>
          O cliente não confirma settlement, não altera saldo e não transforma um status local em sucesso financeiro.
        </Text>
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
