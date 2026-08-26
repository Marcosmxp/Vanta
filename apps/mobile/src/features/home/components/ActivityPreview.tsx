import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatCurrencyMinor, useI18n, type TranslationKey } from '../../../core/i18n';
import { Badge, Card, SystemState, darkTheme } from '../../../design-system';
import type { HomeActivityItem } from '../types';

export interface ActivityPreviewProps {
  items: readonly HomeActivityItem[];
  onOpenBetHistory?: () => void;
}

const kindKeys: Record<HomeActivityItem['kind'], TranslationKey> = {
  bet: 'home.activityKind.bet',
  deposit: 'home.activityKind.deposit',
  withdrawal: 'home.activityKind.withdrawal',
  settlement: 'home.activityKind.settlement',
};

export function ActivityPreview({ items, onOpenBetHistory }: ActivityPreviewProps) {
  const { locale, t } = useI18n();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.eyebrow}>{t('home.activityEyebrow')}</Text>
          <Text style={styles.title}>{t('home.activityTitle')}</Text>
        </View>
        <Badge label={items.length > 0 ? `${items.length} ${t('home.activityRecentSuffix')}` : t('home.activityNone')} tone="neutral" />
      </View>

      {items.length === 0 ? (
        <SystemState kind="empty" compact title={t('home.activityEmptyTitle')} description={t('home.activityEmptyDescription')} />
      ) : (
        <View style={styles.list}>
          {items.slice(0, 3).map((item) => {
            const amount = item.amountMinor === undefined || item.currency === undefined
              ? null
              : formatCurrencyMinor(item.amountMinor, item.currency, locale);
            return (
              <Card key={item.id} style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <Badge label={t(kindKeys[item.kind])} tone="neutral" />
                  {amount ? <Text style={styles.amount}>{amount}</Text> : null}
                </View>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.timestamp}>{item.occurredAt}</Text>
              </Card>
            );
          })}
        </View>
      )}

      {onOpenBetHistory ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home.activityHistory')}
          onPress={onOpenBetHistory}
          style={({ pressed }) => [styles.historyButton, pressed && styles.pressed]}
        >
          <Text style={styles.historyButtonLabel}>{t('home.activityHistory')}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: darkTheme.spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.2 },
  title: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  list: { gap: darkTheme.spacing.sm },
  activityCard: { gap: darkTheme.spacing.sm },
  activityHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  activityTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  amount: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  timestamp: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  historyButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: darkTheme.radius.md,
    borderWidth: 1,
    borderColor: darkTheme.colors.border.default,
    backgroundColor: darkTheme.colors.surface.default,
    paddingHorizontal: darkTheme.spacing.lg,
  },
  historyButtonLabel: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  pressed: { opacity: 0.75 },
});
