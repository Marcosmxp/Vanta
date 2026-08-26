import { StyleSheet, Text, View } from 'react-native';

import { formatCurrencyMinor, useI18n, type TranslationKey } from '../../../../core/i18n';
import { Badge, Button, Card, Input, darkTheme } from '../../../../design-system';
import type { PlinkoRisk, PlinkoRulesetView } from '../types';

export interface BetControlsProps {
  ruleset: PlinkoRulesetView | null;
  stakeMinor: number;
  disabled?: boolean;
  loading?: boolean;
  onStakeChange: (stakeMinor: number) => void;
  onPlaceBet: () => void;
}

const riskKeys: Record<PlinkoRisk, TranslationKey> = {
  low: 'plinko.risk.low',
  medium: 'plinko.risk.medium',
  high: 'plinko.risk.high',
};

function parseStakeInput(value: string) {
  const normalized = value.replace(/[^0-9,.]/g, '').replace(',', '.');
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount < 0) return 0;
  return Math.round(amount * 100);
}

export function BetControls({
  ruleset,
  stakeMinor,
  disabled = false,
  loading = false,
  onStakeChange,
  onPlaceBet,
}: BetControlsProps) {
  const { locale, t } = useI18n();
  const canEdit = Boolean(ruleset) && !disabled && !loading;
  const withinLimits = Boolean(ruleset && stakeMinor >= ruleset.minStakeMinor && stakeMinor <= ruleset.maxStakeMinor);
  const inputValue = (stakeMinor / 100).toFixed(2).replace('.', locale === 'en' ? '.' : ',');

  return (
    <Card elevated style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>{t('plinko.betEyebrow')}</Text>
          <Text style={styles.title}>{t('plinko.betTitle')}</Text>
        </View>
        {ruleset ? <Badge label={`${ruleset.rows} ${t('plinko.rows')} · ${t(riskKeys[ruleset.risk])}`} tone="neutral" /> : null}
      </View>

      <Input
        label={t('plinko.value')}
        value={inputValue}
        onChangeText={(value) => onStakeChange(parseStakeInput(value))}
        editable={canEdit}
        keyboardType="decimal-pad"
        trailing={<Text style={styles.currency}>€</Text>}
        helperText={ruleset
          ? `${t('plinko.limitPrefix')}: ${formatCurrencyMinor(ruleset.minStakeMinor, ruleset.currency, locale)} – ${formatCurrencyMinor(ruleset.maxStakeMinor, ruleset.currency, locale)}`
          : t('plinko.valueUnavailable')}
        errorMessage={ruleset && !withinLimits ? t('plinko.valueOutOfRange') : undefined}
      />

      {ruleset ? (
        <View style={styles.quickRow}>
          <Button label={t('plinko.min')} size="small" variant="secondary" disabled={!canEdit} onPress={() => onStakeChange(ruleset.minStakeMinor)} />
          <Button label="½" size="small" variant="secondary" disabled={!canEdit} onPress={() => onStakeChange(Math.max(ruleset.minStakeMinor, Math.floor(stakeMinor / 2)))} />
          <Button label="2×" size="small" variant="secondary" disabled={!canEdit} onPress={() => onStakeChange(Math.min(ruleset.maxStakeMinor, stakeMinor * 2))} />
          <Button label={t('plinko.max')} size="small" variant="secondary" disabled={!canEdit} onPress={() => onStakeChange(ruleset.maxStakeMinor)} />
        </View>
      ) : null}

      <Button label={ruleset ? t('plinko.dropBall') : t('plinko.betUnavailable')} fullWidth loading={loading} disabled={disabled || !ruleset || !withinLimits} onPress={onPlaceBet} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: darkTheme.spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: darkTheme.spacing.md },
  headerText: { flex: 1, gap: darkTheme.spacing.xs },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.4 },
  title: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  currency: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.secondary },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: darkTheme.spacing.sm },
});
