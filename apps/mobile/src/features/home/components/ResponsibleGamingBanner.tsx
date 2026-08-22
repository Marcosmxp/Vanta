import { StyleSheet, Text, View } from 'react-native';

import { Badge, Card, darkTheme } from '../../../design-system';

export function ResponsibleGamingBanner() {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Badge label="Jogo responsável" tone="neutral" />
        <View style={styles.indicator} />
      </View>
      <Text style={styles.title}>Jogue com controlo.</Text>
      <Text style={styles.description}>
        O Vanta terá limites de depósito, perda e sessão, além de ferramentas de pausa e autoexclusão. Essas restrições serão aplicadas no servidor e não poderão ser contornadas pelo app.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: darkTheme.spacing.sm,
    borderColor: darkTheme.colors.border.strong,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: darkTheme.radius.full,
    backgroundColor: darkTheme.colors.status.success,
  },
  title: {
    ...darkTheme.typography.heading3,
    color: darkTheme.colors.text.primary,
  },
  description: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
  },
});
