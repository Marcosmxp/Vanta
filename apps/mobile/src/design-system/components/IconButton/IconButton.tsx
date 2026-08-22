import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { darkTheme } from '../../theme';

export interface IconButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  accessibilityLabel: string;
  icon: ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'brand' | 'ghost';
}

export function IconButton({
  accessibilityLabel,
  icon,
  size = 'medium',
  variant = 'default',
  disabled = false,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        {
          backgroundColor: pressed
            ? pressedBackground[variant]
            : background[variant],
          opacity: disabled ? 0.45 : 1,
        },
      ]}
      {...props}
    >
      {icon}
    </Pressable>
  );
}

const background = {
  default: darkTheme.colors.surface.interactive,
  brand: darkTheme.colors.brand.primary,
  ghost: 'transparent',
} as const;

const pressedBackground = {
  default: darkTheme.colors.border.strong,
  brand: darkTheme.colors.brand.pressed,
  ghost: darkTheme.colors.surface.default,
} as const;

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: darkTheme.radius.full,
  },
});

const sizeStyles = StyleSheet.create({
  small: { width: 36, height: 36 },
  medium: { width: 44, height: 44 },
  large: { width: 52, height: 52 },
});
