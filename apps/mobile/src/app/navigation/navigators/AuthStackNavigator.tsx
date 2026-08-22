import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { darkTheme } from '../../../design-system';
import {
  AgeEligibilityScreen,
  AuthWelcomeScreen,
  OnboardingOneScreen,
  OnboardingThreeScreen,
  OnboardingTwoScreen,
  SplashScreen,
} from '../../../features/auth/screens/EntryScreens';
import {
  CreateAccountScreen,
  ForgotPasswordScreen,
  LoginScreen,
  ResetPasswordScreen,
  VerificationScreen,
} from '../../../features/auth/screens/AuthFormScreens';
import type { AuthStackParamList } from '../types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: { backgroundColor: darkTheme.colors.surface.default },
        headerTintColor: darkTheme.colors.text.primary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: darkTheme.colors.background.app },
      }}
    >
      <Stack.Group screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="OnboardingOne" component={OnboardingOneScreen} />
        <Stack.Screen name="OnboardingTwo" component={OnboardingTwoScreen} />
        <Stack.Screen name="OnboardingThree" component={OnboardingThreeScreen} />
        <Stack.Screen name="Eligibility" component={AgeEligibilityScreen} />
        <Stack.Screen name="Welcome" component={AuthWelcomeScreen} />
      </Stack.Group>

      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Entrar' }} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} options={{ title: 'Criar conta' }} />
      <Stack.Screen name="Verification" component={VerificationScreen} options={{ title: 'Verificação' }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Recuperar acesso' }} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: 'Nova palavra-passe' }} />
    </Stack.Navigator>
  );
}
