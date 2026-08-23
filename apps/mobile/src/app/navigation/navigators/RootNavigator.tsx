import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { darkTheme } from '../../../design-system';
import { AccountBlockedScreen } from '../screens/AccountBlockedScreen';
import { MaintenanceRouteScreen } from '../screens/MaintenanceRouteScreen';
import { SessionExpiredScreen } from '../screens/SessionExpiredScreen';
import type { RootStackParamList } from '../types';
import { AuthStackNavigator } from './AuthStackNavigator';
import { KycStackNavigator } from './KycStackNavigator';
import { MainStackNavigator } from './MainStackNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: darkTheme.colors.background.app },
      }}
    >
      <Stack.Screen name="Auth" component={AuthStackNavigator} />
      <Stack.Screen name="Kyc" component={KycStackNavigator} />
      <Stack.Screen name="Main" component={MainStackNavigator} />
      <Stack.Screen
        name="Maintenance"
        component={MaintenanceRouteScreen}
        options={{ gestureEnabled: false }}
      />

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
