import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, Card, Input, darkTheme } from '../../../design-system';
import { disconnectedPaymentCapabilities } from '../provider/PaymentProvider';
import type { PaymentCapabilitySnapshot, PaymentFlowKind } from '../types';
import { formatEuroMinor, parseEuroAmountToMinor } from '../utils/money';

export interface PaymentFlowScreenProps {
  kind: PaymentFlowKind;
  capabilities?: PaymentCapabilitySnapshot;
  onConfirm?: (amountMinor: number, methodId: string) => void;
}

export function PaymentFlowScreen({
  kind,
  capabilities = disconnectedPaymentCapabilities,
  onConfirm,
}: PaymentFlowScreenProps) {
  const [amount, setAmount] = useState('');
  const [methodId, setMethodId] = useState<string | null>(null);
  const amountMinor = useMemo(() => parseEuroAmountToMinor(amount), [amount]);
  const isDeposit = kind === 'deposit';
  const methods = isDeposit ? capabilities.depositMethods : capabilities.withdrawalMethods;
  const minMinor = isDeposit ? capabilities.minDepositMinor : capabilities.minWithdrawalMinor;
  const maxMinor = isDeposit ? capabilities.maxDepositMinor : capabilities.maxWithdrawalMinor;
  const selectedMethod = methods.find((method) => method.id === methodId && method.enabled);
  const amountWithinLimits =
    amountMinor !== null &&
    minMinor !== null &&
    maxMinor !== null &&
    amountMinor >= minMinor &&
    amountMinor <= maxMinor;
  const canSubmit =
    capabilities.availability === 'ready' &&
    amountWithinLimits &&
    Boolean(selectedMethod) &&
    Boolean(onConfirm);

  const title = isDeposit ? 'Depositar fundos' : 'Levantar fundos';
  const actionLabel = isDeposit ? 'Continuar depósito' : 'Continuar levantamento';

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>{isDeposit ? 'DEPÓSITO' : 'LEVANTAMENTO'}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
              Valores, métodos e disponibilidade são definidos pelo backend. O cliente apenas recolhe a intenção.
            </Text>
          </View>
          <Badge label="EUR" tone="neutral" />
        </View>

        {capabilities.availability !== 'ready' ? (
          <Card style={styles.noticeCard}>
            <Badge label="Indisponível" tone="warning" />
            <Text style={styles.noticeText}>{capabilities.message}</Text>
          </Card>
        ) : null}

        <Card style={styles.card}>
          <Input
            label="Montante"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0,00"
            trailing={<Text style={styles.currency}>EUR</Text>}
            helperText={
              minMinor !== null && maxMinor !== null
                ? `Limites autorizados: ${formatEuroMinor(minMinor)} — ${formatEuroMinor(maxMinor)}`
                : 'Os limites serão carregados da API autenticada.'
            }
          />
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método</Text>
          {methods.length === 0 ? (
            <Card>
              <Text style={styles.emptyText}>Nenhum método de pagamento autorizado está disponível.</Text>
            </Card>
          ) : (
            methods.map((method) => {
              const selected = method.id === methodId;
              return (
                <Pressable
                  key={method.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected, disabled: !method.enabled }}
                  disabled={!method.enabled}
                  onPress={() => setMethodId(method.id)}
                >
                  <Card style={[styles.methodCard, selected && styles.selectedMethod]}>
                    <View style={styles.methodCopy}>
                      <Text style={styles.methodTitle}>{method.label}</Text>
                      <Text style={styles.methodDescription}>{method.description}</Text>
                    </View>
                    <Badge
                      label={method.enabled ? (selected ? 'Selecionado' : 'Disponível') : 'Bloqueado'}
                      tone={selected ? 'brand' : 'neutral'}
                    />
                  </Card>
                </Pressable>
              );
            })
          )}
        </View>

        <Button
          label={actionLabel}
          fullWidth
          disabled={!canSubmit}
          onPress={() => {
            if (amountMinor !== null && selectedMethod) onConfirm?.(amountMinor, selectedMethod.id);
          }}
        />

        <Text style={styles.footer}>
          Nenhum valor é creditado ou debitado pelo aplicativo. A operação só existe após validação e commit autoritativo do servidor.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: darkTheme.colors.background.app },
  content: {
    padding: darkTheme.spacing.lg,
    paddingBottom: darkTheme.spacing['4xl'],
    gap: darkTheme.spacing.xl,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: darkTheme.spacing.md },
  headerCopy: { flex: 1, gap: darkTheme.spacing.sm },
  eyebrow: {
    ...darkTheme.typography.labelSmall,
    color: darkTheme.colors.brand.primary,
    letterSpacing: 1.3,
  },
  title: { ...darkTheme.typography.heading1, color: darkTheme.colors.text.primary },
  subtitle: { ...darkTheme.typography.bodyLarge, color: darkTheme.colors.text.secondary },
  noticeCard: { gap: darkTheme.spacing.md },
  noticeText: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  card: { gap: darkTheme.spacing.md },
  currency: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.secondary },
  section: { gap: darkTheme.spacing.md },
  sectionTitle: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  methodCard: { flexDirection: 'row', alignItems: 'center', gap: darkTheme.spacing.md },
  selectedMethod: { borderColor: darkTheme.colors.brand.primary },
  methodCopy: { flex: 1, gap: darkTheme.spacing.xs },
  methodTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  methodDescription: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  emptyText: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  footer: {
    ...darkTheme.typography.caption,
    textAlign: 'center',
    color: darkTheme.colors.text.disabled,
  },
});
