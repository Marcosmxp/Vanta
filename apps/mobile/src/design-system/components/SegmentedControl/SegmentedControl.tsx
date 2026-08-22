import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { darkTheme } from '../../theme';

export interface SegmentOption {
  value: string;
  label: string;
}

export interface SegmentedControlProps {
  options: readonly SegmentOption[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <View style={styles.container} accessibilityRole="radiogroup">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.segment,
              selected && styles.selected,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.label, selected && styles.selectedLabel]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: darkTheme.radius.md,
    backgroundColor: darkTheme.colors.surface.default,
    padding: darkTheme.spacing.xs,
    gap: darkTheme.spacing.xs,
  },
  segment: {
    flex: 1,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: darkTheme.radius.sm,
    paddingHorizontal: darkTheme.spacing.sm,
  },
  selected: { backgroundColor: darkTheme.colors.surface.interactive },
  pressed: { opacity: 0.75 },
  label: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.secondary },
  selectedLabel: { color: darkTheme.colors.text.primary },
});
