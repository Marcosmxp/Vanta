import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatCurrencyMinor, useI18n } from '../../../core/i18n';
import { Badge, Card, darkTheme } from '../../../design-system';
import type { WalletBalanceReadModel } from '../types';

export interface WalletBalanceCardProps {
  balance: WalletBalanceReadModel;
}

export function WalletBalanceCard({ balance }: WalletBalanceCardProps) {
  const { locale, t } = useI18n();
  const [visible, setVisible] = useState(true);
  const ready = balance.availability === 'ready';
  const canReveal = ready && balance.availableBalanceMinor !== null;
  const amount = (value: number | null) => value === null ? '—' : visible ? formatCurrencyMinor(value, balance.currency, locale) : '••••••';

  const status = balance.availability === 'ready'
    ? { label: t('wallet.balanceAvailable'), tone: 'success' as const }
    : balance.availability === 'restricted'
      ? { label: t('wallet.balanceRestricted'), tone: 'warning' as const }
      : { label: t('wallet.balanceUnavailable'), tone: 'neutral' as const };

  return (
    <Card elevated style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>{t('wallet.balanceEyebrow')}</Text>
          <Text style={styles.label}>{t('wallet.balanceLabel')}</Text>
        </View>
        <Badge label={status.label} tone={status.tone} />
      </View>

      <Text accessibilityLabel={t('wallet.balanceAccessibility')} style={styles.primaryAmount}>{amount(balance.availableBalanceMinor)}</Text>

      <View style={styles.breakdown}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>{t('wallet.balanceReserved')}</Text>
          <Text style={styles.metricValue}>{amount(balance.reservedBalanceMinor)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>{t('wallet.balanceTotal')}</Text>
          <Text style={styles.metricValue}>{amount(balance.totalBalanceMinor)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.asOf}>{balance.asOf ? `${t('wallet.balanceUpdated')}: ${balance.asOf}` : t('wallet.balanceWaiting')}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={visible ? t('wallet.balanceHideAccessibility') : t('wallet.balanceShowAccessibility')}
          accessibilityState={{ disabled: !canReveal }}
          disabled={!canReveal}
          onPress={() => setVisible((current) => !current)}
          style={({ pressed }) => [styles.visibilityButton, pressed && styles.pressed, !canReveal && styles.disabled]}
        >
          <Text style={styles.visibilityLabel}>{visible ? t('wallet.balanceHide') : t('wallet.balanceShow')}</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: darkTheme.spacing.lg, backgroundColor: darkTheme.colors.surface.raised },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  headerCopy: { flex: 1, gap: darkTheme.spacing.xs },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.3 },
  label: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  primaryAmount: { ...darkTheme.typography.display, color: darkTheme.colors.text.primary },
  breakdown: { flexDirection: 'row', gap: darkTheme.spacing.lg, paddingTop: darkTheme.spacing.sm },
  metric: { flex: 1, gap: darkTheme.spacing.xs },
  metricLabel: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  metricValue: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  divider: { width: 1, backgroundColor: darkTheme.colors.border.default },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  asOf: { flex: 1, ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled },
  visibilityButton: { borderRadius: darkTheme.radius.full, backgroundColor: darkTheme.colors.surface.interactive, paddingHorizontal: darkTheme.spacing.md, paddingVertical: darkTheme.spacing.sm },
  visibilityLabel: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.text.primary },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.5 },
});
