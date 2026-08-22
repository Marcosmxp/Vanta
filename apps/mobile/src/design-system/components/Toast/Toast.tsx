import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { darkTheme } from '../../theme';

export type ToastTone = 'neutral' | 'success' | 'warning' | 'danger';

export interface ToastProps {
  title: string;
  message?: string;
  tone?: ToastTone;
  actionLabel?: string;
  onAction?: () => void;
}

const indicatorColor: Record<ToastTone, string> = {
  neutral: darkTheme.colors.brand.primary,
  success: darkTheme.colors.status.success,
  warning: darkTheme.colors.status.warning,
  danger: darkTheme.colors.status.danger,
};

export function Toast({ title, message, tone = 'neutral', actionLabel, onAction }: ToastProps) {
  return (
    <View accessibilityLiveRegion="polite" style={styles.container}>
      <View style={[styles.indicator, { backgroundColor: indicatorColor[tone] }]} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} hitSlop={8}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.md,
    borderRadius: darkTheme.radius.lg,
    borderWidth: 1,
    borderColor: darkTheme.colors.border.default,
    backgroundColor: darkTheme.colors.surface.raised,
    padding: darkTheme.spacing.lg,
    ...darkTheme.shadows.card,
  },
  indicator: { width: 4, alignSelf: 'stretch', borderRadius: darkTheme.radius.full },
  content: { flex: 1, gap: darkTheme.spacing.xs },
  title: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  message: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  action: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary },
});
