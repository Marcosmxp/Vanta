import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useI18n } from '../../../core/i18n';
import { Card, SystemState, darkTheme } from '../../../design-system';
import { ProtectionStateCard } from '../components/ProtectionStateCard';
import {
  ResponsibleGamingActionCard,
  type ResponsibleGamingDestination,
} from '../components/ResponsibleGamingActionCard';
import { disconnectedResponsibleGamingSnapshot } from '../provider/ResponsibleGamingProvider';
import type { ResponsibleGamingSnapshot } from '../types';

export interface ResponsibleGamingOverviewScreenProps {
  snapshot?: ResponsibleGamingSnapshot;
  onOpenDestination: (destination: ResponsibleGamingDestination) => void;
}

export function ResponsibleGamingOverviewScreen({
  snapshot = disconnectedResponsibleGamingSnapshot,
  onOpenDestination,
}: ResponsibleGamingOverviewScreenProps) {
  const { t } = useI18n();
  const ready = snapshot.availability === 'ready';
  const configuredLimits = (snapshot.limits ?? []).length + (snapshot.sessionLimit ? 1 : 0);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{t('rg.eyebrow')}</Text>
          <Text style={styles.title}>{t('rg.title')}</Text>
          <Text style={styles.subtitle}>{t('rg.subtitle')}</Text>
        </View>

        {ready ? (
          <>
            <ProtectionStateCard snapshot={snapshot} />

            <Card style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryCopy}>
                  <Text style={styles.summaryLabel}>{t('rg.configuredLimits')}</Text>
                  <Text style={styles.summaryValue}>{configuredLimits}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryCopy}>
                  <Text style={styles.summaryLabel}>{t('rg.state')}</Text>
                  <Text style={styles.summaryState}>{t('rg.synced')}</Text>
                </View>
              </View>
              <Text style={styles.summaryHint}>{t('rg.summaryHint')}</Text>
            </Card>
          </>
        ) : (
          <SystemState
            kind="error"
            title={t('rg.notSyncedTitle')}
            description={t('rg.notSyncedDescription')}
          />
        )}

        <ResponsibleGamingActionCard onOpenDestination={onOpenDestination} />
        <Text style={styles.footer}>{t('rg.footer')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: darkTheme.colors.background.app },
  content: {
    paddingHorizontal: darkTheme.spacing.lg,
    paddingTop: darkTheme.spacing.lg,
    paddingBottom: darkTheme.spacing['4xl'],
    gap: darkTheme.spacing.xl,
  },
  header: { gap: darkTheme.spacing.sm },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.3 },
  title: { ...darkTheme.typography.heading1, color: darkTheme.colors.text.primary },
  subtitle: { ...darkTheme.typography.bodyLarge, color: darkTheme.colors.text.secondary },
  summaryCard: { gap: darkTheme.spacing.md },
  summaryRow: { flexDirection: 'row', alignItems: 'stretch', gap: darkTheme.spacing.lg },
  summaryCopy: { flex: 1, gap: darkTheme.spacing.xs },
  summaryLabel: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  summaryValue: { ...darkTheme.typography.heading2, color: darkTheme.colors.text.primary },
  summaryState: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.status.success },
  divider: { width: 1, backgroundColor: darkTheme.colors.border.default },
  summaryHint: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  footer: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled, textAlign: 'center' },
});
