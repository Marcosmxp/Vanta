import { StyleSheet, Text, View } from 'react-native';

import { Badge, Button, Card, darkTheme } from '../../../design-system';
import type { MoneyLimitView, SessionLimitView } from '../types';
import { formatEuroMinor, limitPeriodLabel, moneyLimitKindLabel } from '../utils/format';

interface MoneyLimitCardProps {
  type: 'money';
  limit: MoneyLimitView;
  canRequestChange: boolean;
  onRequestChange?: () => void;
}

interface SessionLimitCardProps {
  type: 'session';
  limit: SessionLimitView;
  canRequestChange: boolean;
  onRequestChange?: () => void;
}

export type LimitCardProps = MoneyLimitCardProps | SessionLimitCardProps;

function formatPendingDate(value: string | null): string {
  if (!value) return 'Data definida pelo backend';
  return new Date(value).toLocaleString('pt-PT');
}

export function LimitCard(props: LimitCardProps) {
  const title = props.type === 'money' ? moneyLimitKindLabel(props.limit.kind) : 'Tempo de sessão';
  const subtitle = props.type === 'money' ? limitPeriodLabel(props.limit.period) : 'Por sessão';
  const currentValue =
    props.type === 'money' ? formatEuroMinor(props.limit.amountMinor) : `${props.limit.minutes} min`;
  const pending = props.limit.pendingChange;
  const pendingValue =
    props.type === 'money'
      ? props.limit.pendingChange
        ? formatEuroMinor(props.limit.pendingChange.requestedAmountMinor)
        : null
      : props.limit.pendingChange
        ? `${props.limit.pendingChange.requestedMinutes} min`
        : null;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Text style={styles.value}>{currentValue}</Text>
      </View>

      {pending && pendingValue ? (
        <View style={styles.pending}>
          <View style={styles.pendingHeader}>
            <Text style={styles.pendingTitle}>Alteração pendente</Text>
            <Badge label={pending.direction === 'increase' ? 'Aumento' : 'Redução'} tone="warning" />
          </View>
          <Text style={styles.pendingText}>Novo limite: {pendingValue}</Text>
          <Text style={styles.pendingText}>Vigência: {formatPendingDate(pending.effectiveAt)}</Text>
        </View>
      ) : null}

      <Button
        label="Pedir alteração"
        variant="secondary"
        size="small"
        disabled={!props.canRequestChange || !props.onRequestChange}
        onPress={props.onRequestChange}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: darkTheme.spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  copy: { flex: 1, gap: darkTheme.spacing.xs },
  title: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  subtitle: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  value: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  pending: {
    gap: darkTheme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border.default,
    paddingTop: darkTheme.spacing.md,
  },
  pendingHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: darkTheme.spacing.sm },
  pendingTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  pendingText: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
});
