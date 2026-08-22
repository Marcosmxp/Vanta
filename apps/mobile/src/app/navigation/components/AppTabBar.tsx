import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  BottomNavigation,
  darkTheme,
  type BottomNavigationItem,
} from '../../../design-system';

const items = [
  { key: 'Home', label: 'Home' },
  { key: 'Play', label: 'Jogar', emphasized: true },
  { key: 'Wallet', label: 'Carteira' },
  { key: 'Profile', label: 'Perfil' },
] satisfies readonly BottomNavigationItem[];

export function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const activeRoute = state.routes[state.index];
  const value = activeRoute?.name ?? 'Home';

  function handleChange(key: string) {
    const route = state.routes.find((candidate) => candidate.name === key);
    if (!route) return;

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <BottomNavigation items={items} value={value} onChange={handleChange} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: darkTheme.colors.surface.default,
  },
});
