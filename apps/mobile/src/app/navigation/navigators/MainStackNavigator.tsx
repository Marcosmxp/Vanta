import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { darkTheme } from '../../../design-system';
import { BetDetailsRouteScreen } from '../screens/BetDetailsRouteScreen';
import { BetHistoryRouteScreen } from '../screens/BetHistoryRouteScreen';
import { DepositRouteScreen } from '../screens/DepositRouteScreen';
import { LegalDocumentRouteScreen } from '../screens/LegalDocumentRouteScreen';
import { LegalRouteScreen } from '../screens/LegalRouteScreen';
import { PrivacyInformationRouteScreen } from '../screens/PrivacyInformationRouteScreen';
import { RegulatoryInformationRouteScreen } from '../screens/RegulatoryInformationRouteScreen';
import { ResponsibleGamingLimitChangeRouteScreen } from '../screens/ResponsibleGamingLimitChangeRouteScreen';
import { ResponsibleGamingLimitsRouteScreen } from '../screens/ResponsibleGamingLimitsRouteScreen';
import { ResponsibleGamingRouteScreen } from '../screens/ResponsibleGamingRouteScreen';
import { ResponsibleGamingSelfExclusionRouteScreen } from '../screens/ResponsibleGamingSelfExclusionRouteScreen';
import { ResponsibleGamingTimeOutRouteScreen } from '../screens/ResponsibleGamingTimeOutRouteScreen';
import { SecurityCenterRouteScreen } from '../screens/SecurityCenterRouteScreen';
import { SecuritySessionDetailsRouteScreen } from '../screens/SecuritySessionDetailsRouteScreen';
import { SupportRequestCreateRouteScreen } from '../screens/SupportRequestCreateRouteScreen';
import { SupportRequestDetailsRouteScreen } from '../screens/SupportRequestDetailsRouteScreen';
import { SupportRouteScreen } from '../screens/SupportRouteScreen';
import { WalletTransactionDetailsRouteScreen } from '../screens/WalletTransactionDetailsRouteScreen';
import { WithdrawalRouteScreen } from '../screens/WithdrawalRouteScreen';
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
      <Stack.Screen name="Deposit" component={DepositRouteScreen} options={{ title: 'Depositar' }} />
      <Stack.Screen name="Withdrawal" component={WithdrawalRouteScreen} options={{ title: 'Levantar' }} />
      <Stack.Screen name="SecurityCenter" component={SecurityCenterRouteScreen} options={{ title: 'Segurança' }} />
      <Stack.Screen
        name="SecuritySessionDetails"
        component={SecuritySessionDetailsRouteScreen}
        options={{ title: 'Detalhe da sessão' }}
      />
      <Stack.Screen
        name="ResponsibleGaming"
        component={ResponsibleGamingRouteScreen}
        options={{ title: 'Jogo responsável' }}
      />
      <Stack.Screen
        name="ResponsibleGamingLimits"
        component={ResponsibleGamingLimitsRouteScreen}
        options={{ title: 'Limites pessoais' }}
      />
      <Stack.Screen
        name="ResponsibleGamingLimitChange"
        component={ResponsibleGamingLimitChangeRouteScreen}
        options={{ title: 'Alterar limite' }}
      />
      <Stack.Screen
        name="ResponsibleGamingTimeOut"
        component={ResponsibleGamingTimeOutRouteScreen}
        options={{ title: 'Time-out' }}
      />
      <Stack.Screen
        name="ResponsibleGamingSelfExclusion"
        component={ResponsibleGamingSelfExclusionRouteScreen}
        options={{ title: 'Autoexclusão' }}
      />
      <Stack.Screen name="Support" component={SupportRouteScreen} options={{ title: 'Suporte' }} />
      <Stack.Screen
        name="SupportRequestCreate"
        component={SupportRequestCreateRouteScreen}
        options={{ title: 'Novo pedido' }}
      />
      <Stack.Screen
        name="SupportRequestDetails"
        component={SupportRequestDetailsRouteScreen}
        options={{ title: 'Detalhe do pedido' }}
      />
      <Stack.Screen name="Legal" component={LegalRouteScreen} options={{ title: 'Legal e privacidade' }} />
      <Stack.Screen name="LegalDocument" component={LegalDocumentRouteScreen} options={{ title: 'Documento legal' }} />
      <Stack.Screen
        name="PrivacyInformation"
        component={PrivacyInformationRouteScreen}
        options={{ title: 'Privacidade' }}
      />
      <Stack.Screen
        name="RegulatoryInformation"
        component={RegulatoryInformationRouteScreen}
        options={{ title: 'Informação regulatória' }}
      />
    </Stack.Navigator>
  );
}
