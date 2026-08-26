import { StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../../../core/i18n';
import { Button, Card, darkTheme } from '../../../design-system';

export interface WalletActionsCardProps {
  onDeposit: () => void;
  onWithdraw: () => void;
}

export function WalletActionsCard({ onDeposit, onWithdraw }: WalletActionsCardProps) {
  const { t } = useI18n();
  return (
    <Card style={styles.card}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>{t('wallet.actionsEyebrow')}</Text>
        <Text style={styles.title}>{t('wallet.actionsTitle')}</Text>
        <Text style={styles.description}>{t('wallet.actionsDescription')}</Text>
      </View>
      <View style={styles.actions}>
        <Button label={t('wallet.deposit')} fullWidth onPress={onDeposit} />
        <Button label={t('wallet.withdraw')} variant="secondary" fullWidth onPress={onWithdraw} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: darkTheme.spacing.lg },
  copy: { gap: darkTheme.spacing.sm },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.2 },
  title: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  description: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  actions: { gap: darkTheme.spacing.sm },
});
