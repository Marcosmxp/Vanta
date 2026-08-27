import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../../../core/i18n';
import { Card, darkTheme } from '../../../design-system';

export type ResponsibleGamingDestination = 'limits' | 'time-out' | 'self-exclusion';

export interface ResponsibleGamingActionCardProps {
  onOpenDestination: (destination: ResponsibleGamingDestination) => void;
}

export function ResponsibleGamingActionCard({ onOpenDestination }: ResponsibleGamingActionCardProps) {
  const { t } = useI18n();
  const actions: readonly { destination: ResponsibleGamingDestination; title: string; description: string }[] = [
    { destination: 'limits', title: t('rg.limitsTitle'), description: t('rg.limitsDescription') },
    { destination: 'time-out', title: t('rg.timeoutTitle'), description: t('rg.timeoutDescription') },
    { destination: 'self-exclusion', title: t('rg.selfExclusionTitle'), description: t('rg.selfExclusionDescription') },
  ];

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{t('rg.actionsTitle')}</Text>
      <View style={styles.list}>
        {actions.map((action) => (
          <Pressable
            key={action.destination}
            accessibilityRole="button"
            accessibilityLabel={action.title}
            onPress={() => onOpenDestination(action.destination)}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <View style={styles.copy}>
              <Text style={styles.rowTitle}>{action.title}</Text>
              <Text style={styles.description}>{action.description}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: darkTheme.spacing.md },
  title: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  list: { gap: darkTheme.spacing.xs },
  row: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border.default,
    paddingVertical: darkTheme.spacing.md,
  },
  rowPressed: { opacity: 0.7 },
  copy: { flex: 1, gap: darkTheme.spacing.xs },
  rowTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  description: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  chevron: { ...darkTheme.typography.heading3, color: darkTheme.colors.brand.primary },
});
