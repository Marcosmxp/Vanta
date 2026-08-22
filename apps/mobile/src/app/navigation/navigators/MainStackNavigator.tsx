import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { darkTheme } from '../../../design-system';
import { BetDetailsRouteScreen } from '../screens/BetDetailsRouteScreen';
import { BetHistoryRouteScreen } from '../screens/BetHistoryRouteScreen';
import { WalletTransactionDetailsRouteScreen } from '../screens/WalletTransactionDetailsRouteScreen';
import type { MainStackParamList } from '../types';
import { MainTabsNavigator } from './MainTabsNavigator';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        headerStyle: { backgroundColor: darkTheme.colors.surface.default },
        headerTintColor: darkTheme.colors.text.primary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: darkTheme.colors.background.app },
      }}
    >
      <Stack.Screen name="Tabs" component={MainTabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="BetHistory" component={BetHistoryRouteScreen} options={{ title: 'Apostas' }} />
      <Stack.Screen name="BetDetails" component={BetDetailsRouteScreen} options={{ title: 'Detalhe da aposta' }} />
      <Stack.Screen
        name="WalletTransactionDetails"
        component={WalletTransactionDetailsRouteScreen}
        options={{ title: 'Detalhe do movimento' }}
      />
    </Stack.Navigator>
  );
}
