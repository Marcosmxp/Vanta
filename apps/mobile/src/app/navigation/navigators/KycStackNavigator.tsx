import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '../../../core/session/SessionProvider';
import { SystemState, darkTheme } from '../../../design-system';
import { createApiKycStatusProvider } from '../../../features/kyc/provider/ApiKycStatusProvider';
import {
  KycApprovedScreen,
  KycDocumentCaptureScreen,
  KycDocumentTypeScreen,
  KycIntroScreen,
  KycProcessingScreen,
  KycRejectedScreen,
  KycRetryScreen,
  KycSelfieScreen,
} from '../../../features/kyc/screens/KycScreens';
import type { KycStatus } from '../../../features/kyc/types';
import type { KycStackParamList } from '../types';

const Stack = createNativeStackNavigator<KycStackParamList>();

function initialRoute(status: KycStatus): keyof KycStackParamList {
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'processing':
      return 'Processing';
    case 'selfie-required':
      return 'Selfie';
    case 'document-required':
      return 'DocumentType';
    case 'not-started':
      return 'Intro';
  }
}

export function KycStackNavigator() {
  const { request } = useSession();
  const provider = createApiKycStatusProvider(request);
  const statusQuery = useQuery({
    queryKey: ['kyc-status'],
    queryFn: () => provider.getCurrentVerification(),
  });

  if (statusQuery.isPending) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.colors.background.app }}>
        <SystemState
          kind="loading"
          title="A confirmar estado de verificação"
          description="O estado KYC é carregado da API autenticada antes de apresentar o fluxo."
        />
      </SafeAreaView>
    );
  }

  if (!statusQuery.data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.colors.background.app }}>
        <SystemState
          kind="error"
          title="Verificação indisponível"
          description={statusQuery.error instanceof Error ? statusQuery.error.message : 'Não foi possível confirmar o estado KYC.'}
        />
      </SafeAreaView>
    );
  }

  const route = initialRoute(statusQuery.data.status);

  return (
    <Stack.Navigator
      key={statusQuery.data.status}
      initialRouteName={route}
      screenOptions={{
        headerStyle: { backgroundColor: darkTheme.colors.surface.default },
        headerTintColor: darkTheme.colors.text.primary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: darkTheme.colors.background.app },
      }}
    >
      <Stack.Screen name="Intro" component={KycIntroScreen} options={{ title: 'Verificação' }} />
      <Stack.Screen name="DocumentType" component={KycDocumentTypeScreen} options={{ title: 'Documento' }} />
      <Stack.Screen
        name="DocumentCapture"
        component={KycDocumentCaptureScreen}
        options={{ title: 'Captura do documento' }}
      />
      <Stack.Screen name="Selfie" component={KycSelfieScreen} options={{ title: 'Confirmação facial' }} />
      <Stack.Screen
        name="Processing"
        component={KycProcessingScreen}
        options={{ title: 'Em análise', gestureEnabled: false, headerBackVisible: false }}
      />
      <Stack.Screen
        name="Approved"
        component={KycApprovedScreen}
        options={{ title: 'Verificado', gestureEnabled: false, headerBackVisible: false }}
      />
      <Stack.Screen
        name="Rejected"
        component={KycRejectedScreen}
        options={{ title: 'Verificação', gestureEnabled: false, headerBackVisible: false }}
      />
      <Stack.Screen name="Retry" component={KycRetryScreen} options={{ title: 'Nova tentativa' }} />
    </Stack.Navigator>
  );
}
