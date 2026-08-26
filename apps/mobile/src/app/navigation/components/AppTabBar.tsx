import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useI18n } from '../../../core/i18n';
import { BottomNavigation, darkTheme, type BottomNavigationItem } from '../../../design-system';

type IconName = 'home' | 'play' | 'wallet' | 'profile';

function TabIcon({ name, selected }: { name: IconName; selected: boolean }) {
  const tone = selected ? darkTheme.colors.brand.primary : darkTheme.colors.text.secondary;

  if (name === 'home') {
    return (
      <View style={[styles.homeIcon, { borderColor: tone }]}>
        <View style={[styles.homeDoor, { backgroundColor: tone }]} />
      </View>
    );
  }

  if (name === 'play') {
    return (
      <View style={[styles.playIcon, { borderColor: tone }]}>
        <View style={[styles.playTriangle, { borderLeftColor: tone }]} />
      </View>
    );
  }

  if (name === 'wallet') {
    return (
      <View style={[styles.walletIcon, { borderColor: tone }]}>
        <View style={[styles.walletDot, { backgroundColor: tone }]} />
      </View>
    );
  }

  return (
    <View style={styles.profileIcon}>
      <View style={[styles.profileHead, { borderColor: tone }]} />
      <View style={[styles.profileBody, { borderColor: tone }]} />
    </View>
  );
}

export function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const { t } = useI18n();
  const activeRoute = state.routes[state.index];
  const value = activeRoute?.name ?? 'Home';

  const items: readonly BottomNavigationItem[] = [
    { key: 'Home', label: t('nav.home'), icon: (selected) => <TabIcon name="home" selected={selected} /> },
    { key: 'Play', label: t('nav.play'), icon: (selected) => <TabIcon name="play" selected={selected} /> },
    { key: 'Wallet', label: t('nav.wallet'), icon: (selected) => <TabIcon name="wallet" selected={selected} /> },
    { key: 'Profile', label: t('nav.profile'), icon: (selected) => <TabIcon name="profile" selected={selected} /> },
  ];

  function handleChange(key: string) {
    const route = state.routes.find((candidate) => candidate.name === key);
    if (!route) return;

    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
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
  safeArea: { backgroundColor: darkTheme.colors.surface.default },
  homeIcon: {
    width: 17,
    height: 15,
    borderWidth: 1.5,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
  homeDoor: { width: 4, height: 6, borderRadius: 1 },
  playIcon: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playTriangle: {
    width: 0,
    height: 0,
    marginLeft: 2,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 6,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  walletIcon: {
    width: 19,
    height: 14,
    borderWidth: 1.5,
    borderRadius: 4,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 3,
  },
  walletDot: { width: 3, height: 3, borderRadius: 2 },
  profileIcon: { width: 19, height: 19, alignItems: 'center', justifyContent: 'space-between' },
  profileHead: { width: 7, height: 7, borderWidth: 1.5, borderRadius: 4 },
  profileBody: { width: 15, height: 8, borderWidth: 1.5, borderBottomWidth: 0, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
});
