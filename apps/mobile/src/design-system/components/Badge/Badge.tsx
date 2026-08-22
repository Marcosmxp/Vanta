import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { darkTheme } from '../../theme';

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

const toneStyles: Record<BadgeTone, { backgroundColor: string; color: string }> = {
  neutral: {
    backgroundColor: darkTheme.colors.surface.interactive,
    color: darkTheme.colors.text.primary,
  },
  brand: {
    backgroundColor: darkTheme.colors.brand.strong,
    color: darkTheme.colors.text.onBrand,
  },
  success: {
    backgroundColor: 'rgba(41, 209, 125, 0.16)',
    color: darkTheme.colors.status.success,
  },
  warning: {
    backgroundColor: 'rgba(255, 176, 32, 0.16)',
    color: darkTheme.colors.status.warning,
  },
  danger: {
    backgroundColor: 'rgba(255, 77, 90, 0.16)',
    color: darkTheme.colors.status.danger,
  },
};

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const toneStyle = toneStyles[tone];

  return (
    <View style={[styles.badge, { backgroundColor: toneStyle.backgroundColor }]}>
      <Text style={[styles.label, { color: toneStyle.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: darkTheme.radius.full,
    paddingHorizontal: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.xs,
  },
  label: {
    ...darkTheme.typography.labelSmall,
  },
});
