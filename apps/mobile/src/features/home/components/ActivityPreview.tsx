import { StyleSheet, Text, View } from 'react-native';

import { Badge, Card, darkTheme } from '../../../design-system';
import type { HomeActivityItem } from '../types';

export interface ActivityPreviewProps {
  items: readonly HomeActivityItem[];
}

function formatAmount(item: HomeActivityItem) {
  if (item.amountMinor === undefined || item.currency === undefined) return null;
  return `${(item.amountMinor / 100).toFixed(2).replace('.', ',')} €`;
}

function kindLabel(kind: HomeActivityItem['kind']) {
  switch (kind) {
    case 'bet':
      return 'Aposta';
    case 'deposit':
      return 'Depósito';
    case 'withdrawal':
      return 'Levantamento';
    case 'settlement':
      return 'Resultado';
  }
}

export function ActivityPreview({ items }: ActivityPreviewProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.eyebrow}>ATIVIDADE</Text>
          <Text style={styles.title}>Movimentos recentes</Text>
        </View>
        <Badge label={items.length > 0 ? `${items.length} recentes` : 'Sem movimentos'} tone="neutral" />
      </View>

      {items.length === 0 ? (
        <Card style={styles.emptyCard}>
          <View style={styles.emptyMark} />
          <View style={styles.emptyCopy}>
            <Text style={styles.emptyTitle}>Ainda não existe atividade</Text>
            <Text style={styles.emptyDescription}>
              Apostas e movimentos financeiros aparecerão aqui apenas depois de serem recebidos da API autenticada.
            </Text>
          </View>
        </Card>
      ) : (
        <View style={styles.list}>
          {items.slice(0, 3).map((item) => {
            const amount = formatAmount(item);
            return (
              <Card key={item.id} style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <Badge label={kindLabel(item.kind)} tone="neutral" />
                  {amount ? <Text style={styles.amount}>{amount}</Text> : null}
                </View>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.timestamp}>{item.occurredAt}</Text>
              </Card>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: darkTheme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.md,
  },
  eyebrow: {
    ...darkTheme.typography.labelSmall,
    color: darkTheme.colors.brand.primary,
    letterSpacing: 1.2,
  },
  title: {
    ...darkTheme.typography.heading3,
    color: darkTheme.colors.text.primary,
  },
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.lg,
  },
  emptyMark: {
    width: 40,
    height: 40,
    borderRadius: darkTheme.radius.full,
    borderWidth: 1,
    borderColor: darkTheme.colors.border.strong,
    backgroundColor: darkTheme.colors.surface.raised,
  },
  emptyCopy: {
    flex: 1,
    gap: darkTheme.spacing.xs,
  },
  emptyTitle: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.text.primary,
  },
  emptyDescription: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
  },
  list: {
    gap: darkTheme.spacing.sm,
  },
  activityCard: {
    gap: darkTheme.spacing.sm,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.md,
  },
  activityTitle: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.text.primary,
  },
  amount: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.text.primary,
  },
  timestamp: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
});
