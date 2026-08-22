import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, darkTheme } from '../../../design-system';
import { ActivityPreview } from '../components/ActivityPreview';
import { FeaturedGameCard } from '../components/FeaturedGameCard';
import { ResponsibleGamingBanner } from '../components/ResponsibleGamingBanner';
import { WalletSummaryCard } from '../components/WalletSummaryCard';
import { disconnectedHomeSnapshot } from '../provider/HomeProvider';

export interface HomeDashboardScreenProps {
  onOpenWallet: () => void;
  onOpenPlay: () => void;
  onOpenProfile: () => void;
  onOpenBetHistory?: () => void;
}

export function HomeDashboardScreen({
  onOpenWallet,
  onOpenPlay,
  onOpenProfile,
  onOpenBetHistory,
}: HomeDashboardScreenProps) {
  const snapshot = disconnectedHomeSnapshot;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.brandGroup}>
            <Text style={styles.brand}>VANTA</Text>
            <Badge label="18+" tone="neutral" />
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir perfil"
            onPress={onOpenProfile}
            style={({ pressed }) => [styles.profileButton, pressed && styles.pressed]}
          >
            <Text style={styles.profileInitial}>V</Text>
          </Pressable>
        </View>

        <View style={styles.intro}>
          <Text style={styles.eyebrow}>INÍCIO</Text>
          <Text style={styles.heading}>Tudo num só lugar.</Text>
          <Text style={styles.subtitle}>
            Aceda à carteira, aos jogos e à atividade recente com uma interface focada e transparente.
          </Text>
        </View>

        <WalletSummaryCard wallet={snapshot.wallet} onOpenWallet={onOpenWallet} />

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.eyebrow}>EM DESTAQUE</Text>
            <Text style={styles.sectionTitle}>Jogar agora</Text>
          </View>
          <View style={styles.liveDot} />
        </View>

        <FeaturedGameCard game={snapshot.featuredGame} onPlay={onOpenPlay} />

        <ActivityPreview
          items={snapshot.recentActivity}
          onOpenBetHistory={onOpenBetHistory}
        />

        <ResponsibleGamingBanner />

        <Text style={styles.footerNote}>
          Saldos, apostas, elegibilidade e limites apresentados pelo Vanta devem sempre refletir estado autorizado pelo servidor.
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
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.md,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.md,
  },
  brand: {
    ...darkTheme.typography.brandWordmark,
    fontSize: 22,
    lineHeight: 28,
    color: darkTheme.colors.text.primary,
  },
  profileButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: darkTheme.radius.full,
    borderWidth: 1,
    borderColor: darkTheme.colors.border.default,
    backgroundColor: darkTheme.colors.surface.raised,
  },
  profileInitial: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.brand.primary,
  },
  intro: {
    gap: darkTheme.spacing.sm,
    paddingTop: darkTheme.spacing.sm,
  },
  eyebrow: {
    ...darkTheme.typography.labelSmall,
    color: darkTheme.colors.brand.primary,
    letterSpacing: 1.4,
  },
  heading: {
    ...darkTheme.typography.heading1,
    color: darkTheme.colors.text.primary,
  },
  subtitle: {
    ...darkTheme.typography.bodyLarge,
    color: darkTheme.colors.text.secondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.md,
  },
  sectionTitle: {
    ...darkTheme.typography.heading3,
    color: darkTheme.colors.text.primary,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: darkTheme.radius.full,
    backgroundColor: darkTheme.colors.brand.primary,
    ...darkTheme.shadows.brandGlow,
  },
  footerNote: {
    ...darkTheme.typography.caption,
    textAlign: 'center',
    color: darkTheme.colors.text.disabled,
  },
  pressed: {
    opacity: 0.75,
  },
});
