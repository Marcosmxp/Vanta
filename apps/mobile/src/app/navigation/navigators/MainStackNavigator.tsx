import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { darkTheme } from '../../../design-system';
import { BetDetailsRouteScreen } from '../screens/BetDetailsRouteScreen';
import { BetHistoryRouteScreen } from '../screens/BetHistoryRouteScreen';
import { DepositRouteScreen } from '../screens/DepositRouteScreen';
import { LegalRouteScreen } from '../screens/LegalRouteScreen';
import { ResponsibleGamingRouteScreen } from '../screens/ResponsibleGamingRouteScreen';
import { SecurityCenterRouteScreen } from '../screens/SecurityCenterRouteScreen';
import { SecuritySessionDetailsRouteScreen } from '../screens/SecuritySessionDetailsRouteScreen';
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
      <Stack.Screen name="Support" component={SupportRouteScreen} options={{ title: 'Suporte' }} />
      <Stack.Screen name="Legal" component={LegalRouteScreen} options={{ title: 'Legal e privacidade' }} />
    </Stack.Navigator>
  );
}
