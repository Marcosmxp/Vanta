import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../../../core/i18n';
import { Card, darkTheme } from '../../../design-system';

export type ProfileDestination = 'security' | 'responsible-gaming' | 'support' | 'legal';

export interface ProfileMenuCardProps {
  onOpenDestination: (destination: ProfileDestination) => void;
}

export function ProfileMenuCard({ onOpenDestination }: ProfileMenuCardProps) {
  const { t } = useI18n();
  const items: readonly { destination: ProfileDestination; title: string; description: string }[] = [
    {
      destination: 'security',
      title: t('profile.menu.securityTitle'),
      description: t('profile.menu.securityDescription'),
    },
    {
      destination: 'responsible-gaming',
      title: t('profile.menu.rgTitle'),
      description: t('profile.menu.rgDescription'),
    },
    {
      destination: 'support',
      title: t('profile.menu.supportTitle'),
      description: t('profile.menu.supportDescription'),
    },
    {
      destination: 'legal',
      title: t('profile.menu.legalTitle'),
      description: t('profile.menu.legalDescription'),
    },
  ];

  return (
    <Card style={styles.card}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>{t('profile.menuEyebrow')}</Text>
        <Text style={styles.title}>{t('profile.menuTitle')}</Text>
      </View>

      <View style={styles.list}>
        {items.map((item) => (
          <Pressable
            key={item.destination}
            accessibilityRole="button"
            accessibilityLabel={item.title}
            onPress={() => onOpenDestination(item.destination)}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowDescription}>{item.description}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: darkTheme.spacing.lg },
  copy: { gap: darkTheme.spacing.xs },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.2 },
  title: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  list: { gap: darkTheme.spacing.xs },
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border.default,
  },
  pressed: { opacity: 0.7 },
  rowCopy: { flex: 1, gap: darkTheme.spacing.xs },
  rowTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  rowDescription: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  chevron: { ...darkTheme.typography.heading3, color: darkTheme.colors.brand.primary },
});
