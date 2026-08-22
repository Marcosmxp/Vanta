import { StyleSheet, Text, View } from 'react-native';

import { Button, Card, darkTheme } from '../../../design-system';
import { AuthScreenLayout } from './AuthScreenLayout';

export interface OnboardingSlideProps {
  step: 1 | 2 | 3;
  eyebrow: string;
  title: string;
  description: string;
  highlight: string;
  onContinue: () => void;
  onSkip?: () => void;
}

export function OnboardingSlide({
  step,
  eyebrow,
  title,
  description,
  highlight,
  onContinue,
  onSkip,
}: OnboardingSlideProps) {
  return (
    <AuthScreenLayout
      eyebrow={eyebrow}
      title={title}
      description={description}
      footer={
        <View style={styles.actions}>
          <Button label={step === 3 ? 'Continuar' : 'Próximo'} fullWidth onPress={onContinue} />
          {onSkip ? <Button label="Saltar introdução" variant="ghost" fullWidth onPress={onSkip} /> : null}
        </View>
      }
    >
      <Card elevated>
        <View style={styles.visual}>
          <Text style={styles.step}>0{step}</Text>
          <View style={styles.accent} />
          <Text style={styles.highlight}>{highlight}</Text>
        </View>
      </Card>

      <View style={styles.progress} accessibilityLabel={`Passo ${step} de 3`}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={[styles.dot, item === step && styles.activeDot]} />
        ))}
      </View>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  visual: {
    minHeight: 280,
    justifyContent: 'flex-end',
    gap: darkTheme.spacing.lg,
  },
  step: {
    ...darkTheme.typography.display,
    color: darkTheme.colors.text.disabled,
  },
  accent: {
    width: 56,
    height: 4,
    borderRadius: darkTheme.radius.full,
    backgroundColor: darkTheme.colors.brand.primary,
  },
  highlight: {
    ...darkTheme.typography.heading2,
    color: darkTheme.colors.text.primary,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: darkTheme.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: darkTheme.radius.full,
    backgroundColor: darkTheme.colors.border.strong,
  },
  activeDot: {
    width: 28,
    backgroundColor: darkTheme.colors.brand.primary,
  },
  actions: {
    gap: darkTheme.spacing.sm,
  },
});
