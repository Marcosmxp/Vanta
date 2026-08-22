import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge, Card, darkTheme } from '../../../design-system';
import type { WalletBalanceReadModel } from '../types';
import { formatWalletAmount } from '../utils/formatting';

export interface WalletBalanceCardProps {
  balance: WalletBalanceReadModel;
}

function amountOrPlaceholder(amountMinor: number | null, currency: 'EUR', visible: boolean) {
  if (amountMinor === null) return '—';
  if (!visible) return '••••••';
  return formatWalletAmount(amountMinor, currency);
}

export function WalletBalanceCard({ balance }: WalletBalanceCardProps) {
  const [visible, setVisible] = useState(true);
  const ready = balance.availability === 'ready';
  const canReveal = ready && balance.availableBalanceMinor !== null;

  const status =
    balance.availability === 'ready'
      ? { label: 'Disponível', tone: 'success' as const }
      : balance.availability === 'restricted'
        ? { label: 'Restrita', tone: 'warning' as const }
        : { label: 'Indisponível', tone: 'neutral' as const };

  return (
    <Card elevated style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>SALDO</Text>
          <Text style={styles.label}>Disponível para utilização</Text>
        </View>
        <Badge label={status.label} tone={status.tone} />
      </View>

      <Text accessibilityLabel="Saldo disponível" style={styles.primaryAmount}>
        {amountOrPlaceholder(balance.availableBalanceMinor, balance.currency, visible)}
      </Text>

      <View style={styles.breakdown}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Reservado</Text>
          <Text style={styles.metricValue}>
            {amountOrPlaceholder(balance.reservedBalanceMinor, balance.currency, visible)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Total contabilizado</Text>
          <Text style={styles.metricValue}>
            {amountOrPlaceholder(balance.totalBalanceMinor, balance.currency, visible)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.asOf}>
          {balance.asOf ? `Atualizado: ${balance.asOf}` : 'Aguardando estado financeiro autenticado'}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Ocultar saldos' : 'Mostrar saldos'}
          accessibilityState={{ disabled: !canReveal }}
          disabled={!canReveal}
          onPress={() => setVisible((current) => !current)}
          style={({ pressed }) => [styles.visibilityButton, pressed && styles.pressed, !canReveal && styles.disabled]}
        >
          <Text style={styles.visibilityLabel}>{visible ? 'Ocultar' : 'Mostrar'}</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: darkTheme.spacing.lg,
    backgroundColor: darkTheme.colors.surface.raised,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: darkTheme.spacing.xs,
  },
  eyebrow: {
    ...darkTheme.typography.labelSmall,
    color: darkTheme.colors.brand.primary,
    letterSpacing: 1.3,
  },
  label: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
  },
  primaryAmount: {
    ...darkTheme.typography.display,
    color: darkTheme.colors.text.primary,
  },
  breakdown: {
    flexDirection: 'row',
    gap: darkTheme.spacing.lg,
    paddingTop: darkTheme.spacing.sm,
  },
  metric: {
    flex: 1,
    gap: darkTheme.spacing.xs,
  },
  metricLabel: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
  metricValue: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.text.primary,
  },
  divider: {
    width: 1,
    backgroundColor: darkTheme.colors.border.default,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.md,
  },
  asOf: {
    flex: 1,
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.disabled,
  },
  visibilityButton: {
    borderRadius: darkTheme.radius.full,
    backgroundColor: darkTheme.colors.surface.interactive,
    paddingHorizontal: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.sm,
  },
  visibilityLabel: {
    ...darkTheme.typography.labelSmall,
    color: darkTheme.colors.text.primary,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.5,
  },
});
