import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useI18n } from '../../../core/i18n';
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
  const { t } = useI18n();
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
          title={t('kyc.nav.loadingTitle')}
          description={t('kyc.nav.loadingDescription')}
        />
      </SafeAreaView>
    );
  }

  if (!statusQuery.data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.colors.background.app }}>
        <SystemState
          kind="error"
          title={t('kyc.nav.unavailableTitle')}
          description={t('kyc.nav.unavailableDescription')}
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
      <Stack.Screen name="Intro" component={KycIntroScreen} options={{ title: t('kyc.nav.intro') }} />
      <Stack.Screen name="DocumentType" component={KycDocumentTypeScreen} options={{ title: t('kyc.nav.document') }} />
      <Stack.Screen
        name="DocumentCapture"
        component={KycDocumentCaptureScreen}
        options={{ title: t('kyc.nav.capture') }}
      />
      <Stack.Screen name="Selfie" component={KycSelfieScreen} options={{ title: t('kyc.nav.selfie') }} />
      <Stack.Screen
        name="Processing"
        component={KycProcessingScreen}
        options={{ title: t('kyc.nav.processing'), gestureEnabled: false, headerBackVisible: false }}
      />
      <Stack.Screen
        name="Approved"
        component={KycApprovedScreen}
        options={{ title: t('kyc.nav.approved'), gestureEnabled: false, headerBackVisible: false }}
      />
      <Stack.Screen
        name="Rejected"
        component={KycRejectedScreen}
        options={{ title: t('kyc.nav.rejected'), gestureEnabled: false, headerBackVisible: false }}
      />
      <Stack.Screen name="Retry" component={KycRetryScreen} options={{ title: t('kyc.nav.retry') }} />
    </Stack.Navigator>
  );
}
