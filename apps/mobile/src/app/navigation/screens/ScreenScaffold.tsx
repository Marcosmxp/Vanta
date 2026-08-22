import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Card, darkTheme } from '../../../design-system';

export interface ScreenScaffoldProps {
  eyebrow: string;
  title: string;
  description: string;
  statusLabel?: string;
  children?: ReactNode;
}

export function ScreenScaffold({
  eyebrow,
  title,
  description,
  statusLabel = 'Navigation shell',
  children,
}: ScreenScaffoldProps) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <Card elevated>
          <View style={styles.cardContent}>
            <Badge label={statusLabel} tone="brand" />
            <Text style={styles.cardText}>
              Esta rota já está integrada ao shell real do Vanta. O conteúdo de negócio será
              implementado nas próximas fases.
            </Text>
          </View>
        </Card>

        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: darkTheme.colors.background.app,
  },
  content: {
    flexGrow: 1,
    gap: darkTheme.spacing['2xl'],
    paddingHorizontal: darkTheme.spacing['2xl'],
    paddingTop: darkTheme.spacing['3xl'],
    paddingBottom: darkTheme.spacing['4xl'],
  },
  heading: {
    gap: darkTheme.spacing.sm,
  },
  eyebrow: {
    ...darkTheme.typography.labelSmall,
    color: darkTheme.colors.brand.primary,
    textTransform: 'uppercase',
  },
  title: {
    ...darkTheme.typography.heading1,
    color: darkTheme.colors.text.primary,
  },
  description: {
    ...darkTheme.typography.bodyLarge,
    color: darkTheme.colors.text.secondary,
  },
  cardContent: {
    gap: darkTheme.spacing.md,
  },
  cardText: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.primary,
  },
});
