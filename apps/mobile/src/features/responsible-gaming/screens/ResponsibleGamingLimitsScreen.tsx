import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, darkTheme } from '../../../design-system';
import { LimitCard } from '../components/LimitCard';
import { disconnectedResponsibleGamingSnapshot } from '../provider/ResponsibleGamingProvider';
import type { ResponsibleGamingSnapshot } from '../types';

export interface ResponsibleGamingLimitsScreenProps {
  snapshot?: ResponsibleGamingSnapshot;
  onRequestMoneyLimitChange?: (limitId: string) => void;
  onRequestSessionLimitChange?: () => void;
}

export function ResponsibleGamingLimitsScreen({
  snapshot = disconnectedResponsibleGamingSnapshot,
  onRequestMoneyLimitChange,
  onRequestSessionLimitChange,
}: ResponsibleGamingLimitsScreenProps) {
  const canRequest = snapshot.availability === 'ready' && snapshot.policy.canRequestLimitChange;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>LIMITES PESSOAIS</Text>
          <Text style={styles.title}>Defina barreiras antes de jogar</Text>
          <Text style={styles.subtitle}>
            O servidor mantém o valor efetivo e qualquer alteração pendente. A tela nunca assume que um pedido já entrou em vigor.
          </Text>
        </View>

        {snapshot.limits.length === 0 && !snapshot.sessionLimit ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Limites indisponíveis</Text>
            <Text style={styles.emptyText}>
              {snapshot.message ?? 'Os limites serão carregados quando a API autenticada estiver disponível.'}
            </Text>
          </Card>
        ) : (
          <View style={styles.list}>
            {snapshot.limits.map((limit) => (
              <LimitCard
                key={limit.limitId}
                type="money"
                limit={limit}
                canRequestChange={canRequest}
                onRequestChange={onRequestMoneyLimitChange ? () => onRequestMoneyLimitChange(limit.limitId) : undefined}
              />
            ))}

            {snapshot.sessionLimit ? (
              <LimitCard
                type="session"
                limit={snapshot.sessionLimit}
                canRequestChange={canRequest}
                onRequestChange={onRequestSessionLimitChange}
              />
            ) : null}
          </View>
        )}

        <Card style={styles.policyCard}>
          <Text style={styles.policyTitle}>Alterações mais permissivas</Text>
          <Text style={styles.policyText}>
            Se a política exigir um período de reflexão, o backend devolverá uma alteração pendente com a data efetiva. O cliente não pode antecipá-la.
          </Text>
        </Card>
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
  list: { gap: darkTheme.spacing.md },
  emptyCard: { gap: darkTheme.spacing.sm },
  emptyTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  emptyText: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  policyCard: { gap: darkTheme.spacing.sm },
  policyTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  policyText: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
});
