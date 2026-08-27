import { StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../../../core/i18n';
import { Badge, Card, darkTheme } from '../../../design-system';

export function ResponsibleGamingBanner() {
  const { t } = useI18n();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Badge label={t('home.rgBadge')} tone="neutral" />
        <View style={styles.indicator} />
      </View>
      <Text style={styles.title}>{t('home.rgTitle')}</Text>
      <Text style={styles.description}>{t('home.rgDescription')}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: darkTheme.spacing.sm, borderColor: darkTheme.colors.border.strong },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  indicator: { width: 8, height: 8, borderRadius: darkTheme.radius.full, backgroundColor: darkTheme.colors.status.success },
  title: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  description: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
});
