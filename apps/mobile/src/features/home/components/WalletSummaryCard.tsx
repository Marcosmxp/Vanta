import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatCurrencyMinor, useI18n } from '../../../core/i18n';
import { Button, Card, darkTheme } from '../../../design-system';
import type { HomeWalletSummary } from '../types';

export interface WalletSummaryCardProps {
  wallet: HomeWalletSummary;
  onOpenWallet: () => void;
}

export function WalletSummaryCard({ wallet, onOpenWallet }: WalletSummaryCardProps) {
  const { locale, t } = useI18n();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const balanceAmount = wallet.availableBalanceMinor;
  const hasBalance = wallet.availability === 'ready' && balanceAmount !== null;
  const balanceLabel = !hasBalance
    ? '—'
    : balanceVisible && balanceAmount !== null
      ? formatCurrencyMinor(balanceAmount, wallet.currency, locale)
      : '••••••';

  const helper = hasBalance
    ? t('home.walletReadyHelper')
    : wallet.availability === 'restricted'
      ? t('home.walletRestrictedHelper')
      : t('home.walletUnavailableHelper');

  return (
    <Card elevated style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>{t('home.walletEyebrow')}</Text>
          <Text style={styles.label}>{t('home.walletAvailable')}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={balanceVisible ? t('wallet.balanceHideAccessibility') : t('wallet.balanceShowAccessibility')}
          disabled={!hasBalance}
          onPress={() => setBalanceVisible((current) => !current)}
          style={({ pressed }) => [styles.visibilityButton, pressed && styles.pressed, !hasBalance && styles.disabled]}
        >
          <Text style={styles.visibilityText}>{balanceVisible ? t('home.walletHide') : t('home.walletShow')}</Text>
        </Pressable>
      </View>

      <Text accessibilityLabel={t('wallet.balanceAccessibility')} style={styles.balance}>{balanceLabel}</Text>
      <Text style={styles.helper}>{helper}</Text>
      <Button label={t('home.walletOpen')} variant="secondary" fullWidth onPress={onOpenWallet} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: darkTheme.spacing.lg, backgroundColor: darkTheme.colors.surface.raised },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  headerText: { flex: 1, gap: darkTheme.spacing.xs },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.4 },
  label: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  visibilityButton: {
    paddingHorizontal: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.sm,
    borderRadius: darkTheme.radius.full,
    backgroundColor: darkTheme.colors.surface.interactive,
  },
  visibilityText: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.text.primary },
  balance: { ...darkTheme.typography.display, color: darkTheme.colors.text.primary },
  helper: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.45 },
});
