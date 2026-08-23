import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Card, darkTheme } from '../../../design-system';
import { disconnectedLegalSnapshot } from '../provider/LegalProvider';
import type { LegalSnapshot } from '../types';

export interface LegalCenterScreenProps {
  snapshot?: LegalSnapshot;
  onOpenDocument?: (documentId: string) => void;
  onOpenPrivacy?: () => void;
  onOpenRegulatory?: () => void;
}

export function LegalCenterScreen({
  snapshot = disconnectedLegalSnapshot,
  onOpenDocument,
  onOpenPrivacy,
  onOpenRegulatory,
}: LegalCenterScreenProps) {
  const ready = snapshot.availability === 'ready';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>LEGAL E TRANSPARÊNCIA</Text>
          <Text style={styles.title}>Documentos, privacidade e regulação</Text>
          <Text style={styles.subtitle}>
            Consulte apenas versões fornecidas pela API legal versionada. O cliente não declara licença nem substitui o conteúdo oficial do operador.
          </Text>
        </View>

        <Card style={styles.statusCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Estado do conteúdo</Text>
            <Badge label={ready ? 'Atualizado' : 'Indisponível'} tone={ready ? 'success' : 'neutral'} />
          </View>
          <Text style={styles.cardText}>{snapshot.message ?? 'Documentos carregados e verificados pela API.'}</Text>
        </Card>

        <View style={styles.quickGrid}>
          <Pressable accessibilityRole="button" disabled={!snapshot.privacy || !onOpenPrivacy} onPress={onOpenPrivacy} style={styles.quickPressable}>
            <Card style={styles.quickCard}>
              <Text style={styles.quickEyebrow}>PRIVACIDADE</Text>
              <Text style={styles.quickTitle}>Dados e direitos RGPD</Text>
              <Text style={styles.quickText}>Responsável pelo tratamento, contacto e autoridade supervisora.</Text>
            </Card>
          </Pressable>
          <Pressable accessibilityRole="button" disabled={!snapshot.regulatory || !onOpenRegulatory} onPress={onOpenRegulatory} style={styles.quickPressable}>
            <Card style={styles.quickCard}>
              <Text style={styles.quickEyebrow}>REGULAÇÃO</Text>
              <Text style={styles.quickTitle}>Operador e licenciamento</Text>
              <Text style={styles.quickText}>Disclosure regulatório sem alegações locais ou não verificadas.</Text>
            </Card>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Documentos</Text>
            <Text style={styles.count}>{snapshot.documents.length}</Text>
          </View>
          {snapshot.documents.length === 0 ? (
            <Card><Text style={styles.emptyText}>Nenhum documento legal foi carregado.</Text></Card>
          ) : (
            snapshot.documents.map((document) => (
              <Pressable
                key={document.documentId}
                accessibilityRole="button"
                disabled={!onOpenDocument}
                onPress={() => onOpenDocument?.(document.documentId)}
              >
                <Card style={styles.documentCard}>
                  <View style={styles.rowBetween}>
                    <View style={styles.flexCopy}>
                      <Text style={styles.documentTitle}>{document.title}</Text>
                      <Text style={styles.documentMeta}>Versão {document.version}</Text>
                    </View>
                    <Badge label={document.kind} tone="neutral" />
                  </View>
                  <Text style={styles.documentMeta}>Vigente desde {new Date(document.effectiveAt).toLocaleDateString('pt-PT')}</Text>
                  <Text numberOfLines={1} style={styles.digest}>SHA-256: {document.contentSHA256}</Text>
                </Card>
              </Pressable>
            ))
          )}
        </View>

        <Text style={styles.footer}>
          Em produção, a identidade do operador, licenças, contactos e procedimentos de reclamação devem vir de configuração compliance verificada.
        </Text>
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
  statusCard: { gap: darkTheme.spacing.md },
  cardTitle: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  cardText: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  quickGrid: { gap: darkTheme.spacing.md },
  quickPressable: { borderRadius: darkTheme.radius.lg },
  quickCard: { gap: darkTheme.spacing.sm },
  quickEyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary },
  quickTitle: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  quickText: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  section: { gap: darkTheme.spacing.md },
  sectionTitle: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  count: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.brand.primary },
  documentCard: { gap: darkTheme.spacing.sm },
  flexCopy: { flex: 1, gap: darkTheme.spacing.xs },
  documentTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  documentMeta: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  digest: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled },
  emptyText: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  footer: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled, textAlign: 'center' },
});
