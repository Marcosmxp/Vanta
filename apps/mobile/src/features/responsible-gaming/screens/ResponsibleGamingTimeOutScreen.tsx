import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, darkTheme } from '../../../design-system';
import { disconnectedResponsibleGamingSnapshot } from '../provider/ResponsibleGamingProvider';
import type { ResponsibleGamingSnapshot } from '../types';

export interface ResponsibleGamingTimeOutScreenProps {
  snapshot?: ResponsibleGamingSnapshot;
  onStartTimeOut?: (optionId: string) => void;
}

export function ResponsibleGamingTimeOutScreen({
  snapshot = disconnectedResponsibleGamingSnapshot,
  onStartTimeOut,
}: ResponsibleGamingTimeOutScreenProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const active = snapshot.activeTimeOut;
  const canStart =
    snapshot.availability === 'ready' && snapshot.policy.canStartTimeOut && !active && Boolean(onStartTimeOut);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>TIME-OUT</Text>
          <Text style={styles.title}>Faça uma pausa temporária</Text>
          <Text style={styles.subtitle}>
            Escolha apenas entre períodos disponibilizados pela política do servidor. O cliente não inventa durações e não oferece cancelamento antecipado.
          </Text>
        </View>

        {active ? (
          <Card style={styles.activeCard}>
            <Text style={styles.activeTitle}>Time-out já ativo</Text>
            <Text style={styles.activeText}>{active.label}</Text>
            <Text style={styles.activeText}>Início: {new Date(active.startedAt).toLocaleString('pt-PT')}</Text>
            <Text style={styles.activeText}>
              Fim: {active.endsAt ? new Date(active.endsAt).toLocaleString('pt-PT') : 'Definido pelo backend'}
            </Text>
          </Card>
        ) : snapshot.policy.timeOutOptions.length === 0 ? (
          <Card style={styles.activeCard}>
            <Text style={styles.activeTitle}>Opções indisponíveis</Text>
            <Text style={styles.activeText}>
              {snapshot.message ?? 'As opções de time-out serão carregadas pela API autenticada.'}
            </Text>
          </Card>
        ) : (
          <View style={styles.options}>
            {snapshot.policy.timeOutOptions.map((option) => {
              const selected = selectedOptionId === option.optionId;
              return (
                <Pressable
                  key={option.optionId}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setSelectedOptionId(option.optionId)}
                  disabled={!canStart}
                  style={[styles.option, selected && styles.optionSelected, !canStart && styles.optionDisabled]}
                >
                  <Text style={styles.optionTitle}>{option.label}</Text>
                  {option.description ? <Text style={styles.optionDescription}>{option.description}</Text> : null}
                </Pressable>
              );
            })}
          </View>
        )}

        <Button
          label="Ativar time-out"
          fullWidth
          variant="primary"
          disabled={!canStart || !selectedOptionId}
          onPress={() => selectedOptionId && onStartTimeOut?.(selectedOptionId)}
        />

        <Text style={styles.footer}>
          Depois da confirmação server-side, operações sujeitas à proteção devem ser bloqueadas até o término autoritativo da pausa.
        </Text>
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
  header: { gap: darkTheme.spacing.sm },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.3 },
  title: { ...darkTheme.typography.heading1, color: darkTheme.colors.text.primary },
  subtitle: { ...darkTheme.typography.bodyLarge, color: darkTheme.colors.text.secondary },
  activeCard: { gap: darkTheme.spacing.sm },
  activeTitle: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  activeText: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  options: { gap: darkTheme.spacing.md },
  option: {
    gap: darkTheme.spacing.xs,
    borderWidth: 1,
    borderColor: darkTheme.colors.border.default,
    borderRadius: darkTheme.radius.lg,
    backgroundColor: darkTheme.colors.surface.default,
    padding: darkTheme.spacing.lg,
  },
  optionSelected: { borderColor: darkTheme.colors.brand.primary, backgroundColor: darkTheme.colors.surface.raised },
  optionDisabled: { opacity: 0.5 },
  optionTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  optionDescription: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  footer: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled, textAlign: 'center' },
});
