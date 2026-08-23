import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Card, darkTheme } from '../../../design-system';
import type { PrivacyDisclosure } from '../types';

export interface PrivacyInformationScreenProps {
  disclosure: PrivacyDisclosure | null;
}

export function PrivacyInformationScreen({ disclosure }: PrivacyInformationScreenProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>PRIVACIDADE</Text>
          <Text style={styles.title}>Dados pessoais e direitos</Text>
          <Text style={styles.subtitle}>
            Informação de privacidade deve vir da configuração legal versionada do operador, não de valores locais no aplicativo.
          </Text>
        </View>

        {disclosure ? (
          <>
            <Card style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>Responsável pelo tratamento</Text>
                <Badge label="RGPD" tone="brand" />
              </View>
              <View style={styles.row}><Text style={styles.label}>Entidade</Text><Text style={styles.value}>{disclosure.controllerName}</Text></View>
              <View style={styles.row}><Text style={styles.label}>Privacidade</Text><Text style={styles.value}>{disclosure.privacyContact}</Text></View>
              <View style={styles.row}><Text style={styles.label}>DPO</Text><Text style={styles.value}>{disclosure.dpoContact ?? 'Não configurado'}</Text></View>
            </Card>

            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Autoridade de controlo</Text>
              <Text style={styles.value}>{disclosure.supervisoryAuthority.name}</Text>
              <Text selectable style={styles.url}>{disclosure.supervisoryAuthority.url}</Text>
            </Card>

            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Direitos do titular</Text>
              <Text style={styles.body}>
                A versão detalhada dos direitos, bases de tratamento, conservação, partilhas e procedimentos deve estar no documento de privacidade versionado associado a esta conta.
              </Text>
              <Text style={styles.meta}>Documento: {disclosure.privacyDocumentId}</Text>
            </Card>
          </>
        ) : (
          <Card>
            <Text style={styles.empty}>O disclosure de privacidade ainda não foi carregado pela API legal.</Text>
          </Card>
        )}
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
  card: { gap: darkTheme.spacing.md },
  cardTitle: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: darkTheme.spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: darkTheme.spacing.lg, borderTopWidth: 1, borderTopColor: darkTheme.colors.border.default, paddingTop: darkTheme.spacing.md },
  label: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  value: { ...darkTheme.typography.bodyStrong, flexShrink: 1, textAlign: 'right', color: darkTheme.colors.text.primary },
  url: { ...darkTheme.typography.caption, color: darkTheme.colors.brand.primary },
  body: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  meta: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled },
  empty: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
});
