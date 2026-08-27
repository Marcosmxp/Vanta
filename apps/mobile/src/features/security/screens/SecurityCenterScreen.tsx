import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useI18n } from '../../../core/i18n';
import { SystemState, darkTheme } from '../../../design-system';
import { SecuritySessionCard } from '../components/SecuritySessionCard';
import { SecurityStatusCard } from '../components/SecurityStatusCard';
import {
  disconnectedSecurityCapabilities,
  disconnectedSecuritySnapshot,
} from '../provider/SecurityProvider';
import type { SecurityCapabilities, SecuritySnapshot } from '../types';

export interface SecurityCenterScreenProps {
  snapshot?: SecuritySnapshot;
  capabilities?: SecurityCapabilities;
  onOpenSession: (sessionId: string) => void;
  onBeginMfaEnrollment?: () => void;
  onRevokeOtherSessions?: () => void;
}

export function SecurityCenterScreen({
  snapshot = disconnectedSecuritySnapshot,
  capabilities = disconnectedSecurityCapabilities,
  onOpenSession,
  onBeginMfaEnrollment,
  onRevokeOtherSessions,
}: SecurityCenterScreenProps) {
  const { t } = useI18n();
  const sessionsReady = snapshot.availability === 'ready';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{t('security.center.eyebrow')}</Text>
          <Text style={styles.title}>{t('security.center.title')}</Text>
          <Text style={styles.subtitle}>{t('security.center.subtitle')}</Text>
        </View>

        <SecurityStatusCard
          snapshot={snapshot}
          capabilities={capabilities}
          onBeginMfaEnrollment={onBeginMfaEnrollment}
          onRevokeOtherSessions={onRevokeOtherSessions}
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('security.center.sessionsTitle')}</Text>
            <Text style={styles.sectionCount}>{snapshot.sessions.length}</Text>
          </View>

          {snapshot.sessions.length === 0 ? (
            <SystemState
              kind={sessionsReady ? 'empty' : 'error'}
              compact
              title={sessionsReady ? t('security.center.noSessionsTitle') : t('security.center.unavailableTitle')}
              description={
                snapshot.message ??
                (sessionsReady
                  ? t('security.center.noSessionsDescription')
                  : t('security.center.unavailableDescription'))
              }
            />
          ) : (
            <View style={styles.list}>
              {snapshot.sessions.map((session) => (
                <SecuritySessionCard
                  key={session.sessionId}
                  session={session}
                  onPress={() => onOpenSession(session.sessionId)}
                />
              ))}
            </View>
          )}
        </View>

        <Text style={styles.footer}>{t('security.center.footer')}</Text>
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
  section: { gap: darkTheme.spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  sectionCount: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.brand.primary },
  list: { gap: darkTheme.spacing.sm },
  footer: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled, textAlign: 'center' },
});
