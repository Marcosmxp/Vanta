import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '../../../core/session/SessionProvider';
import { SystemState, darkTheme } from '../../../design-system';
import { AccountBlockedScreen } from '../screens/AccountBlockedScreen';
import { MaintenanceRouteScreen } from '../screens/MaintenanceRouteScreen';
import { SessionExpiredScreen } from '../screens/SessionExpiredScreen';
import type { RootStackParamList } from '../types';
import { AuthStackNavigator } from './AuthStackNavigator';
import { KycStackNavigator } from './KycStackNavigator';
import { MainStackNavigator } from './MainStackNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: darkTheme.colors.background.app },
} as const;

export function RootNavigator() {
  const { status, lastError, retryBootstrap } = useSession();

  if (status === 'bootstrapping') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.colors.background.app }}>
        <SystemState
          kind="loading"
          title="A preparar a sessão segura"
          description="A validar credenciais protegidas e o estado de acesso do dispositivo."
        />
      </SafeAreaView>
    );
  }

  if (status === 'unavailable') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.colors.background.app }}>
        <SystemState
          kind="offline"
          title="Não foi possível confirmar a sessão"
          description={lastError ?? 'O acesso permanece bloqueado até a API Vanta poder confirmar a sessão.'}
          actionLabel="Tentar novamente"
          onAction={() => void retryBootstrap()}
        />
      </SafeAreaView>
    );
  }

  if (status === 'expired') {
    return (
      <Stack.Navigator initialRouteName="SessionExpired" screenOptions={screenOptions}>
        <Stack.Screen name="SessionExpired" component={SessionExpiredScreen} />
        <Stack.Screen name="Auth" component={AuthStackNavigator} />
      </Stack.Navigator>
    );
  }

  if (status === 'anonymous') {
    return (
      <Stack.Navigator initialRouteName="Auth" screenOptions={screenOptions}>
        <Stack.Screen name="Auth" component={AuthStackNavigator} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator initialRouteName="Main" screenOptions={screenOptions}>
      <Stack.Screen name="Main" component={MainStackNavigator} />
      <Stack.Screen name="Kyc" component={KycStackNavigator} />
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
