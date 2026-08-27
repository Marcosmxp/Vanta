import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useI18n } from '../../../core/i18n';
import { Badge, darkTheme } from '../../../design-system';
import { ActivityPreview } from '../components/ActivityPreview';
import { FeaturedGameCard } from '../components/FeaturedGameCard';
import { ResponsibleGamingBanner } from '../components/ResponsibleGamingBanner';
import { WalletSummaryCard } from '../components/WalletSummaryCard';
import { disconnectedHomeSnapshot } from '../provider/HomeProvider';
import type { HomeSnapshot } from '../types';

export interface HomeDashboardScreenProps {
  snapshot?: HomeSnapshot;
  onOpenWallet: () => void;
  onOpenPlay: () => void;
  onOpenProfile: () => void;
  onOpenBetHistory?: () => void;
}

export function HomeDashboardScreen({
  snapshot = disconnectedHomeSnapshot,
  onOpenWallet,
  onOpenPlay,
  onOpenProfile,
  onOpenBetHistory,
}: HomeDashboardScreenProps) {
  const { t } = useI18n();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandGroup}>
            <Text style={styles.brand}>VANTA</Text>
            <Badge label="18+" tone="neutral" />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('home.openProfile')}
            onPress={onOpenProfile}
            style={({ pressed }) => [styles.profileButton, pressed && styles.pressed]}
          >
            <Text style={styles.profileInitial}>V</Text>
          </Pressable>
        </View>

        <View style={styles.intro}>
          <Text style={styles.eyebrow}>{t('home.eyebrow')}</Text>
          <Text style={styles.heading}>{t('home.title')}</Text>
          <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
        </View>

        <WalletSummaryCard wallet={snapshot.wallet} onOpenWallet={onOpenWallet} />

        <View style={styles.sectionHeader}>
          <View style={styles.sectionCopy}>
            <Text style={styles.eyebrow}>{t('home.featuredEyebrow')}</Text>
            <Text style={styles.sectionTitle}>{t('home.featuredTitle')}</Text>
          </View>
          <View style={styles.liveDot} />
        </View>

        <FeaturedGameCard game={snapshot.featuredGame} onPlay={onOpenPlay} />
        <ActivityPreview items={snapshot.recentActivity} onOpenBetHistory={onOpenBetHistory} />
        <ResponsibleGamingBanner />
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  brandGroup: { flexDirection: 'row', alignItems: 'center', gap: darkTheme.spacing.md },
  brand: { ...darkTheme.typography.brandWordmark, fontSize: 22, lineHeight: 28, color: darkTheme.colors.text.primary },
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
  profileInitial: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.brand.primary },
  intro: { gap: darkTheme.spacing.sm, paddingTop: darkTheme.spacing.sm },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.4 },
  heading: { ...darkTheme.typography.heading1, color: darkTheme.colors.text.primary },
  subtitle: { ...darkTheme.typography.bodyLarge, color: darkTheme.colors.text.secondary },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  sectionCopy: { gap: darkTheme.spacing.xs },
  sectionTitle: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: darkTheme.radius.full,
    backgroundColor: darkTheme.colors.brand.primary,
    ...darkTheme.shadows.brandGlow,
  },
  pressed: { opacity: 0.75 },
});
