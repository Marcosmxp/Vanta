import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AuthStackParamList } from '../../../app/navigation/types';
import { useI18n } from '../../../core/i18n';
import { Button, Card, darkTheme } from '../../../design-system';
import { AuthScreenLayout } from '../components/AuthScreenLayout';
import { OnboardingSlide } from '../components/OnboardingSlide';

type SplashProps = NativeStackScreenProps<AuthStackParamList, 'Splash'>;
type OnboardingOneProps = NativeStackScreenProps<AuthStackParamList, 'OnboardingOne'>;
type OnboardingTwoProps = NativeStackScreenProps<AuthStackParamList, 'OnboardingTwo'>;
type OnboardingThreeProps = NativeStackScreenProps<AuthStackParamList, 'OnboardingThree'>;
type EligibilityProps = NativeStackScreenProps<AuthStackParamList, 'Eligibility'>;
type WelcomeProps = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export function SplashScreen({ navigation }: SplashProps) {
  const { t } = useI18n();
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('OnboardingOne'), 900);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.splash}>
      <View style={styles.brandMark} />
      <Text style={styles.brand}>VANTA</Text>
      <Text style={styles.tagline}>{t('auth.splashTagline')}</Text>
    </SafeAreaView>
  );
}

export function OnboardingOneScreen({ navigation }: OnboardingOneProps) {
  const { t } = useI18n();
  return (
    <OnboardingSlide
      step={1}
      eyebrow={t('auth.onboarding1.eyebrow')}
      title={t('auth.onboarding1.title')}
      description={t('auth.onboarding1.description')}
      highlight={t('auth.onboarding1.highlight')}
      onContinue={() => navigation.navigate('OnboardingTwo')}
      onSkip={() => navigation.navigate('Eligibility')}
    />
  );
}

export function OnboardingTwoScreen({ navigation }: OnboardingTwoProps) {
  const { t } = useI18n();
  return (
    <OnboardingSlide
      step={2}
      eyebrow={t('auth.onboarding2.eyebrow')}
      title={t('auth.onboarding2.title')}
      description={t('auth.onboarding2.description')}
      highlight={t('auth.onboarding2.highlight')}
      onContinue={() => navigation.navigate('OnboardingThree')}
      onSkip={() => navigation.navigate('Eligibility')}
    />
  );
}

export function OnboardingThreeScreen({ navigation }: OnboardingThreeProps) {
  const { t } = useI18n();
  return (
    <OnboardingSlide
      step={3}
      eyebrow={t('auth.onboarding3.eyebrow')}
      title={t('auth.onboarding3.title')}
      description={t('auth.onboarding3.description')}
      highlight={t('auth.onboarding3.highlight')}
      onContinue={() => navigation.navigate('Eligibility')}
    />
  );
}

export function AgeEligibilityScreen({ navigation }: EligibilityProps) {
  const { t } = useI18n();
  const [confirmed, setConfirmed] = useState(false);

  return (
    <AuthScreenLayout
      eyebrow={t('auth.eligibility.eyebrow')}
      title={t('auth.eligibility.title')}
      description={t('auth.eligibility.description')}
      footer={<Button label={t('auth.onboarding.continue')} fullWidth disabled={!confirmed} onPress={() => navigation.navigate('Welcome')} />}
    >
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: confirmed }} onPress={() => setConfirmed((value) => !value)}>
        <Card elevated style={[styles.eligibilityCard, confirmed && styles.eligibilityCardSelected]}>
          <View style={[styles.checkbox, confirmed && styles.checkboxSelected]}>
            {confirmed ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <View style={styles.eligibilityCopy}>
            <Text style={styles.eligibilityTitle}>{t('auth.eligibility.checkTitle')}</Text>
            <Text style={styles.eligibilityDescription}>{t('auth.eligibility.checkDescription')}</Text>
          </View>
        </Card>
      </Pressable>
      <Text style={styles.legalNote}>{t('auth.eligibility.legal')}</Text>
    </AuthScreenLayout>
  );
}

export function AuthWelcomeScreen({ navigation }: WelcomeProps) {
  const { t } = useI18n();
  return (
    <AuthScreenLayout
      eyebrow={t('auth.welcome.eyebrow')}
      title={t('auth.welcome.title')}
      description={t('auth.welcome.description')}
      centered
    >
      <View style={styles.welcomeBrand}>
        <View style={styles.brandMark} />
        <Text style={styles.welcomeWordmark}>VANTA</Text>
      </View>
      <View style={styles.actions}>
        <Button label={t('auth.welcome.signIn')} fullWidth onPress={() => navigation.navigate('Login')} />
        <Button label={t('auth.welcome.create')} variant="secondary" fullWidth onPress={() => navigation.navigate('CreateAccount')} />
      </View>
      <Text style={styles.legalNote}>{t('auth.welcome.note')}</Text>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: darkTheme.spacing.md, backgroundColor: darkTheme.colors.background.deep },
  brandMark: { width: 44, height: 6, borderRadius: darkTheme.radius.full, backgroundColor: darkTheme.colors.brand.primary },
  brand: { ...darkTheme.typography.brandWordmark, color: darkTheme.colors.text.primary },
  tagline: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  eligibilityCard: { flexDirection: 'row', alignItems: 'flex-start', gap: darkTheme.spacing.lg },
  eligibilityCardSelected: { borderColor: darkTheme.colors.brand.primary },
  checkbox: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: darkTheme.colors.border.strong, borderRadius: darkTheme.radius.sm },
  checkboxSelected: { borderColor: darkTheme.colors.brand.primary, backgroundColor: darkTheme.colors.brand.primary },
  checkmark: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.onBrand },
  eligibilityCopy: { flex: 1, gap: darkTheme.spacing.xs },
  eligibilityTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  eligibilityDescription: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  welcomeBrand: { alignItems: 'flex-start', gap: darkTheme.spacing.sm, marginBottom: darkTheme.spacing.lg },
  welcomeWordmark: { ...darkTheme.typography.brandWordmark, color: darkTheme.colors.text.primary },
  actions: { gap: darkTheme.spacing.sm },
  legalNote: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
});
