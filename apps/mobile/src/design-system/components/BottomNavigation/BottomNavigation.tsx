import React, { type ReactNode, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { darkTheme } from '../../theme';

export interface BottomNavigationItem {
  key: string;
  label: string;
  icon?: ReactNode | ((selected: boolean) => ReactNode);
  emphasized?: boolean;
}

export interface BottomNavigationProps {
  items: readonly BottomNavigationItem[];
  value: string;
  onChange: (key: string) => void;
}

function NavigationItem({
  item,
  selected,
  reduceMotion,
  onPress,
}: {
  item: BottomNavigationItem;
  selected: boolean;
  reduceMotion: boolean;
  onPress: () => void;
}) {
  const progress = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(selected ? 1 : 0);
      return;
    }
    Animated.timing(progress, {
      toValue: selected ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [progress, reduceMotion, selected]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -2] });
  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] });
  const icon = typeof item.icon === 'function' ? item.icon(selected) : item.icon;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      <Animated.View style={[styles.itemContent, { transform: [{ translateY }, { scale }] }]}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <Text style={[styles.label, selected && styles.selectedLabel]}>{item.label}</Text>
        <View style={[styles.activeIndicator, selected && styles.activeIndicatorVisible]} />
      </Animated.View>
    </Pressable>
  );
}

export function BottomNavigation({ items, value, onChange }: BottomNavigationProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container} accessibilityRole="tablist">
      {items.map((item) => (
        <NavigationItem
          key={item.key}
          item={item}
          selected={item.key === value}
          reduceMotion={reduceMotion}
          onPress={() => onChange(item.key)}
        />
      ))}
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
    paddingTop: darkTheme.spacing.sm,
    paddingBottom: darkTheme.spacing.xs,
    gap: darkTheme.spacing.xs,
  },
  item: {
    flex: 1,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: darkTheme.radius.md,
  },
  itemContent: { alignItems: 'center', justifyContent: 'center', gap: 3 },
  pressed: { opacity: 0.68 },
  icon: { height: 20, alignItems: 'center', justifyContent: 'center' },
  label: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.text.secondary },
  selectedLabel: { color: darkTheme.colors.text.primary },
  activeIndicator: {
    width: 18,
    height: 2,
    borderRadius: darkTheme.radius.full,
    backgroundColor: 'transparent',
  },
  activeIndicatorVisible: { backgroundColor: darkTheme.colors.brand.primary },
});
