import { StyleSheet, Text, View } from 'react-native';

import { Button, Card, darkTheme } from '../../../design-system';

export interface WalletActionsCardProps {
  onDeposit: () => void;
  onWithdraw: () => void;
}

export function WalletActionsCard({ onDeposit, onWithdraw }: WalletActionsCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>MOVIMENTAR FUNDOS</Text>
        <Text style={styles.title}>Depósitos e levantamentos</Text>
        <Text style={styles.description}>
          Pode consultar e preencher os fluxos financeiros. A confirmação permanece bloqueada quando o backend não autorizar métodos, limites ou elegibilidade.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button label="Depositar" fullWidth onPress={onDeposit} />
        <Button label="Levantar" variant="secondary" fullWidth onPress={onWithdraw} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: darkTheme.spacing.lg,
  },
  copy: {
    gap: darkTheme.spacing.sm,
  },
  eyebrow: {
    ...darkTheme.typography.labelSmall,
    color: darkTheme.colors.brand.primary,
    letterSpacing: 1.2,
  },
  title: {
    ...darkTheme.typography.heading3,
    color: darkTheme.colors.text.primary,
  },
  description: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
  },
  actions: {
    gap: darkTheme.spacing.sm,
  },
});
