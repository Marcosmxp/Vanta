import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, darkTheme } from '../../../design-system';
import type { AuthStackParamList } from '../../../app/navigation/types';
import { AuthScreenLayout } from '../components/AuthScreenLayout';
import { OnboardingSlide } from '../components/OnboardingSlide';

type SplashProps = NativeStackScreenProps<AuthStackParamList, 'Splash'>;
type OnboardingOneProps = NativeStackScreenProps<AuthStackParamList, 'OnboardingOne'>;
type OnboardingTwoProps = NativeStackScreenProps<AuthStackParamList, 'OnboardingTwo'>;
type OnboardingThreeProps = NativeStackScreenProps<AuthStackParamList, 'OnboardingThree'>;
type EligibilityProps = NativeStackScreenProps<AuthStackParamList, 'Eligibility'>;
type WelcomeProps = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export function SplashScreen({ navigation }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('OnboardingOne'), 900);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.splash}>
      <View style={styles.brandMark} />
      <Text style={styles.brand}>VANTA</Text>
      <Text style={styles.tagline}>Jogue com controlo.</Text>
    </SafeAreaView>
  );
}

export function OnboardingOneScreen({ navigation }: OnboardingOneProps) {
  return (
    <OnboardingSlide
      step={1}
      eyebrow="Jogo"
      title="Uma experiência direta, sem ruído."
      description="Jogos próprios, controlo claro da aposta e informação importante sempre visível."
      highlight="Aposta simples. Resultado transparente."
      onContinue={() => navigation.navigate('OnboardingTwo')}
      onSkip={() => navigation.navigate('Eligibility')}
    />
  );
}

export function OnboardingTwoScreen({ navigation }: OnboardingTwoProps) {
  return (
    <OnboardingSlide
      step={2}
      eyebrow="Carteira"
      title="Dinheiro exige clareza."
      description="Depósitos, levantamentos, histórico e limites ficam separados da experiência de jogo."
      highlight="Cada movimento deve ser rastreável."
      onContinue={() => navigation.navigate('OnboardingThree')}
      onSkip={() => navigation.navigate('Eligibility')}
    />
  );
}

export function OnboardingThreeScreen({ navigation }: OnboardingThreeProps) {
  return (
    <OnboardingSlide
      step={3}
      eyebrow="Controlo"
      title="Jogar também significa saber parar."
      description="Limites, pausas e autoexclusão fazem parte do produto, não ficam escondidos em definições."
      highlight="O controlo permanece consigo."
      onContinue={() => navigation.navigate('Eligibility')}
    />
  );
}

export function AgeEligibilityScreen({ navigation }: EligibilityProps) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <AuthScreenLayout
      eyebrow="Elegibilidade"
      title="Confirme a sua idade"
      description="A Vanta destina-se exclusivamente a adultos. A verificação definitiva será realizada pelos serviços de identidade e compliance."
      footer={<Button label="Continuar" fullWidth disabled={!confirmed} onPress={() => navigation.navigate('Welcome')} />}
    >
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: confirmed }}
        onPress={() => setConfirmed((value) => !value)}
      >
        <Card elevated style={[styles.eligibilityCard, confirmed && styles.eligibilityCardSelected]}>
          <View style={[styles.checkbox, confirmed && styles.checkboxSelected]}>
            {confirmed ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <View style={styles.eligibilityCopy}>
            <Text style={styles.eligibilityTitle}>Tenho 18 anos ou mais</Text>
            <Text style={styles.eligibilityDescription}>
              Compreendo que a confirmação nesta tela não substitui KYC nem verificação legal de idade.
            </Text>
          </View>
        </Card>
      </Pressable>

      <Text style={styles.legalNote}>
        Se não cumprir a idade mínima aplicável à sua jurisdição, não continue.
      </Text>
    </AuthScreenLayout>
  );
}

export function AuthWelcomeScreen({ navigation }: WelcomeProps) {
  return (
    <AuthScreenLayout
      eyebrow="Vanta"
      title="Acesso seguro à sua conta"
      description="Entre numa conta existente ou crie uma nova. A autenticação real será sempre validada pelo servidor."
      centered
    >
      <View style={styles.welcomeBrand}>
        <View style={styles.brandMark} />
        <Text style={styles.welcomeWordmark}>VANTA</Text>
      </View>

      <View style={styles.actions}>
        <Button label="Entrar" fullWidth onPress={() => navigation.navigate('Login')} />
        <Button
          label="Criar conta"
          variant="secondary"
          fullWidth
          onPress={() => navigation.navigate('CreateAccount')}
        />
      </View>

      <Text style={styles.legalNote}>
        Ao continuar, poderá ser necessário concluir identidade, idade, localização e requisitos de jogo responsável antes de qualquer operação com dinheiro real.
      </Text>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: darkTheme.spacing.md,
    backgroundColor: darkTheme.colors.background.deep,
  },
  brandMark: {
    width: 44,
    height: 6,
    borderRadius: darkTheme.radius.full,
    backgroundColor: darkTheme.colors.brand.primary,
  },
  brand: {
    ...darkTheme.typography.brandWordmark,
    color: darkTheme.colors.text.primary,
  },
  tagline: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
  },
  eligibilityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: darkTheme.spacing.lg,
  },
  eligibilityCardSelected: {
    borderColor: darkTheme.colors.brand.primary,
  },
  checkbox: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: darkTheme.colors.border.strong,
    borderRadius: darkTheme.radius.sm,
  },
  checkboxSelected: {
    borderColor: darkTheme.colors.brand.primary,
    backgroundColor: darkTheme.colors.brand.primary,
  },
  checkmark: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.text.onBrand,
  },
  eligibilityCopy: {
    flex: 1,
    gap: darkTheme.spacing.xs,
  },
  eligibilityTitle: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.text.primary,
  },
  eligibilityDescription: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
  },
  welcomeBrand: {
    alignItems: 'flex-start',
    gap: darkTheme.spacing.sm,
    marginBottom: darkTheme.spacing.lg,
  },
  welcomeWordmark: {
    ...darkTheme.typography.brandWordmark,
    color: darkTheme.colors.text.primary,
  },
  actions: {
    gap: darkTheme.spacing.sm,
  },
  legalNote: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
});
