import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { darkTheme } from '../../../../design-system';

export interface MultiplierRowProps {
  rows: number;
  multipliersBps?: readonly number[] | null;
  activeSlot?: number | null;
}

function formatMultiplier(multiplierBps: number | undefined) {
  if (multiplierBps === undefined) {
    return '—';
  }
  const multiplier = multiplierBps / 10_000;
  return `${Number.isInteger(multiplier) ? multiplier.toFixed(0) : multiplier.toFixed(2)}x`;
}

export function MultiplierRow({
  rows,
  multipliersBps = null,
  activeSlot = null,
}: MultiplierRowProps) {
  const slots = Array.from({ length: rows + 1 }, (_, slot) => slot);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      accessibilityLabel="Multiplicadores Plinko"
    >
      {slots.map((slot) => {
        const active = slot === activeSlot;
        return (
          <View key={slot} style={[styles.slot, active && styles.activeSlot]}>
            <Text style={[styles.label, active && styles.activeLabel]}>
              {formatMultiplier(multipliersBps?.[slot])}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: darkTheme.spacing.xs,
    paddingHorizontal: darkTheme.spacing.xs,
  },
  slot: {
    minWidth: 48,
    minHeight: 34,
    paddingHorizontal: darkTheme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: darkTheme.radius.sm,
    backgroundColor: darkTheme.colors.surface.default,
    borderWidth: 1,
    borderColor: darkTheme.colors.border.default,
  },
  activeSlot: {
    backgroundColor: darkTheme.colors.brand.primary,
    borderColor: darkTheme.colors.brand.primary,
  },
  label: {
    ...darkTheme.typography.labelSmall,
    color: darkTheme.colors.text.secondary,
  },
  activeLabel: {
    color: darkTheme.colors.text.onBrand,
  },
});
