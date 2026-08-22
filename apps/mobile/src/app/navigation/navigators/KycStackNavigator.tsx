import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { darkTheme } from '../../../design-system';
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
import type { KycStackParamList } from '../types';

const Stack = createNativeStackNavigator<KycStackParamList>();

export function KycStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Intro"
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
