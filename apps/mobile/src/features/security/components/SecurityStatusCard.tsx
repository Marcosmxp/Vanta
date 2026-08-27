import { StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../../../core/i18n';
import { Badge, Button, Card, darkTheme } from '../../../design-system';
import type { SecurityCapabilities, SecuritySnapshot } from '../types';

export interface SecurityStatusCardProps {
  snapshot: SecuritySnapshot;
  capabilities: SecurityCapabilities;
  onBeginMfaEnrollment?: () => void;
  onRevokeOtherSessions?: () => void;
}

export function SecurityStatusCard({
  snapshot,
  capabilities,
  onBeginMfaEnrollment,
  onRevokeOtherSessions,
}: SecurityStatusCardProps) {
  const { t } = useI18n();
  const activeSessions = snapshot.sessions.filter((session) => session.status === 'active').length;
  const unrecognized = snapshot.sessions.filter((session) => session.trust === 'unrecognized').length;
  const availabilityLabel = snapshot.availability === 'ready'
    ? t('security.availability.ready')
    : snapshot.availability === 'restricted'
      ? t('security.availability.restricted')
      : t('security.availability.unavailable');
  const mfaLabel = snapshot.mfaStatus === 'enabled'
    ? t('security.mfa.enabled')
    : snapshot.mfaStatus === 'required'
      ? t('security.mfa.required')
      : t('security.mfa.disabled');

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>{t('security.status.eyebrow')}</Text>
          <Text style={styles.title}>{t('security.status.title')}</Text>
        </View>
        <Badge
          label={availabilityLabel}
          tone={snapshot.availability === 'ready' ? 'success' : snapshot.availability === 'restricted' ? 'warning' : 'neutral'}
        />
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{mfaLabel}</Text>
          <Text style={styles.metricLabel}>{t('security.metric.mfa')}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{activeSessions}</Text>
          <Text style={styles.metricLabel}>{t('security.metric.activeSessions')}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{unrecognized}</Text>
          <Text style={styles.metricLabel}>{t('security.metric.unrecognizedDevices')}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label={snapshot.mfaStatus === 'enabled' ? t('security.action.mfaActive') : t('security.action.configureMfa')}
          fullWidth
          disabled={!capabilities.canBeginMfaEnrollment || snapshot.mfaStatus === 'enabled'}
          onPress={onBeginMfaEnrollment}
        />
        <Button
          label={t('security.action.revokeOthers')}
          variant="secondary"
          fullWidth
          disabled={!capabilities.canRevokeOtherSessions}
          onPress={onRevokeOtherSessions}
        />
      </View>

      <Text style={styles.note}>{t('security.note')}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: darkTheme.spacing.lg },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: darkTheme.spacing.md },
  copy: { flex: 1, gap: darkTheme.spacing.xs },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.2 },
  title: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  metrics: { gap: darkTheme.spacing.sm },
  metric: { flexDirection: 'row', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  metricValue: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  metricLabel: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary, textAlign: 'right', flexShrink: 1 },
  actions: { gap: darkTheme.spacing.sm },
  note: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled },
});
