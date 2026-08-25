import { StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../../../core/i18n';
import { Badge, Card, darkTheme } from '../../../design-system';
import type { ProfileSnapshot } from '../types';

export interface ProfileIdentityCardProps {
  snapshot: ProfileSnapshot;
}

function initialFor(name: string | null) {
  return name?.trim().charAt(0).toUpperCase() || 'V';
}

export function ProfileIdentityCard({ snapshot }: ProfileIdentityCardProps) {
  const { t } = useI18n();
  const { identity, availability } = snapshot;
  const ready = availability === 'ready';

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initialFor(identity.displayName)}</Text>
        </View>
        <View style={styles.copy}>
          <Text style={styles.name}>{ready ? identity.displayName ?? t('profile.identity.playerFallback') : t('profile.identity.unavailable')}</Text>
        </View>
        <Badge
          label={availability === 'ready' ? t('profile.identity.active') : availability === 'restricted' ? t('profile.identity.restricted') : t('profile.identity.offline')}
          tone={availability === 'ready' ? 'success' : availability === 'restricted' ? 'warning' : 'neutral'}
        />
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>{t('common.email')}</Text>
          <Text style={styles.value}>{ready ? identity.emailMasked ?? '—' : '—'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>{t('common.phone')}</Text>
          <Text style={styles.value}>{ready ? identity.phoneMasked ?? '—' : '—'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>{t('common.country')}</Text>
          <Text style={styles.value}>{ready ? identity.countryCode ?? '—' : '—'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>{t('common.memberSince')}</Text>
          <Text style={styles.value}>{ready ? identity.memberSince ?? '—' : '—'}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: darkTheme.spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: darkTheme.spacing.md },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: darkTheme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: darkTheme.colors.brand.primary,
    backgroundColor: darkTheme.colors.surface.raised,
  },
  avatarText: { ...darkTheme.typography.heading3, color: darkTheme.colors.brand.primary },
  copy: { flex: 1, gap: darkTheme.spacing.xs },
  name: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  details: {
    gap: darkTheme.spacing.sm,
    paddingTop: darkTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border.default,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', gap: darkTheme.spacing.lg },
  label: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  value: { ...darkTheme.typography.bodyStrong, flexShrink: 1, textAlign: 'right', color: darkTheme.colors.text.primary },
});
