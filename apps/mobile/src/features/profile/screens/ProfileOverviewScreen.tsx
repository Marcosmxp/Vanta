import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { releaseMetadata } from '../../../app/config/releaseMetadata';
import { useI18n } from '../../../core/i18n';
import { Badge, Button, SystemState, darkTheme } from '../../../design-system';
import { ProfileIdentityCard } from '../components/ProfileIdentityCard';
import { ProfileLanguageCard } from '../components/ProfileLanguageCard';
import { ProfileMenuCard, type ProfileDestination } from '../components/ProfileMenuCard';
import { ProfilePreferencesCard } from '../components/ProfilePreferencesCard';
import { ProfileVerificationCard } from '../components/ProfileVerificationCard';
import { disconnectedProfileSnapshot } from '../provider/ProfileProvider';
import type { ProfileSnapshot } from '../types';

export interface ProfileOverviewScreenProps {
  snapshot?: ProfileSnapshot;
  onOpenDestination: (destination: ProfileDestination) => void;
  onSignOut?: () => void;
}

export function ProfileOverviewScreen({
  snapshot = disconnectedProfileSnapshot,
  onOpenDestination,
  onSignOut,
}: ProfileOverviewScreenProps) {
  const { t } = useI18n();
  const ready = snapshot.availability === 'ready';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>{t('profile.eyebrow')}</Text>
            <Text style={styles.title}>{t('profile.title')}</Text>
            <Text style={styles.subtitle}>{t('profile.subtitle')}</Text>
          </View>
          <Badge label="18+" tone="neutral" />
        </View>

        {ready ? (
          <>
            <ProfileIdentityCard snapshot={snapshot} />
            <ProfileVerificationCard snapshot={snapshot} />
            <ProfilePreferencesCard snapshot={snapshot} />
          </>
        ) : (
          <SystemState
            kind="error"
            title={t('profile.unavailableTitle')}
            description={t('profile.unavailableDescription')}
          />
        )}

        <ProfileLanguageCard />
        <ProfileMenuCard onOpenDestination={onOpenDestination} />

        <View style={styles.sessionSection}>
          <Text style={styles.eyebrow}>{t('profile.session')}</Text>
          <Button
            label={t('profile.signOut')}
            variant="secondary"
            fullWidth
            disabled={!onSignOut}
            onPress={onSignOut}
          />
          <Text style={styles.sessionNote}>{t('profile.sessionNote')}</Text>
        </View>

        <View style={styles.buildSection} accessibilityLabel={`Vanta ${releaseMetadata.releaseVersion}, build ${releaseMetadata.buildNumber}`}>
          <Text style={styles.eyebrow}>{t('profile.about')}</Text>
          <Text style={styles.buildVersion}>Vanta {releaseMetadata.releaseVersion}</Text>
          <Text style={styles.buildMeta}>
            Build {releaseMetadata.buildNumber} · {releaseMetadata.channel.toUpperCase()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: darkTheme.colors.background.app },
  content: {
    paddingHorizontal: darkTheme.spacing.lg,
    paddingTop: darkTheme.spacing.lg,
    paddingBottom: darkTheme.spacing['4xl'],
    gap: darkTheme.spacing.xl,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: darkTheme.spacing.md },
  headerCopy: { flex: 1, gap: darkTheme.spacing.sm },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.3 },
  title: { ...darkTheme.typography.heading1, color: darkTheme.colors.text.primary },
  subtitle: { ...darkTheme.typography.bodyLarge, color: darkTheme.colors.text.secondary },
  sessionSection: { gap: darkTheme.spacing.md },
  sessionNote: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  buildSection: { alignItems: 'center', gap: darkTheme.spacing.xs },
  buildVersion: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  buildMeta: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled },
});
