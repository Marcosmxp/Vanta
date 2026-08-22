import { StyleSheet, Text, View } from 'react-native';

import { Badge, Card, darkTheme } from '../../../design-system';
import type { ProfileSnapshot } from '../types';

export interface ProfileVerificationCardProps {
  snapshot: ProfileSnapshot;
}

function kycLabel(status: ProfileSnapshot['verification']['kycStatus']) {
  switch (status) {
    case 'verified':
      return 'Verificado';
    case 'pending':
      return 'Em análise';
    case 'required':
      return 'Necessário';
    case 'rejected':
      return 'Rever';
  }
}

function accountLabel(status: ProfileSnapshot['verification']['accountStatus']) {
  switch (status) {
    case 'active':
      return 'Ativa';
    case 'restricted':
      return 'Restrita';
    case 'blocked':
      return 'Bloqueada';
  }
}

export function ProfileVerificationCard({ snapshot }: ProfileVerificationCardProps) {
  const { verification } = snapshot;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>VERIFICAÇÃO</Text>
          <Text style={styles.title}>Estado da conta</Text>
        </View>
        <Badge
          label={accountLabel(verification.accountStatus)}
          tone={verification.accountStatus === 'active' ? 'success' : verification.accountStatus === 'blocked' ? 'danger' : 'warning'}
        />
      </View>

      <View style={styles.rows}>
        <View style={styles.row}>
          <Text style={styles.label}>Identidade (KYC)</Text>
          <Badge
            label={kycLabel(verification.kycStatus)}
            tone={verification.kycStatus === 'verified' ? 'success' : verification.kycStatus === 'rejected' ? 'danger' : 'warning'}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Idade +18</Text>
          <Badge
            label={verification.ageVerified === true ? 'Confirmada' : verification.ageVerified === false ? 'Não confirmada' : 'Indisponível'}
            tone={verification.ageVerified === true ? 'success' : verification.ageVerified === false ? 'danger' : 'neutral'}
          />
        </View>
      </View>

      <Text style={styles.note}>
        Estes estados são apresentados pelo servidor. A interface não aprova KYC, idade ou elegibilidade localmente.
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
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.md,
  },
  label: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.primary,
  },
  note: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
});
