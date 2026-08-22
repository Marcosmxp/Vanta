import React, { type ReactNode, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { darkTheme } from '../../theme';

export interface InputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export function Input({
  label,
  helperText,
  errorMessage,
  leading,
  trailing,
  editable = true,
  onFocus,
  onBlur,
  ...textInputProps
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(errorMessage);

  const borderColor = hasError
    ? darkTheme.colors.status.danger
    : focused
      ? darkTheme.colors.brand.primary
      : darkTheme.colors.border.default;

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, { borderColor, opacity: editable ? 1 : 0.5 }]}>
        {leading ? <View style={styles.affix}>{leading}</View> : null}
        <TextInput
          accessibilityState={{ disabled: !editable }}
          editable={editable}
          placeholderTextColor={darkTheme.colors.text.disabled}
          selectionColor={darkTheme.colors.brand.primary}
          style={styles.input}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...textInputProps}
        />
        {trailing ? <View style={styles.affix}>{trailing}</View> : null}
      </View>
      {errorMessage ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {errorMessage}
        </Text>
      ) : helperText ? (
        <Text style={styles.helper}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: darkTheme.spacing.sm,
  },
  label: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.text.primary,
  },
  field: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: darkTheme.radius.md,
    backgroundColor: darkTheme.colors.surface.default,
    paddingHorizontal: darkTheme.spacing.md,
  },
  input: {
    flex: 1,
    color: darkTheme.colors.text.primary,
    ...darkTheme.typography.bodyLarge,
    paddingVertical: darkTheme.spacing.sm,
  },
  affix: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  helper: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
  error: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.status.danger,
  },
});
