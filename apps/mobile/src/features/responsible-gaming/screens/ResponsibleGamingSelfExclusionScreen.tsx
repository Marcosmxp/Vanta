import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, darkTheme } from '../../../design-system';
import { disconnectedResponsibleGamingSnapshot } from '../provider/ResponsibleGamingProvider';
import type { ResponsibleGamingSnapshot } from '../types';

export interface ResponsibleGamingSelfExclusionScreenProps {
  snapshot?: ResponsibleGamingSnapshot;
  onStartSelfExclusion?: (optionId: string) => void;
}

export function ResponsibleGamingSelfExclusionScreen({
  snapshot = disconnectedResponsibleGamingSnapshot,
  onStartSelfExclusion,
}: ResponsibleGamingSelfExclusionScreenProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const active = snapshot.selfExclusion;
  const canStart =
    snapshot.availability === 'ready' && snapshot.policy.canSelfExclude && !active && Boolean(onStartSelfExclusion);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>AUTOEXCLUSÃO</Text>
          <Text style={styles.title}>Bloqueio de proteção reforçada</Text>
          <Text style={styles.subtitle}>
            A autoexclusão deve ser tratada como uma restrição forte. O aplicativo não oferece reversão antecipada nem ignora o estado devolvido pelo servidor.
          </Text>
        </View>

        {active ? (
          <Card style={styles.activeCard}>
            <Text style={styles.activeTitle}>Autoexclusão ativa</Text>
            <Text style={styles.activeText}>{active.label}</Text>
            <Text style={styles.activeText}>Início: {new Date(active.startedAt).toLocaleString('pt-PT')}</Text>
            <Text style={styles.activeText}>
              Fim: {active.endsAt ? new Date(active.endsAt).toLocaleString('pt-PT') : 'Sem data de término apresentada'}
            </Text>
          </Card>
        ) : snapshot.policy.selfExclusionOptions.length === 0 ? (
          <Card style={styles.activeCard}>
            <Text style={styles.activeTitle}>Opções indisponíveis</Text>
            <Text style={styles.activeText}>
              {snapshot.message ?? 'As opções de autoexclusão serão carregadas pela API autenticada.'}
            </Text>
          </Card>
        ) : (
          <View style={styles.options}>
            {snapshot.policy.selfExclusionOptions.map((option) => {
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

        {!active ? (
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: acknowledged, disabled: !canStart }}
            disabled={!canStart}
            onPress={() => setAcknowledged((current) => !current)}
            style={[styles.acknowledgement, !canStart && styles.optionDisabled]}
          >
            <View style={[styles.checkbox, acknowledged && styles.checkboxChecked]}>
              {acknowledged ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={styles.acknowledgementText}>
              Compreendo que este pedido cria uma restrição server-side e que o aplicativo não disponibiliza cancelamento antecipado.
            </Text>
          </Pressable>
        ) : null}

        <Button
          label="Confirmar autoexclusão"
          fullWidth
          variant="danger"
          disabled={!canStart || !selectedOptionId || !acknowledged}
          onPress={() => selectedOptionId && acknowledged && onStartSelfExclusion?.(selectedOptionId)}
        />

        <Text style={styles.footer}>
          A confirmação final, o período aplicável e o enforcement pertencem ao backend e às políticas regulatórias configuradas.
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
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.status.danger, letterSpacing: 1.3 },
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
  optionSelected: { borderColor: darkTheme.colors.status.danger, backgroundColor: darkTheme.colors.surface.raised },
  optionDisabled: { opacity: 0.5 },
  optionTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  optionDescription: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  acknowledgement: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: darkTheme.spacing.md,
    borderWidth: 1,
    borderColor: darkTheme.colors.border.default,
    borderRadius: darkTheme.radius.md,
    padding: darkTheme.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: darkTheme.radius.sm,
    borderWidth: 1,
    borderColor: darkTheme.colors.border.strong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: darkTheme.colors.status.danger, borderColor: darkTheme.colors.status.danger },
  checkmark: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.onBrand },
  acknowledgementText: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary, flex: 1 },
  footer: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled, textAlign: 'center' },
});
