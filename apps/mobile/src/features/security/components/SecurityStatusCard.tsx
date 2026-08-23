import { StyleSheet, Text, View } from 'react-native';

import { Badge, Button, Card, darkTheme } from '../../../design-system';
import type { MfaStatus, SecurityCapabilities, SecuritySnapshot } from '../types';

export interface SecurityStatusCardProps {
  snapshot: SecuritySnapshot;
  capabilities: SecurityCapabilities;
  onBeginMfaEnrollment?: () => void;
  onRevokeOtherSessions?: () => void;
}

const mfaLabel: Record<MfaStatus, string> = {
  disabled: 'MFA desativado',
  enabled: 'MFA ativo',
  required: 'MFA obrigatório',
};

export function SecurityStatusCard({
  snapshot,
  capabilities,
  onBeginMfaEnrollment,
  onRevokeOtherSessions,
}: SecurityStatusCardProps) {
  const activeSessions = snapshot.sessions.filter((session) => session.status === 'active').length;
  const unrecognized = snapshot.sessions.filter((session) => session.trust === 'unrecognized').length;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>PROTEÇÃO DA CONTA</Text>
          <Text style={styles.title}>Segurança centralizada</Text>
        </View>
        <Badge
          label={snapshot.availability === 'ready' ? 'Online' : snapshot.availability === 'restricted' ? 'Restrito' : 'Offline'}
          tone={snapshot.availability === 'ready' ? 'success' : snapshot.availability === 'restricted' ? 'warning' : 'neutral'}
        />
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{mfaLabel[snapshot.mfaStatus]}</Text>
          <Text style={styles.metricLabel}>Autenticação forte</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{activeSessions}</Text>
          <Text style={styles.metricLabel}>Sessões ativas</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{unrecognized}</Text>
          <Text style={styles.metricLabel}>Dispositivos não reconhecidos</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label={snapshot.mfaStatus === 'enabled' ? 'MFA já ativo' : 'Configurar MFA'}
          fullWidth
          disabled={!capabilities.canBeginMfaEnrollment || snapshot.mfaStatus === 'enabled'}
          onPress={onBeginMfaEnrollment}
        />
        <Button
          label="Encerrar outras sessões"
          variant="secondary"
          fullWidth
          disabled={!capabilities.canRevokeOtherSessions}
          onPress={onRevokeOtherSessions}
        />
      </View>

      <Text style={styles.note}>
        {capabilities.message ?? 'Alterações de segurança só são confirmadas depois da resposta autoritativa do servidor.'}
      </Text>
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
