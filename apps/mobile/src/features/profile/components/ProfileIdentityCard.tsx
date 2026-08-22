import { StyleSheet, Text, View } from 'react-native';

import { Badge, Card, darkTheme } from '../../../design-system';
import type { ProfileSnapshot } from '../types';

export interface ProfileIdentityCardProps {
  snapshot: ProfileSnapshot;
}

function initialFor(name: string | null) {
  return name?.trim().charAt(0).toUpperCase() || 'V';
}

export function ProfileIdentityCard({ snapshot }: ProfileIdentityCardProps) {
  const { identity, availability } = snapshot;
  const ready = availability === 'ready';

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initialFor(identity.displayName)}</Text>
        </View>
        <View style={styles.copy}>
          <Text style={styles.name}>{ready ? identity.displayName ?? 'Jogador Vanta' : 'Perfil indisponível'}</Text>
          <Text style={styles.playerId}>{ready && identity.playerId ? identity.playerId : 'Identificador protegido'}</Text>
        </View>
        <Badge
          label={availability === 'ready' ? 'Ativo' : availability === 'restricted' ? 'Restrito' : 'Offline'}
          tone={availability === 'ready' ? 'success' : availability === 'restricted' ? 'warning' : 'neutral'}
        />
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{ready ? identity.emailMasked ?? '—' : '—'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Telefone</Text>
          <Text style={styles.value}>{ready ? identity.phoneMasked ?? '—' : '—'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>País</Text>
          <Text style={styles.value}>{ready ? identity.countryCode ?? '—' : '—'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Membro desde</Text>
          <Text style={styles.value}>{ready ? identity.memberSince ?? '—' : '—'}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: darkTheme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.md,
  },
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
  avatarText: {
    ...darkTheme.typography.heading3,
    color: darkTheme.colors.brand.primary,
  },
  copy: {
    flex: 1,
    gap: darkTheme.spacing.xs,
  },
  name: {
    ...darkTheme.typography.heading3,
    color: darkTheme.colors.text.primary,
  },
  playerId: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
  details: {
    gap: darkTheme.spacing.sm,
    paddingTop: darkTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border.default,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.lg,
  },
  label: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
  },
  value: {
    ...darkTheme.typography.bodyStrong,
    flexShrink: 1,
    textAlign: 'right',
    color: darkTheme.colors.text.primary,
  },
});
