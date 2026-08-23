import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Card, darkTheme } from '../../../design-system';
import type { LicensingStatus, RegulatoryDisclosure } from '../types';

export interface RegulatoryInformationScreenProps {
  disclosure: RegulatoryDisclosure | null;
}

function statusPresentation(status: LicensingStatus) {
  switch (status) {
    case 'licensed':
      return { label: 'Licenciado', tone: 'success' as const };
    case 'pending':
      return { label: 'Pendente', tone: 'warning' as const };
    case 'unconfigured':
      return { label: 'Não configurado', tone: 'neutral' as const };
  }
}

export function RegulatoryInformationScreen({ disclosure }: RegulatoryInformationScreenProps) {
  const presentation = disclosure ? statusPresentation(disclosure.licensingStatus) : null;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>INFORMAÇÃO REGULATÓRIA</Text>
          <Text style={styles.title}>Operador, licença e reclamações</Text>
          <Text style={styles.subtitle}>
            A Vanta só apresenta uma alegação de licenciamento quando a API compliance fornece identidade real do operador e referências concretas de licença.
          </Text>
        </View>

        {disclosure && presentation ? (
          <>
            <Card style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>Estado de licenciamento</Text>
                <Badge label={presentation.label} tone={presentation.tone} />
              </View>
              <Text style={styles.notice}>{disclosure.licenseNotice}</Text>
            </Card>

            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Entidade exploradora</Text>
              <View style={styles.row}><Text style={styles.label}>Entidade</Text><Text style={styles.value}>{disclosure.operatorLegalName ?? 'Não configurada'}</Text></View>
              <View style={styles.row}><Text style={styles.label}>Contacto</Text><Text style={styles.value}>{disclosure.operatorContact ?? 'Não configurado'}</Text></View>
              <View style={styles.row}><Text style={styles.label}>Morada</Text><Text style={styles.value}>{disclosure.operatorAddress ?? 'Não configurada'}</Text></View>
              <View style={styles.row}><Text style={styles.label}>Jurisdição</Text><Text style={styles.value}>{disclosure.jurisdictionCode}</Text></View>
            </Card>

            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Regulador</Text>
              <Text style={styles.valueLeft}>{disclosure.regulator.name}</Text>
              <Text selectable style={styles.url}>{disclosure.regulator.url}</Text>
            </Card>

            <Card style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>Referências de licença</Text>
                <Text style={styles.count}>{disclosure.licenseReferences.length}</Text>
              </View>
              {disclosure.licenseReferences.length === 0 ? (
                <Text style={styles.notice}>Nenhuma referência de licença está configurada. O cliente não deve inferir licenciamento.</Text>
              ) : (
                disclosure.licenseReferences.map((reference) => (
                  <View key={`${reference.licenseId}-${reference.scope}`} style={styles.licenseRow}>
                    <Text style={styles.licenseId}>{reference.licenseId}</Text>
                    <Text style={styles.licenseScope}>{reference.scope}</Text>
                  </View>
                ))
              )}
            </Card>

            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Reclamações</Text>
              <Text style={styles.notice}>
                O procedimento completo deve ser consultado no documento versionado associado ao identificador abaixo.
              </Text>
              <Text style={styles.meta}>{disclosure.complaintsDocumentId}</Text>
            </Card>
          </>
        ) : (
          <Card>
            <Text style={styles.empty}>O disclosure regulatório ainda não foi carregado. Nenhuma alegação de licença é apresentada.</Text>
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
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: darkTheme.spacing.lg, borderTopWidth: 1, borderTopColor: darkTheme.colors.border.default, paddingTop: darkTheme.spacing.md },
  label: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  value: { ...darkTheme.typography.bodyStrong, flexShrink: 1, textAlign: 'right', color: darkTheme.colors.text.primary },
  valueLeft: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  notice: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  url: { ...darkTheme.typography.caption, color: darkTheme.colors.brand.primary },
  count: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.brand.primary },
  licenseRow: { gap: darkTheme.spacing.xs, borderTopWidth: 1, borderTopColor: darkTheme.colors.border.default, paddingTop: darkTheme.spacing.md },
  licenseId: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  licenseScope: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  meta: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled },
  empty: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
});
