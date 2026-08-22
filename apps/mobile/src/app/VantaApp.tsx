import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { getPublicEnvironment } from './config/environment';

const environment = getPublicEnvironment();

export function VantaApp() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.brand}>VANTA</Text>
        <Text style={styles.status}>Mobile bootstrap active</Text>
        <Text style={styles.environment}>Environment: {environment.name}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B0D10',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  brand: {
    color: '#F5F7FA',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 4,
  },
  status: {
    color: '#FF3344',
    fontSize: 16,
    fontWeight: '600',
  },
  environment: {
    color: '#9299A6',
    fontSize: 13,
  },
});
