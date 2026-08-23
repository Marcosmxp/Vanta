import { StyleSheet, Text, View } from 'react-native';

import { Badge, Card, darkTheme } from '../../../design-system';
import type { ResponsibleGamingSnapshot } from '../types';
import { protectionStateLabel } from '../utils/format';

export interface ProtectionStateCardProps {
  snapshot: ResponsibleGamingSnapshot;
}

function formatTimestamp(value: string | null): string {
  if (!value) return 'Sem data definida';
  return new Date(value).toLocaleString('pt-PT');
}

export function ProtectionStateCard({ snapshot }: ProtectionStateCardProps) {
  const activeRestriction = snapshot.selfExclusion ?? snapshot.activeTimeOut;
  const tone =
    snapshot.state === 'self-excluded'
      ? 'danger'
      : snapshot.state === 'time-out' || snapshot.state === 'restricted'
        ? 'warning'
        : snapshot.state === 'limits-configured'
          ? 'success'
          : 'neutral';

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>ESTADO DE PROTEÇÃO</Text>
          <Text style={styles.title}>{protectionStateLabel(snapshot.state)}</Text>
        </View>
        <Badge label={snapshot.availability === 'ready' ? 'Atualizado' : 'Indisponível'} tone={tone} />
      </View>

      <Text style={styles.description}>
        {snapshot.message ??
          'Os controlos apresentados são uma projeção do estado autoritativo mantido pelo backend.'}
      </Text>

      {activeRestriction ? (
        <View style={styles.restriction}>
          <Text style={styles.restrictionTitle}>{activeRestriction.label}</Text>
          <Text style={styles.restrictionText}>Início: {formatTimestamp(activeRestriction.startedAt)}</Text>
          <Text style={styles.restrictionText}>Fim: {formatTimestamp(activeRestriction.endsAt)}</Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: darkTheme.spacing.md },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  copy: { flex: 1, gap: darkTheme.spacing.xs },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.1 },
  title: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  description: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  restriction: {
    gap: darkTheme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border.default,
    paddingTop: darkTheme.spacing.md,
  },
  restrictionTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  restrictionText: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
});
