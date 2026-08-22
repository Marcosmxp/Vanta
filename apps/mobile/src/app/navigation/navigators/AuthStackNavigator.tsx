import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { darkTheme } from '../../../design-system';
import { AuthLoginScreen } from '../screens/AuthLoginScreen';
import { AuthWelcomeScreen } from '../screens/AuthWelcomeScreen';
import type { AuthStackParamList } from '../types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: { backgroundColor: darkTheme.colors.surface.default },
        headerTintColor: darkTheme.colors.text.primary,
        contentStyle: { backgroundColor: darkTheme.colors.background.app },
      }}
    >
      <Stack.Screen name="Welcome" component={AuthWelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={AuthLoginScreen} options={{ title: 'Login' }} />
    </Stack.Navigator>
  );
}
