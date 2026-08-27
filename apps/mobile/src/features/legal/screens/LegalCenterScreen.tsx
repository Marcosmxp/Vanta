import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useI18n, type TranslationKey } from '../../../core/i18n';
import { Badge, Card, SystemState, darkTheme } from '../../../design-system';
import { disconnectedLegalSnapshot } from '../provider/LegalProvider';
import type { LegalDocumentKind, LegalSnapshot } from '../types';

export interface LegalCenterScreenProps {
  snapshot?: LegalSnapshot;
  onOpenDocument?: (documentId: string) => void;
  onOpenPrivacy?: () => void;
  onOpenRegulatory?: () => void;
}

const kindKeys: Record<LegalDocumentKind, TranslationKey> = {
  terms: 'legal.kind.terms',
  privacy: 'legal.kind.privacy',
  cookies: 'legal.kind.cookies',
  'game-rules': 'legal.kind.game-rules',
  'responsible-gaming': 'legal.kind.responsible-gaming',
  complaints: 'legal.kind.complaints',
  regulatory: 'legal.kind.regulatory',
};

export function LegalCenterScreen({
  snapshot = disconnectedLegalSnapshot,
  onOpenDocument,
  onOpenPrivacy,
  onOpenRegulatory,
}: LegalCenterScreenProps) {
  const { locale, t } = useI18n();
  const ready = snapshot.availability === 'ready';
  const documents = snapshot.documents ?? [];

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{t('legal.eyebrow')}</Text>
          <Text style={styles.title}>{t('legal.title')}</Text>
          <Text style={styles.subtitle}>{t('legal.subtitle')}</Text>
        </View>

        <Card style={styles.statusCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>{t('legal.contentState')}</Text>
            <Badge label={ready ? t('common.updated') : t('common.unavailable')} tone={ready ? 'success' : 'neutral'} />
          </View>
          <Text style={styles.cardText}>{ready ? t('legal.readyMessage') : t('legal.unavailableMessage')}</Text>
        </Card>

        <View style={styles.quickGrid}>
          <Pressable accessibilityRole="button" disabled={!snapshot.privacy || !onOpenPrivacy} onPress={onOpenPrivacy} style={styles.quickPressable}>
            <Card style={styles.quickCard}>
              <Text style={styles.quickEyebrow}>{t('legal.privacyEyebrow')}</Text>
              <Text style={styles.quickTitle}>{t('legal.privacyTitle')}</Text>
              <Text style={styles.quickText}>{t('legal.privacyText')}</Text>
            </Card>
          </Pressable>
          <Pressable accessibilityRole="button" disabled={!snapshot.regulatory || !onOpenRegulatory} onPress={onOpenRegulatory} style={styles.quickPressable}>
            <Card style={styles.quickCard}>
              <Text style={styles.quickEyebrow}>{t('legal.regulatoryEyebrow')}</Text>
              <Text style={styles.quickTitle}>{t('legal.regulatoryTitle')}</Text>
              <Text style={styles.quickText}>{t('legal.regulatoryText')}</Text>
            </Card>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>{t('legal.documents')}</Text>
            <Text style={styles.count}>{documents.length}</Text>
          </View>
          {documents.length === 0 ? (
            <SystemState
              kind={ready ? 'empty' : 'error'}
              compact
              title={ready ? t('legal.noDocuments') : t('legal.documentsUnavailable')}
              description={ready ? t('legal.noDocumentsDescription') : t('legal.documentsUnavailableDescription')}
            />
          ) : (
            documents.map((document) => (
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
                      <Text style={styles.documentMeta}>{t('legal.version')} {document.version}</Text>
                    </View>
                    <Badge label={t(kindKeys[document.kind])} tone="neutral" />
                  </View>
                  <Text style={styles.documentMeta}>{t('legal.effectiveSince')} {new Date(document.effectiveAt).toLocaleDateString(locale)}</Text>
                </Card>
              </Pressable>
            ))
          )}
        </View>

        <Text style={styles.footer}>{t('legal.footer')}</Text>
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
  footer: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled, textAlign: 'center' },
});
