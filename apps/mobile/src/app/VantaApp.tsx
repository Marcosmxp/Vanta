import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { darkTheme } from '../design-system';
import { getPublicEnvironment } from './config/environment';

const environment = getPublicEnvironment();

export function VantaApp() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.brand}>VANTA</Text>

        <View style={styles.foundationCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusIndicator} />
            <Text style={styles.status}>Design foundations active</Text>
          </View>

          <Text style={styles.description}>
            Code-first dark theme with Vanta red semantic tokens.
          </Text>

          <Text style={styles.environment}>Environment: {environment.name}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: darkTheme.colors.background.app,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: darkTheme.spacing['2xl'],
    paddingHorizontal: darkTheme.spacing['2xl'],
  },
  brand: {
    ...darkTheme.typography.brandWordmark,
    color: darkTheme.colors.text.primary,
  },
  foundationCard: {
    width: '100%',
    maxWidth: 420,
    gap: darkTheme.spacing.md,
    padding: darkTheme.spacing.xl,
    borderRadius: darkTheme.radius.lg,
    borderWidth: 1,
    borderColor: darkTheme.colors.border.default,
    backgroundColor: darkTheme.colors.surface.raised,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.sm,
  },
  statusIndicator: {
    width: darkTheme.spacing.sm,
    height: darkTheme.spacing.sm,
    borderRadius: darkTheme.radius.full,
    backgroundColor: darkTheme.colors.brand.primary,
  },
  status: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.brand.primary,
  },
  description: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.primary,
  },
  environment: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
});
