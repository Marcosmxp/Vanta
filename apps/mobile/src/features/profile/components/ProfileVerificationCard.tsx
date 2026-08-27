import { StyleSheet, Text, View } from 'react-native';

import { useI18n, type TranslationKey } from '../../../core/i18n';
import { Badge, Card, darkTheme } from '../../../design-system';
import type { ProfileSnapshot } from '../types';

export interface ProfileVerificationCardProps {
  snapshot: ProfileSnapshot;
}

const kycKeys: Record<ProfileSnapshot['verification']['kycStatus'], TranslationKey> = {
  verified: 'profile.kyc.verified',
  pending: 'profile.kyc.pending',
  required: 'profile.kyc.required',
  rejected: 'profile.kyc.rejected',
};

const accountKeys: Record<ProfileSnapshot['verification']['accountStatus'], TranslationKey> = {
  active: 'profile.account.active',
  restricted: 'profile.account.restricted',
  blocked: 'profile.account.blocked',
};

export function ProfileVerificationCard({ snapshot }: ProfileVerificationCardProps) {
  const { t } = useI18n();
  const { verification } = snapshot;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>{t('profile.verificationEyebrow')}</Text>
          <Text style={styles.title}>{t('profile.verificationTitle')}</Text>
        </View>
        <Badge
          label={t(accountKeys[verification.accountStatus])}
          tone={verification.accountStatus === 'active' ? 'success' : verification.accountStatus === 'blocked' ? 'danger' : 'warning'}
        />
      </View>

      <View style={styles.rows}>
        <View style={styles.row}>
          <Text style={styles.label}>{t('profile.verificationIdentity')}</Text>
          <Badge
            label={t(kycKeys[verification.kycStatus])}
            tone={verification.kycStatus === 'verified' ? 'success' : verification.kycStatus === 'rejected' ? 'danger' : 'warning'}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{t('profile.verificationAge')}</Text>
          <Badge
            label={verification.ageVerified === true ? t('profile.age.confirmed') : verification.ageVerified === false ? t('profile.age.unconfirmed') : t('profile.age.unavailable')}
            tone={verification.ageVerified === true ? 'success' : verification.ageVerified === false ? 'danger' : 'neutral'}
          />
        </View>
      </View>

      <Text style={styles.note}>{t('profile.verificationNote')}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: darkTheme.spacing.lg },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: darkTheme.spacing.md },
  copy: { flex: 1, gap: darkTheme.spacing.xs },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.2 },
  title: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  rows: { gap: darkTheme.spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  label: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.primary },
  note: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
});
