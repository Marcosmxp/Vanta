import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Card, SystemState, darkTheme } from '../../../design-system';
import type { LegalDocumentDetail } from '../types';

export interface LegalDocumentScreenProps {
  documentId: string;
  document: LegalDocumentDetail | null;
}

export function LegalDocumentScreen({ documentId, document }: LegalDocumentScreenProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>DOCUMENTO VERSIONADO</Text>
          <Text style={styles.title}>{document?.title ?? 'A carregar documento'}</Text>
          <Text style={styles.subtitle}>
            O conteúdo é recarregado da API pelo `documentId`; o corpo completo nunca é transportado em navigation state.
          </Text>
        </View>

        {document ? (
          <>
            <Card style={styles.metaCard}>
              <View style={styles.rowBetween}>
                <Badge label={document.kind} tone="neutral" />
                <Text style={styles.version}>v{document.version}</Text>
              </View>
              <Text style={styles.meta}>Vigência: {new Date(document.effectiveAt).toLocaleString('pt-PT')}</Text>
              <Text style={styles.meta}>Atualizado: {new Date(document.updatedAt).toLocaleString('pt-PT')}</Text>
              <Text selectable style={styles.digest}>SHA-256: {document.contentSHA256}</Text>
            </Card>
            <Card style={styles.bodyCard}>
              <Text selectable style={styles.body}>{document.bodyMarkdown}</Text>
            </Card>
          </>
        ) : (
          <SystemState
            kind="loading"
            title="A carregar documento legal"
            description={`O documento ${documentId} só será apresentado quando a API legal confirmar a versão e integridade do conteúdo.`}
          />
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
  metaCard: { gap: darkTheme.spacing.sm },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: darkTheme.spacing.md },
  version: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  meta: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  digest: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled },
  bodyCard: { gap: darkTheme.spacing.md },
  body: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.primary, lineHeight: 24 },
});
