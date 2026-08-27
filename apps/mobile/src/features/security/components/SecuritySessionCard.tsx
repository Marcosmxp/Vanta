import { StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../../../core/i18n';
import { Badge, Card, darkTheme } from '../../../design-system';
import type { SecuritySession } from '../types';

export interface SecuritySessionCardProps {
  session: SecuritySession;
  onPress: () => void;
}

export function SecuritySessionCard({ session, onPress }: SecuritySessionCardProps) {
  const { t } = useI18n();
  const tone = session.current ? 'brand' : session.trust === 'unrecognized' ? 'warning' : 'neutral';
  const statusLabel = session.current
    ? t('security.session.current')
    : session.trust === 'unrecognized'
      ? t('security.session.unrecognized')
      : t('security.session.recognized');

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${t('security.session.open')} ${session.deviceLabel}`}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.title}>{session.deviceLabel}</Text>
          <Text style={styles.subtitle}>{session.platform}</Text>
        </View>
        <Badge label={statusLabel} tone={tone} />
      </View>

      <View style={styles.details}>
        <Text style={styles.detail}>{session.countryCode ?? t('security.session.locationProtected')}</Text>
        <Text style={styles.detail}>{session.ipMasked ?? t('security.session.ipProtected')}</Text>
        <Text style={styles.detail}>{t('security.session.lastActivity')}: {session.lastSeenAt}</Text>
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
