import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, darkTheme, Input } from '../../../design-system';
import { disconnectedSupportCapabilities } from '../provider/SupportProvider';
import type { CreateSupportRequestInput, SupportCapabilities } from '../types';

export interface SupportRequestScreenProps {
  categories?: readonly string[];
  capabilities?: SupportCapabilities;
  onSubmit?: (input: Omit<CreateSupportRequestInput, 'idempotencyKey'>) => void;
}

export function SupportRequestScreen({
  categories = [],
  capabilities = disconnectedSupportCapabilities,
  onSubmit,
}: SupportRequestScreenProps) {
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const canSubmit = useMemo(
    () =>
      capabilities.canCreateRequest &&
      Boolean(onSubmit) &&
      category.length > 0 &&
      subject.trim().length > 0 &&
      message.trim().length > 0 &&
      message.length <= capabilities.maxMessageLength,
    [capabilities, category, message, onSubmit, subject],
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>NOVO PEDIDO</Text>
          <Text style={styles.title}>Contactar suporte</Text>
          <Text style={styles.subtitle}>
            Descreva o problema sem incluir passwords, códigos de autenticação, dados completos de cartão ou documentos KYC.
          </Text>
        </View>

        <Card style={styles.formCard}>
          <Text style={styles.label}>Categoria</Text>
          {categories.length === 0 ? (
            <Text style={styles.unavailable}>Categorias indisponíveis até a API autenticada fornecer a política de suporte.</Text>
          ) : (
            <View style={styles.chips}>
              {categories.map((item) => {
                const selected = category === item;
                return (
                  <Pressable
                    key={item}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setCategory(item)}
                    style={[styles.chip, selected && styles.chipSelected]}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <Input
            label="Assunto"
            value={subject}
            maxLength={120}
            onChangeText={setSubject}
            placeholder="Resumo do problema"
            editable={capabilities.canCreateRequest}
          />

          <Input
            label="Mensagem"
            value={message}
            maxLength={capabilities.maxMessageLength}
            onChangeText={setMessage}
            placeholder="Explique o que aconteceu e quando ocorreu"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            editable={capabilities.canCreateRequest}
            helperText={`${message.length}/${capabilities.maxMessageLength} caracteres`}
          />

          <Button
            label="Enviar pedido"
            fullWidth
            disabled={!canSubmit}
            onPress={() => onSubmit?.({ category, subject: subject.trim(), message: message.trim() })}
          />
          <Text style={styles.helper}>{capabilities.message}</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: darkTheme.colors.background.app },
  content: { padding: darkTheme.spacing.lg, paddingBottom: darkTheme.spacing['4xl'], gap: darkTheme.spacing.xl },
  header: { gap: darkTheme.spacing.sm },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.3 },
  title: { ...darkTheme.typography.heading1, color: darkTheme.colors.text.primary },
  subtitle: { ...darkTheme.typography.bodyLarge, color: darkTheme.colors.text.secondary },
  formCard: { gap: darkTheme.spacing.lg },
  label: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  unavailable: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: darkTheme.spacing.sm },
  chip: {
    borderRadius: darkTheme.radius.full,
    borderWidth: 1,
    borderColor: darkTheme.colors.border.default,
    paddingHorizontal: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.sm,
  },
  chipSelected: { borderColor: darkTheme.colors.brand.primary, backgroundColor: darkTheme.colors.surface.raised },
  chipText: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.text.secondary },
  chipTextSelected: { color: darkTheme.colors.brand.primary },
  helper: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled },
});
