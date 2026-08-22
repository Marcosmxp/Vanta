import { StyleSheet, Text, View } from 'react-native';

import { Badge, Button, Card, Input, darkTheme } from '../../../../design-system';
import type { PlinkoRulesetView } from '../types';

export interface BetControlsProps {
  ruleset: PlinkoRulesetView | null;
  stakeMinor: number;
  disabled?: boolean;
  loading?: boolean;
  onStakeChange: (stakeMinor: number) => void;
  onPlaceBet: () => void;
}

function formatStakeInput(stakeMinor: number) {
  return (stakeMinor / 100).toFixed(2).replace('.', ',');
}

function parseStakeInput(value: string) {
  const normalized = value.replace(/[^0-9,.]/g, '').replace(',', '.');
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount < 0) {
    return 0;
  }
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
  const canEdit = Boolean(ruleset) && !disabled && !loading;
  const withinLimits = Boolean(
    ruleset &&
      stakeMinor >= ruleset.minStakeMinor &&
      stakeMinor <= ruleset.maxStakeMinor,
  );

  return (
    <Card elevated style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>APOSTA</Text>
          <Text style={styles.title}>Configurar queda</Text>
        </View>
        {ruleset ? <Badge label={`${ruleset.rows} linhas · ${ruleset.risk}`} tone="neutral" /> : null}
      </View>

      <Input
        label="Valor"
        value={formatStakeInput(stakeMinor)}
        onChangeText={(value) => onStakeChange(parseStakeInput(value))}
        editable={canEdit}
        keyboardType="decimal-pad"
        trailing={<Text style={styles.currency}>€</Text>}
        helperText={
          ruleset
            ? `Limites desta configuração: ${(ruleset.minStakeMinor / 100).toFixed(2)} € – ${(ruleset.maxStakeMinor / 100).toFixed(2)} €.`
            : 'O valor será editável quando o ruleset autenticado estiver disponível.'
        }
        errorMessage={ruleset && !withinLimits ? 'Valor fora dos limites permitidos pelo servidor.' : undefined}
      />

      {ruleset ? (
        <View style={styles.quickRow}>
          <Button
            label="Mín."
            size="small"
            variant="secondary"
            disabled={!canEdit}
            onPress={() => onStakeChange(ruleset.minStakeMinor)}
          />
          <Button
            label="½"
            size="small"
            variant="secondary"
            disabled={!canEdit}
            onPress={() => onStakeChange(Math.max(ruleset.minStakeMinor, Math.floor(stakeMinor / 2)))}
          />
          <Button
            label="2×"
            size="small"
            variant="secondary"
            disabled={!canEdit}
            onPress={() => onStakeChange(Math.min(ruleset.maxStakeMinor, stakeMinor * 2))}
          />
          <Button
            label="Máx."
            size="small"
            variant="secondary"
            disabled={!canEdit}
            onPress={() => onStakeChange(ruleset.maxStakeMinor)}
          />
        </View>
      ) : null}

      <Button
        label={ruleset ? 'Soltar bola' : 'Aposta indisponível'}
        fullWidth
        loading={loading}
        disabled={disabled || !ruleset || !withinLimits}
        onPress={onPlaceBet}
      />

      <Text style={styles.securityCopy}>
        O botão envia uma intenção de aposta; resultado, multiplier e settlement nunca são calculados neste componente.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: darkTheme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: darkTheme.spacing.md,
  },
  headerText: {
    flex: 1,
    gap: darkTheme.spacing.xs,
  },
  eyebrow: {
    ...darkTheme.typography.labelSmall,
    color: darkTheme.colors.brand.primary,
    letterSpacing: 1.4,
  },
  title: {
    ...darkTheme.typography.heading3,
    color: darkTheme.colors.text.primary,
  },
  currency: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.text.secondary,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: darkTheme.spacing.sm,
  },
  securityCopy: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
});
