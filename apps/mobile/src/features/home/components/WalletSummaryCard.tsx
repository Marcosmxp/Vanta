import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Card, darkTheme } from '../../../design-system';
import type { HomeWalletSummary } from '../types';

export interface WalletSummaryCardProps {
  wallet: HomeWalletSummary;
  onOpenWallet: () => void;
}

function formatMinorAmount(amountMinor: number, currency: 'EUR') {
  const major = amountMinor / 100;
  return `${major.toFixed(2).replace('.', ',')} ${currency === 'EUR' ? '€' : currency}`;
}

export function WalletSummaryCard({ wallet, onOpenWallet }: WalletSummaryCardProps) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const hasBalance = wallet.availability === 'ready' && wallet.availableBalanceMinor !== null;

  const balanceLabel = !hasBalance
    ? '—'
    : balanceVisible
      ? formatMinorAmount(wallet.availableBalanceMinor, wallet.currency)
      : '••••••';

  return (
    <Card elevated style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>CARTEIRA</Text>
          <Text style={styles.label}>Saldo disponível</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={balanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'}
          disabled={!hasBalance}
          onPress={() => setBalanceVisible((current) => !current)}
          style={({ pressed }) => [styles.visibilityButton, pressed && styles.pressed]}
        >
          <Text style={styles.visibilityText}>{balanceVisible ? 'Ocultar' : 'Mostrar'}</Text>
        </Pressable>
      </View>

      <Text accessibilityLabel="Saldo disponível" style={styles.balance}>
        {balanceLabel}
      </Text>

      <Text style={styles.helper}>
        {wallet.availability === 'ready'
          ? 'Valor apresentado a partir do estado recebido do servidor.'
          : wallet.availability === 'restricted'
            ? 'Carteira temporariamente indisponível devido ao estado da conta.'
            : 'O saldo aparecerá quando a carteira autenticada estiver ligada à API.'}
      </Text>

      <Button label="Ver carteira" variant="secondary" fullWidth onPress={onOpenWallet} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: darkTheme.spacing.lg,
    backgroundColor: darkTheme.colors.surface.raised,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.md,
  },
  headerText: {
    flex: 1,
    gap: darkTheme.spacing.xs,
  },
  eyebrow: {
    ...darkTheme.typography.labelSmall,
    color: darkTheme.colors.brand.primary,
    letterSpacing: 1.4,
  },
  label: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
  },
  visibilityButton: {
    paddingHorizontal: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.sm,
    borderRadius: darkTheme.radius.full,
    backgroundColor: darkTheme.colors.surface.interactive,
  },
  visibilityText: {
    ...darkTheme.typography.labelSmall,
    color: darkTheme.colors.text.primary,
  },
  balance: {
    ...darkTheme.typography.display,
    color: darkTheme.colors.text.primary,
  },
  helper: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
  pressed: {
    opacity: 0.75,
  },
});
