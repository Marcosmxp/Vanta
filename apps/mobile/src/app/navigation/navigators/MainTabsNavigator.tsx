import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AppTabBar } from '../components/AppTabBar';
import { HomeScreen } from '../screens/HomeScreen';
import { PlayScreen } from '../screens/PlayScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { WalletScreen } from '../screens/WalletScreen';
import type { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Play" component={PlayScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
