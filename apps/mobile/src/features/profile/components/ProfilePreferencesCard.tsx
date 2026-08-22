import { StyleSheet, Text, View } from 'react-native';

import { Badge, Card, darkTheme } from '../../../design-system';
import type { ProfileSnapshot } from '../types';

export interface ProfilePreferencesCardProps {
  snapshot: ProfileSnapshot;
}

function languageLabel(language: ProfileSnapshot['preferences']['language']) {
  switch (language) {
    case 'pt-PT':
      return 'Português';
    case 'en':
      return 'English';
    default:
      return 'Indisponível';
  }
}

function protectionLabel(status: ProfileSnapshot['preferences']['protectionStatus']) {
  switch (status) {
    case 'standard':
      return 'Padrão';
    case 'limits-configured':
      return 'Limites ativos';
    case 'restricted':
      return 'Restrito';
  }
}

export function ProfilePreferencesCard({ snapshot }: ProfilePreferencesCardProps) {
  const { preferences } = snapshot;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>PREFERÊNCIAS</Text>
          <Text style={styles.title}>Conta e comunicação</Text>
        </View>
        <Badge label={languageLabel(preferences.language)} tone="neutral" />
      </View>

      <View style={styles.rows}>
        <View style={styles.row}>
          <Text style={styles.label}>Comunicações de marketing</Text>
          <Text style={styles.value}>
            {preferences.marketingOptIn === true
              ? 'Ativas'
              : preferences.marketingOptIn === false
                ? 'Desativadas'
                : 'Indisponível'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Proteção de jogo</Text>
          <Text style={styles.value}>{protectionLabel(preferences.protectionStatus)}</Text>
        </View>
      </View>

      <Text style={styles.note}>
        Alterações persistentes de preferências serão feitas por endpoints autenticados; esta fase apresenta apenas o estado autorizado.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: darkTheme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: darkTheme.spacing.md,
  },
  copy: {
    flex: 1,
    gap: darkTheme.spacing.xs,
  },
  eyebrow: {
    ...darkTheme.typography.labelSmall,
    color: darkTheme.colors.brand.primary,
    letterSpacing: 1.2,
  },
  title: {
    ...darkTheme.typography.heading3,
    color: darkTheme.colors.text.primary,
  },
  rows: {
    gap: darkTheme.spacing.md,
  },
  row: {
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
    textAlign: 'right',
    color: darkTheme.colors.text.primary,
  },
  note: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
});
