import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, SystemState, darkTheme } from '../../../design-system';
import { ProfileIdentityCard } from '../components/ProfileIdentityCard';
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
  const ready = snapshot.availability === 'ready';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>PERFIL</Text>
            <Text style={styles.title}>A sua conta Vanta.</Text>
            <Text style={styles.subtitle}>
              Identidade, verificação e preferências apresentadas a partir do estado autenticado do servidor.
            </Text>
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
            title="Perfil indisponível"
            description={snapshot.message ?? 'Os dados da conta só serão apresentados depois de confirmados pela API autenticada.'}
          />
        )}

        <ProfileMenuCard onOpenDestination={onOpenDestination} />

        <View style={styles.sessionSection}>
          <Text style={styles.eyebrow}>SESSÃO</Text>
          <Button
            label="Terminar sessão"
            variant="secondary"
            fullWidth
            disabled={!onSignOut}
            onPress={onSignOut}
          />
          <Text style={styles.sessionNote}>
            O logout real só será ativado quando o session coordinator puder revogar refresh tokens e encerrar a sessão no backend.
          </Text>
        </View>

        <Text style={styles.footerNote}>
          Dados legais completos, documentos KYC e segredos de autenticação não pertencem ao read model desta tela.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: darkTheme.colors.background.app,
  },
  content: {
    paddingHorizontal: darkTheme.spacing.lg,
    paddingTop: darkTheme.spacing.lg,
    paddingBottom: darkTheme.spacing['4xl'],
    gap: darkTheme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: darkTheme.spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: darkTheme.spacing.sm,
  },
  eyebrow: {
    ...darkTheme.typography.labelSmall,
    color: darkTheme.colors.brand.primary,
    letterSpacing: 1.3,
  },
  title: {
    ...darkTheme.typography.heading1,
    color: darkTheme.colors.text.primary,
  },
  subtitle: {
    ...darkTheme.typography.bodyLarge,
    color: darkTheme.colors.text.secondary,
  },
  sessionSection: {
    gap: darkTheme.spacing.md,
  },
  sessionNote: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
  footerNote: {
    ...darkTheme.typography.caption,
    textAlign: 'center',
    color: darkTheme.colors.text.disabled,
  },
});
