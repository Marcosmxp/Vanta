import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '../../../core/session/SessionProvider';
import { createApiSystemAvailabilityProvider } from '../../../core/system-state/provider/ApiSystemAvailabilityProvider';
import { SystemState, darkTheme } from '../../../design-system';
import { createApiProfileProvider } from '../../../features/profile/provider/ApiProfileProvider';
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

function StateSurface({
  kind,
  title,
  description,
  actionLabel,
  onAction,
}: {
  kind: 'loading' | 'offline' | 'error';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.colors.background.app }}>
      <SystemState
        kind={kind}
        title={title}
        description={description}
        actionLabel={actionLabel}
        onAction={onAction}
      />
    </SafeAreaView>
  );
}

export function RootNavigator() {
  const { status, lastError, retryBootstrap, request, publicRequest } = useSession();
  const platformProvider = createApiSystemAvailabilityProvider(publicRequest);
  const profileProvider = createApiProfileProvider(request);

  const platformQuery = useQuery({
    queryKey: ['platform-status'],
    queryFn: () => platformProvider.getAvailability(),
    enabled: status !== 'bootstrapping',
    refetchInterval: 30_000,
  });
  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileProvider.getProfile(),
    enabled: status === 'authenticated',
  });

  if (status === 'bootstrapping') {
    return (
      <StateSurface
        kind="loading"
        title="A preparar a sessão segura"
        description="A validar credenciais protegidas e o estado de acesso do dispositivo."
      />
    );
  }

  if (platformQuery.data?.availability === 'maintenance') {
    return (
      <Stack.Navigator initialRouteName="Maintenance" screenOptions={screenOptions}>
        <Stack.Screen
          name="Maintenance"
          component={MaintenanceRouteScreen}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    );
  }

  if (status === 'unavailable') {
    return (
      <StateSurface
        kind="offline"
        title="Não foi possível confirmar a sessão"
        description={lastError ?? 'O acesso permanece bloqueado até a API Vanta poder confirmar a sessão.'}
        actionLabel="Tentar novamente"
        onAction={() => void retryBootstrap()}
      />
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

  if (profileQuery.isPending) {
    return (
      <StateSurface
        kind="loading"
        title="A confirmar estado da conta"
        description="A conta só entra na área autenticada depois de o servidor confirmar o estado atual."
      />
    );
  }

  if (!profileQuery.data) {
    return (
      <StateSurface
        kind="error"
        title="Estado da conta indisponível"
        description={
          profileQuery.error instanceof Error
            ? profileQuery.error.message
            : 'Não foi possível confirmar o estado da conta com o backend.'
        }
        actionLabel="Tentar novamente"
        onAction={() => void profileQuery.refetch()}
      />
    );
  }

  if (profileQuery.data.verification.accountStatus === 'blocked') {
    return (
      <Stack.Navigator initialRouteName="AccountBlocked" screenOptions={screenOptions}>
        <Stack.Screen
          name="AccountBlocked"
          component={AccountBlockedScreen}
          options={{ gestureEnabled: false }}
        />
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
