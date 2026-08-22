import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, darkTheme } from '../../../design-system';

export interface KycScreenLayoutProps {
  step?: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export function KycScreenLayout({ step, title, description, children }: KycScreenLayoutProps) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Badge label={step ? `KYC · ${step}` : 'KYC'} tone="brand" />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.body}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: darkTheme.colors.background.app,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: darkTheme.spacing['2xl'],
    paddingVertical: darkTheme.spacing['3xl'],
    gap: darkTheme.spacing['3xl'],
  },
  header: {
    gap: darkTheme.spacing.md,
  },
  title: {
    ...darkTheme.typography.headingH1,
    color: darkTheme.colors.text.primary,
  },
  description: {
    ...darkTheme.typography.bodyLarge,
    color: darkTheme.colors.text.secondary,
  },
  body: {
    gap: darkTheme.spacing.lg,
  },
});
