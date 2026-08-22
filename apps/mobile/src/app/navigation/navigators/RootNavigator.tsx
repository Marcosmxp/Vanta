import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { darkTheme } from '../../../design-system';
import { AccountBlockedScreen } from '../screens/AccountBlockedScreen';
import { SessionExpiredScreen } from '../screens/SessionExpiredScreen';
import type { RootStackParamList } from '../types';
import { AuthStackNavigator } from './AuthStackNavigator';
import { MainTabsNavigator } from './MainTabsNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: darkTheme.colors.background.app },
      }}
    >
      <Stack.Screen name="Auth" component={AuthStackNavigator} />
      <Stack.Screen name="Main" component={MainTabsNavigator} />

      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="SessionExpired" component={SessionExpiredScreen} />
        <Stack.Screen
          name="AccountBlocked"
          component={AccountBlockedScreen}
          options={{ gestureEnabled: false }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
