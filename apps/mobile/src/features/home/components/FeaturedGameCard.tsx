import { StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../../../core/i18n';
import { Badge, Button, Card, darkTheme } from '../../../design-system';
import type { HomeFeaturedGame } from '../types';

export interface FeaturedGameCardProps {
  game: HomeFeaturedGame;
  onPlay: () => void;
}

const pegRows = [3, 4, 5, 6, 7] as const;

export function FeaturedGameCard({ game, onPlay }: FeaturedGameCardProps) {
  const { t } = useI18n();

  return (
    <Card elevated style={styles.card}>
      <View style={styles.copy}>
        <Badge label={t('home.featuredOriginal')} tone="brand" />
        <Text style={styles.title}>{game.title || 'Plinko'}</Text>
        <Text style={styles.description}>{t('home.featuredDescription')}</Text>
      </View>

      <View accessibilityLabel={t('home.featuredPreview')} style={styles.board}>
        <View style={styles.ball} />
        {pegRows.map((count, rowIndex) => (
          <View key={count} style={styles.pegRow}>
            {Array.from({ length: count }).map((_, pegIndex) => (
              <View key={`${rowIndex}-${pegIndex}`} style={styles.peg} />
            ))}
          </View>
        ))}
        <View style={styles.multiplierRow}>
          {['4×', '2×', '1×', '2×', '4×'].map((value, index) => (
            <View key={`${value}-${index}`} style={styles.multiplier}>
              <Text style={styles.multiplierText}>{value}</Text>
            </View>
          ))}
        </View>
      </View>

      <Button label={t('home.featuredOpen')} fullWidth onPress={onPlay} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: darkTheme.spacing.xl,
    overflow: 'hidden',
    backgroundColor: darkTheme.colors.background.deep,
    borderColor: darkTheme.colors.brand.strong,
  },
  copy: { gap: darkTheme.spacing.sm },
  title: { ...darkTheme.typography.heading1, color: darkTheme.colors.text.primary },
  description: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  board: {
    minHeight: 218,
    alignItems: 'center',
    justifyContent: 'center',
    gap: darkTheme.spacing.sm,
    padding: darkTheme.spacing.lg,
    borderRadius: darkTheme.radius.lg,
    borderWidth: 1,
    borderColor: darkTheme.colors.border.default,
    backgroundColor: darkTheme.colors.background.app,
  },
  ball: { width: 16, height: 16, borderRadius: darkTheme.radius.full, backgroundColor: darkTheme.colors.brand.primary, ...darkTheme.shadows.brandGlow },
  pegRow: { flexDirection: 'row', justifyContent: 'center', gap: darkTheme.spacing.lg },
  peg: { width: 6, height: 6, borderRadius: darkTheme.radius.full, backgroundColor: darkTheme.colors.text.disabled },
  multiplierRow: { marginTop: darkTheme.spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: darkTheme.spacing.xs },
  multiplier: {
    minWidth: 40,
    alignItems: 'center',
    paddingHorizontal: darkTheme.spacing.sm,
    paddingVertical: darkTheme.spacing.sm,
    borderRadius: darkTheme.radius.sm,
    backgroundColor: darkTheme.colors.surface.interactive,
  },
  multiplierText: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.text.primary },
});
