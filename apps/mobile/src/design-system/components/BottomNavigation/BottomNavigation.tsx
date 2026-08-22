import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { darkTheme } from '../../theme';

export interface BottomNavigationItem {
  key: string;
  label: string;
  icon?: ReactNode;
  emphasized?: boolean;
}

export interface BottomNavigationProps {
  items: readonly BottomNavigationItem[];
  value: string;
  onChange: (key: string) => void;
}

export function BottomNavigation({ items, value, onChange }: BottomNavigationProps) {
  return (
    <View style={styles.container} accessibilityRole="tablist">
      {items.map((item) => {
        const selected = item.key === value;
        const emphasized = Boolean(item.emphasized);
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(item.key)}
            style={({ pressed }) => [
              styles.item,
              emphasized && styles.emphasized,
              selected && !emphasized && styles.selectedItem,
              pressed && styles.pressed,
            ]}
          >
            {item.icon ? <View style={styles.icon}>{item.icon}</View> : null}
            <Text
              style={[
                styles.label,
                selected && styles.selectedLabel,
                emphasized && styles.emphasizedLabel,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border.default,
    backgroundColor: darkTheme.colors.surface.default,
    paddingHorizontal: darkTheme.spacing.sm,
    paddingVertical: darkTheme.spacing.sm,
    gap: darkTheme.spacing.xs,
  },
  item: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: darkTheme.spacing.xs,
    borderRadius: darkTheme.radius.md,
  },
  selectedItem: { backgroundColor: darkTheme.colors.surface.raised },
  emphasized: { backgroundColor: darkTheme.colors.brand.primary },
  pressed: { opacity: 0.75 },
  icon: { minHeight: 18, justifyContent: 'center' },
  label: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.text.secondary },
  selectedLabel: { color: darkTheme.colors.text.primary },
  emphasizedLabel: { color: darkTheme.colors.text.onBrand },
});
