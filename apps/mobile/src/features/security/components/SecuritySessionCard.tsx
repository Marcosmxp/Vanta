import { StyleSheet, Text, View } from 'react-native';

import { Badge, Card, darkTheme } from '../../../design-system';
import type { SecuritySession } from '../types';

export interface SecuritySessionCardProps {
  session: SecuritySession;
  onPress: () => void;
}

export function SecuritySessionCard({ session, onPress }: SecuritySessionCardProps) {
  const tone = session.current ? 'brand' : session.trust === 'unrecognized' ? 'warning' : 'neutral';
  const statusLabel = session.current
    ? 'Este dispositivo'
    : session.trust === 'unrecognized'
      ? 'Não reconhecido'
      : 'Reconhecido';

  return (
    <Card onPress={onPress} accessibilityLabel={`Abrir sessão ${session.deviceLabel}`} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.title}>{session.deviceLabel}</Text>
          <Text style={styles.subtitle}>{session.platform}</Text>
        </View>
        <Badge label={statusLabel} tone={tone} />
      </View>

      <View style={styles.details}>
        <Text style={styles.detail}>{session.countryCode ?? 'Localização protegida'}</Text>
        <Text style={styles.detail}>{session.ipMasked ?? 'IP protegido'}</Text>
        <Text style={styles.detail}>Última atividade: {session.lastSeenAt}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: darkTheme.spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: darkTheme.spacing.md },
  copy: { flex: 1, gap: darkTheme.spacing.xs },
  title: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  subtitle: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  details: { gap: darkTheme.spacing.xs },
  detail: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
});
