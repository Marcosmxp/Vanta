import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import type { KycStackParamList } from '../../../app/navigation/types';
import { useI18n } from '../../../core/i18n';
import { Badge, Button, Card, darkTheme } from '../../../design-system';
import { KycScreenLayout } from '../components/KycScreenLayout';

type IntroProps = NativeStackScreenProps<KycStackParamList, 'Intro'>;
type DocumentTypeProps = NativeStackScreenProps<KycStackParamList, 'DocumentType'>;
type DocumentCaptureProps = NativeStackScreenProps<KycStackParamList, 'DocumentCapture'>;
type SelfieProps = NativeStackScreenProps<KycStackParamList, 'Selfie'>;
type ProcessingProps = NativeStackScreenProps<KycStackParamList, 'Processing'>;
type ApprovedProps = NativeStackScreenProps<KycStackParamList, 'Approved'>;
type RejectedProps = NativeStackScreenProps<KycStackParamList, 'Rejected'>;
type RetryProps = NativeStackScreenProps<KycStackParamList, 'Retry'>;

function Requirement({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <View style={styles.requirementRow}>
        <View style={styles.requirementDot} />
        <View style={styles.requirementContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
      </View>
    </Card>
  );
}

function SecurityNotice({ children }: { children: string }) {
  const { t } = useI18n();

  return (
    <Card>
      <View style={styles.noticeHeader}>
        <Badge label={t('kyc.privacy')} tone="neutral" />
      </View>
      <Text style={styles.noticeText}>{children}</Text>
    </Card>
  );
}

function CapturePlaceholder({ label }: { label: string }) {
  const { t } = useI18n();

  return (
    <View accessible accessibilityLabel={label} style={styles.captureFrame}>
      <View style={styles.captureIcon} />
      <Text style={styles.captureTitle}>{label}</Text>
      <Text style={styles.captureDescription}>{t('kyc.capture.placeholderDescription')}</Text>
    </View>
  );
}

export function KycIntroScreen({ navigation }: IntroProps) {
  const { t } = useI18n();

  return (
    <KycScreenLayout
      step={t('kyc.step1')}
      title={t('kyc.intro.title')}
      description={t('kyc.intro.description')}
    >
      <Requirement title={t('kyc.intro.documentTitle')} description={t('kyc.intro.documentDescription')} />
      <Requirement title={t('kyc.intro.faceTitle')} description={t('kyc.intro.faceDescription')} />
      <Requirement title={t('kyc.intro.reviewTitle')} description={t('kyc.intro.reviewDescription')} />
      <SecurityNotice>{t('kyc.intro.notice')}</SecurityNotice>
      <Button label={t('kyc.intro.start')} fullWidth onPress={() => navigation.navigate('DocumentType')} />
    </KycScreenLayout>
  );
}

export function KycDocumentTypeScreen({ navigation }: DocumentTypeProps) {
  const { t } = useI18n();

  return (
    <KycScreenLayout
      step={t('kyc.step2')}
      title={t('kyc.documentType.title')}
      description={t('kyc.documentType.description')}
    >
      <Card accessibilityLabel={t('kyc.documentType.selectPassport')} onPress={() => navigation.navigate('DocumentCapture', { documentType: 'passport' })}>
        <Text style={styles.cardTitle}>{t('kyc.document.passport')}</Text>
        <Text style={styles.cardDescription}>{t('kyc.documentType.passportDescription')}</Text>
      </Card>
      <Card accessibilityLabel={t('kyc.documentType.selectIdentityCard')} onPress={() => navigation.navigate('DocumentCapture', { documentType: 'identity-card' })}>
        <Text style={styles.cardTitle}>{t('kyc.document.identityCard')}</Text>
        <Text style={styles.cardDescription}>{t('kyc.documentType.identityCardDescription')}</Text>
      </Card>
      <Card accessibilityLabel={t('kyc.documentType.selectResidencePermit')} onPress={() => navigation.navigate('DocumentCapture', { documentType: 'residence-permit' })}>
        <Text style={styles.cardTitle}>{t('kyc.document.residencePermit')}</Text>
        <Text style={styles.cardDescription}>{t('kyc.documentType.residencePermitDescription')}</Text>
      </Card>
    </KycScreenLayout>
  );
}

export function KycDocumentCaptureScreen({ route, navigation }: DocumentCaptureProps) {
  const { t } = useI18n();
  const documentLabel = route.params.documentType === 'passport'
    ? t('kyc.document.passport')
    : route.params.documentType === 'identity-card'
      ? t('kyc.document.identityCard')
      : t('kyc.document.residencePermit');

  return (
    <KycScreenLayout
      step={t('kyc.step3')}
      title={`${t('kyc.capture.title')}: ${documentLabel}`}
      description={t('kyc.capture.description')}
    >
      <CapturePlaceholder label={`${t('kyc.capture.area')} — ${documentLabel}`} />
      <SecurityNotice>{t('kyc.capture.notice')}</SecurityNotice>
      <Button label={t('kyc.capture.continue')} fullWidth onPress={() => navigation.navigate('Selfie')} />
    </KycScreenLayout>
  );
}

export function KycSelfieScreen({ navigation }: SelfieProps) {
  const { t } = useI18n();

  return (
    <KycScreenLayout
      step={t('kyc.step4')}
      title={t('kyc.selfie.title')}
      description={t('kyc.selfie.description')}
    >
      <CapturePlaceholder label={t('kyc.selfie.area')} />
      <Requirement title={t('kyc.selfie.lightTitle')} description={t('kyc.selfie.lightDescription')} />
      <Requirement title={t('kyc.selfie.personTitle')} description={t('kyc.selfie.personDescription')} />
      <Button label={t('kyc.selfie.submit')} fullWidth onPress={() => navigation.replace('Processing')} />
      <Text style={styles.prototypeNote}>{t('kyc.selfie.unavailableNote')}</Text>
    </KycScreenLayout>
  );
}

export function KycProcessingScreen(_props: ProcessingProps) {
  const { t } = useI18n();

  return (
    <KycScreenLayout title={t('kyc.processing.title')} description={t('kyc.processing.description')}>
      <Card elevated>
        <View style={styles.statusBlock}>
          <View style={styles.processingIndicator} />
          <View style={styles.requirementContent}>
            <Text style={styles.cardTitle}>{t('kyc.processing.cardTitle')}</Text>
            <Text style={styles.cardDescription}>{t('kyc.processing.cardDescription')}</Text>
          </View>
        </View>
      </Card>
      <SecurityNotice>{t('kyc.processing.notice')}</SecurityNotice>
    </KycScreenLayout>
  );
}

export function KycApprovedScreen(_props: ApprovedProps) {
  const { t } = useI18n();

  return (
    <KycScreenLayout title={t('kyc.approved.title')} description={t('kyc.approved.description')}>
      <Card elevated>
        <Badge label={t('kyc.approved.badge')} tone="success" />
        <Text style={styles.stateTitle}>{t('kyc.approved.stateTitle')}</Text>
        <Text style={styles.cardDescription}>{t('kyc.approved.cardDescription')}</Text>
      </Card>
    </KycScreenLayout>
  );
}

export function KycRejectedScreen({ navigation }: RejectedProps) {
  const { t } = useI18n();

  return (
    <KycScreenLayout title={t('kyc.rejected.title')} description={t('kyc.rejected.description')}>
      <Card elevated>
        <Badge label={t('kyc.rejected.badge')} tone="danger" />
        <Text style={styles.stateTitle}>{t('kyc.rejected.stateTitle')}</Text>
        <Text style={styles.cardDescription}>{t('kyc.rejected.cardDescription')}</Text>
      </Card>
      <Button label={t('kyc.rejected.options')} fullWidth onPress={() => navigation.navigate('Retry')} />
    </KycScreenLayout>
  );
}

export function KycRetryScreen({ navigation }: RetryProps) {
  const { t } = useI18n();

  return (
    <KycScreenLayout title={t('kyc.retry.title')} description={t('kyc.retry.description')}>
      <Requirement title={t('kyc.retry.unreadableTitle')} description={t('kyc.retry.unreadableDescription')} />
      <Requirement title={t('kyc.retry.alternativeTitle')} description={t('kyc.retry.alternativeDescription')} />
      <Requirement title={t('kyc.retry.manualTitle')} description={t('kyc.retry.manualDescription')} />
      <Button label={t('kyc.retry.chooseDocument')} fullWidth onPress={() => navigation.replace('DocumentType')} />
    </KycScreenLayout>
  );
}

const styles = StyleSheet.create({
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: darkTheme.spacing.md,
  },
  requirementDot: {
    width: 8,
    height: 8,
    marginTop: 6,
    borderRadius: darkTheme.radius.full,
    backgroundColor: darkTheme.colors.brand.primary,
  },
  requirementContent: {
    flex: 1,
    gap: darkTheme.spacing.xs,
  },
  cardTitle: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.text.primary,
  },
  cardDescription: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
  },
  noticeHeader: {
    marginBottom: darkTheme.spacing.sm,
  },
  noticeText: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
  },
  captureFrame: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    gap: darkTheme.spacing.md,
    padding: darkTheme.spacing['2xl'],
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: darkTheme.colors.border.strong,
    borderRadius: darkTheme.radius.xl,
    backgroundColor: darkTheme.colors.surface.default,
  },
  captureIcon: {
    width: 72,
    height: 52,
    borderWidth: 2,
    borderColor: darkTheme.colors.brand.primary,
    borderRadius: darkTheme.radius.md,
  },
  captureTitle: {
    ...darkTheme.typography.heading3,
    color: darkTheme.colors.text.primary,
    textAlign: 'center',
  },
  captureDescription: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
    textAlign: 'center',
  },
  prototypeNote: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
  statusBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.md,
  },
  processingIndicator: {
    width: 16,
    height: 16,
    borderRadius: darkTheme.radius.full,
    borderWidth: 3,
    borderColor: darkTheme.colors.brand.primary,
    borderTopColor: darkTheme.colors.border.strong,
  },
  stateTitle: {
    ...darkTheme.typography.heading3,
    color: darkTheme.colors.text.primary,
    marginTop: darkTheme.spacing.md,
    marginBottom: darkTheme.spacing.sm,
  },
});
