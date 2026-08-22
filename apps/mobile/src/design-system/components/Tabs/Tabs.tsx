import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { darkTheme } from '../../theme';

export interface TabItem {
  key: string;
  label: string;
  badge?: string;
}

export interface TabsProps {
  items: readonly TabItem[];
  value: string;
  onChange: (key: string) => void;
}

export function Tabs({ items, value, onChange }: TabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist"
    >
      {items.map((item) => {
        const selected = item.key === value;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(item.key)}
            style={({ pressed }) => [
              styles.tab,
              selected && styles.selectedTab,
              pressed && styles.pressedTab,
            ]}
          >
            <Text style={[styles.label, selected && styles.selectedLabel]}>{item.label}</Text>
            {item.badge ? (
              <View style={[styles.badge, selected && styles.selectedBadge]}>
                <Text style={[styles.badgeLabel, selected && styles.selectedBadgeLabel]}>{item.badge}</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: darkTheme.spacing.sm },
  tab: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    paddingHorizontal: darkTheme.spacing.sm,
  },
  selectedTab: { borderBottomColor: darkTheme.colors.brand.primary },
  pressedTab: { opacity: 0.72 },
  label: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.secondary },
  selectedLabel: { color: darkTheme.colors.text.primary },
  badge: {
    minWidth: 22,
    borderRadius: darkTheme.radius.full,
    backgroundColor: darkTheme.colors.surface.interactive,
    paddingHorizontal: darkTheme.spacing.sm,
    paddingVertical: darkTheme.spacing.xxs,
  },
  selectedBadge: { backgroundColor: darkTheme.colors.brand.strong },
  badgeLabel: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
    textAlign: 'center',
  },
  selectedBadgeLabel: { color: darkTheme.colors.text.onBrand },
});
