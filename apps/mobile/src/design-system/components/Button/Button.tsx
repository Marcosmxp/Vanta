import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { darkTheme } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const backgroundByVariant: Record<ButtonVariant, string> = {
  primary: darkTheme.colors.brand.primary,
  secondary: darkTheme.colors.surface.interactive,
  ghost: 'transparent',
  danger: darkTheme.colors.status.danger,
};

const pressedBackgroundByVariant: Record<ButtonVariant, string> = {
  primary: darkTheme.colors.brand.pressed,
  secondary: darkTheme.colors.border.strong,
  ghost: darkTheme.colors.surface.default,
  danger: darkTheme.colors.brand.strong,
};

const textByVariant: Record<ButtonVariant, string> = {
  primary: darkTheme.colors.text.onBrand,
  secondary: darkTheme.colors.text.primary,
  ghost: darkTheme.colors.text.primary,
  danger: darkTheme.colors.text.onBrand,
};

export function Button({
  label,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  disabled = false,
  style,
  ...pressableProps
}: ButtonProps) {
  const unavailable = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: unavailable, busy: loading }}
      disabled={unavailable}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        {
          backgroundColor: pressed
            ? pressedBackgroundByVariant[variant]
            : backgroundByVariant[variant],
          opacity: unavailable ? 0.5 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator color={textByVariant[variant]} />
      ) : (
        <Text style={[styles.label, { color: textByVariant[variant] }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: darkTheme.radius.md,
    minWidth: 96,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  label: {
    ...darkTheme.typography.labelLarge,
  },
});

const sizeStyles = StyleSheet.create({
  small: {
    minHeight: 36,
    paddingHorizontal: darkTheme.spacing.md,
  },
  medium: {
    minHeight: 44,
    paddingHorizontal: darkTheme.spacing.lg,
  },
  large: {
    minHeight: 52,
    paddingHorizontal: darkTheme.spacing.xl,
  },
});
