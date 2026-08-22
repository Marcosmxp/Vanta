import React, { type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { darkTheme } from '../../theme';

export interface CardProps {
  children: ReactNode;
  elevated?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Card({
  children,
  elevated = false,
  onPress,
  style,
  accessibilityLabel,
}: CardProps) {
  const cardStyle = [styles.card, elevated && darkTheme.shadows.card, style];

  if (onPress) {
    return (
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: darkTheme.radius.lg,
    borderWidth: 1,
    borderColor: darkTheme.colors.border.default,
    backgroundColor: darkTheme.colors.surface.default,
    padding: darkTheme.spacing.lg,
  },
  pressed: {
    backgroundColor: darkTheme.colors.surface.raised,
  },
});
