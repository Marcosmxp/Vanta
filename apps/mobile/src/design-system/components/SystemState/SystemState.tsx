import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { darkTheme } from '../../theme';

export type SystemStateKind = 'loading' | 'empty' | 'offline' | 'error' | 'maintenance';

export interface SystemStateProps {
  kind: SystemStateKind;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

const stateSymbol: Record<Exclude<SystemStateKind, 'loading'>, string> = {
  empty: '—',
  offline: '⌁',
  error: '!',
  maintenance: '⋯',
};

export function SystemState({
  kind,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}: SystemStateProps) {
  return (
    <Card style={[styles.card, compact && styles.compactCard]}>
      <View
        accessibilityRole="summary"
        accessibilityLiveRegion={kind === 'loading' ? 'polite' : undefined}
        style={[styles.content, compact && styles.compactContent]}
      >
        <View style={[styles.indicator, compact && styles.compactIndicator]}>
          {kind === 'loading' ? (
            <ActivityIndicator color={darkTheme.colors.brand.primary} />
          ) : (
            <Text accessibilityElementsHidden style={styles.symbol}>
              {stateSymbol[kind]}
            </Text>
          )}
        </View>

        <View style={styles.copy}>
          <Text style={compact ? styles.compactTitle : styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>

      {actionLabel && onAction ? (
        <Button
          label={actionLabel}
          variant="secondary"
          size={compact ? 'small' : 'medium'}
          fullWidth={!compact}
          onPress={onAction}
        />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: darkTheme.spacing.lg,
    alignItems: 'stretch',
  },
  compactCard: {
    gap: darkTheme.spacing.md,
  },
  content: {
    alignItems: 'center',
    gap: darkTheme.spacing.lg,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.md,
  },
  indicator: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: darkTheme.radius.full,
    borderWidth: 1,
    borderColor: darkTheme.colors.border.strong,
    backgroundColor: darkTheme.colors.surface.raised,
  },
  compactIndicator: {
    width: 40,
    height: 40,
  },
  symbol: {
    ...darkTheme.typography.heading3,
    color: darkTheme.colors.brand.primary,
  },
  copy: {
    flex: 1,
    gap: darkTheme.spacing.xs,
  },
  title: {
    ...darkTheme.typography.heading3,
    color: darkTheme.colors.text.primary,
    textAlign: 'center',
  },
  compactTitle: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.text.primary,
  },
  description: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
    textAlign: 'center',
  },
});
