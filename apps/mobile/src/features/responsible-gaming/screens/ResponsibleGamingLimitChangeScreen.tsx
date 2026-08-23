import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Input, darkTheme } from '../../../design-system';
import type { MoneyLimitView, SessionLimitView } from '../types';
import { formatEuroMinor, limitPeriodLabel, moneyLimitKindLabel } from '../utils/format';

interface MoneyModeProps {
  mode: 'money';
  limit: MoneyLimitView | null;
  canSubmit: boolean;
  onSubmit?: (limitId: string, requestedAmountMinor: number) => void;
}

interface SessionModeProps {
  mode: 'session';
  limit: SessionLimitView | null;
  canSubmit: boolean;
  onSubmit?: (requestedMinutes: number) => void;
}

export type ResponsibleGamingLimitChangeScreenProps = MoneyModeProps | SessionModeProps;

function parseEuroToMinor(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;
  const [whole = '0', fraction = ''] = normalized.split('.');
  const amount = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
}

function parseMinutes(value: string): number | null {
  if (!/^\d+$/.test(value.trim())) return null;
  const minutes = Number(value);
  return Number.isSafeInteger(minutes) && minutes > 0 ? minutes : null;
}

export function ResponsibleGamingLimitChangeScreen(props: ResponsibleGamingLimitChangeScreenProps) {
  const [value, setValue] = useState('');
  const parsedValue = useMemo(
    () => (props.mode === 'money' ? parseEuroToMinor(value) : parseMinutes(value)),
    [props.mode, value],
  );

  const unavailable = props.limit === null;
  const currentLabel =
    props.mode === 'money' && props.limit
      ? `${moneyLimitKindLabel(props.limit.kind)} · ${limitPeriodLabel(props.limit.period)}`
      : 'Tempo de sessão';
  const currentValue =
    props.mode === 'money' && props.limit
      ? formatEuroMinor(props.limit.amountMinor)
      : props.mode === 'session' && props.limit
        ? `${props.limit.minutes} min`
        : '—';

  const submit = () => {
    if (parsedValue === null || !props.canSubmit || !props.limit) return;
    if (props.mode === 'money') {
      props.onSubmit?.(props.limit.limitId, parsedValue);
    } else {
      props.onSubmit?.(parsedValue);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>ALTERAR LIMITE</Text>
          <Text style={styles.title}>{currentLabel}</Text>
          <Text style={styles.subtitle}>
            O pedido será validado novamente no servidor. Uma redução ou aumento só entra em vigor quando o snapshot autoritativo confirmar.
          </Text>
        </View>

        <Card style={styles.currentCard}>
          <Text style={styles.currentLabel}>Limite atual</Text>
          <Text style={styles.currentValue}>{currentValue}</Text>
        </Card>

        <Input
          label={props.mode === 'money' ? 'Novo limite (€)' : 'Novo limite (minutos)'}
          value={value}
          onChangeText={setValue}
          editable={!unavailable && props.canSubmit}
          keyboardType={props.mode === 'money' ? 'decimal-pad' : 'number-pad'}
          placeholder={props.mode === 'money' ? '100,00' : '90'}
          helperText="A política server-side decide se existe cooling-off e quando a alteração se torna efetiva."
          errorMessage={value.length > 0 && parsedValue === null ? 'Introduza um valor positivo válido.' : undefined}
        />

        <Button
          label="Enviar pedido"
          fullWidth
          disabled={!props.canSubmit || !props.limit || parsedValue === null || !props.onSubmit}
          onPress={submit}
        />

        <Text style={styles.footer}>
          O aplicativo não altera o limite localmente após o envio. O estado deve ser recarregado da API autenticada.
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
  currentCard: { gap: darkTheme.spacing.xs },
  currentLabel: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  currentValue: { ...darkTheme.typography.heading2, color: darkTheme.colors.text.primary },
  footer: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled, textAlign: 'center' },
});
