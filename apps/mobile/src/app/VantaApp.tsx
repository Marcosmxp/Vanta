import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LocalizationProvider } from '../core/i18n';
import { queryClient } from '../core/query/queryClient';
import { SessionProvider } from '../core/session/SessionProvider';
import { vantaNavigationTheme } from './navigation/navigationTheme';
import { RootNavigator } from './navigation/navigators/RootNavigator';

export function VantaApp() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <LocalizationProvider>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <NavigationContainer theme={vantaNavigationTheme}>
              <RootNavigator />
            </NavigationContainer>
          </SessionProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </SafeAreaProvider>
  );
}
