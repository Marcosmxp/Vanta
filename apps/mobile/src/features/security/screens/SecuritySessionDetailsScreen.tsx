import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useI18n } from '../../../core/i18n';
import { Badge, Button, Card, darkTheme } from '../../../design-system';
import type { SecurityCapabilities, SecuritySession } from '../types';

export interface SecuritySessionDetailsScreenProps {
  sessionId: string;
  session?: SecuritySession | null;
  capabilities: SecurityCapabilities;
  onRevokeSession?: () => void;
}

export function SecuritySessionDetailsScreen({
  sessionId,
  session = null,
  capabilities,
  onRevokeSession,
}: SecuritySessionDetailsScreenProps) {
  const { t } = useI18n();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{t('security.detail.eyebrow')}</Text>
          <Text style={styles.title}>{session?.deviceLabel ?? t('security.detail.protectedTitle')}</Text>
          <Text style={styles.subtitle}>ID: {sessionId}</Text>
        </View>

        {session ? (
          <>
            <Card style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>{t('security.detail.status')}</Text>
                <Badge
                  label={session.status === 'active' ? t('security.detail.status.active') : t('security.detail.status.revoked')}
                  tone={session.status === 'active' ? 'success' : 'neutral'}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t('security.detail.device')}</Text>
                <Text style={styles.value}>{session.deviceLabel}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t('security.detail.platform')}</Text>
                <Text style={styles.value}>{session.platform}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t('security.detail.trust')}</Text>
                <Text style={styles.value}>
                  {session.trust === 'trusted'
                    ? t('security.detail.trust.trusted')
                    : t('security.detail.trust.unrecognized')}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t('security.detail.mfaUsed')}</Text>
                <Text style={styles.value}>{session.mfaUsed ? t('security.detail.yes') : t('security.detail.no')}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t('security.detail.ip')}</Text>
                <Text style={styles.value}>{session.ipMasked ?? t('security.session.ipProtected')}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t('security.detail.country')}</Text>
                <Text style={styles.value}>{session.countryCode ?? t('security.session.locationProtected')}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t('security.detail.lastActivity')}</Text>
                <Text style={styles.value}>{session.lastSeenAt}</Text>
              </View>
            </Card>

            <Button
              label={session.current ? t('security.detail.currentProtected') : t('security.detail.revoke')}
              variant="danger"
              fullWidth
              disabled={session.current || !capabilities.canRevokeSession || session.status !== 'active'}
              onPress={onRevokeSession}
            />
          </>
        ) : (
          <Card style={styles.card}>
            <Text style={styles.emptyTitle}>{t('security.detail.unavailableTitle')}</Text>
            <Text style={styles.emptyDescription}>{t('security.detail.unavailableDescription')}</Text>
          </Card>
        )}

        <Text style={styles.footer}>{t('security.detail.footer')}</Text>
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
  header: { gap: darkTheme.spacing.xs },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.2 },
  title: { ...darkTheme.typography.heading1, color: darkTheme.colors.text.primary },
  subtitle: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  card: { gap: darkTheme.spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: darkTheme.spacing.lg },
  label: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  value: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary, textAlign: 'right', flexShrink: 1 },
  emptyTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  emptyDescription: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  footer: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled, textAlign: 'center' },
});
