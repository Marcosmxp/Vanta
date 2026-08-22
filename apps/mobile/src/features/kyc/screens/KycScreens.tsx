import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import type { KycStackParamList } from '../../../app/navigation/types';
import { Badge, Button, Card, darkTheme } from '../../../design-system';
import { KycScreenLayout } from '../components/KycScreenLayout';
import type { KycDocumentType } from '../types';

type IntroProps = NativeStackScreenProps<KycStackParamList, 'Intro'>;
type DocumentTypeProps = NativeStackScreenProps<KycStackParamList, 'DocumentType'>;
type DocumentCaptureProps = NativeStackScreenProps<KycStackParamList, 'DocumentCapture'>;
type SelfieProps = NativeStackScreenProps<KycStackParamList, 'Selfie'>;
type ProcessingProps = NativeStackScreenProps<KycStackParamList, 'Processing'>;
type ApprovedProps = NativeStackScreenProps<KycStackParamList, 'Approved'>;
type RejectedProps = NativeStackScreenProps<KycStackParamList, 'Rejected'>;
type RetryProps = NativeStackScreenProps<KycStackParamList, 'Retry'>;

const documentLabels: Record<KycDocumentType, string> = {
  passport: 'Passaporte',
  'identity-card': 'Cartão de cidadão / identidade',
  'residence-permit': 'Título de residência',
};

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
  return (
    <Card>
      <View style={styles.noticeHeader}>
        <Badge label="Privacidade" tone="neutral" />
      </View>
      <Text style={styles.noticeText}>{children}</Text>
    </Card>
  );
}

function CapturePlaceholder({ label }: { label: string }) {
  return (
    <View accessible accessibilityLabel={label} style={styles.captureFrame}>
      <View style={styles.captureIcon} />
      <Text style={styles.captureTitle}>{label}</Text>
      <Text style={styles.captureDescription}>
        A captura real será fornecida pelo SDK/provedor KYC. Este build não grava imagem nem biometria.
      </Text>
    </View>
  );
}

export function KycIntroScreen({ navigation }: IntroProps) {
  return (
    <KycScreenLayout
      step="1 de 4"
      title="Verificar identidade"
      description="Antes de funcionalidades reguladas, precisamos confirmar identidade e elegibilidade através de um processo de verificação seguro."
    >
      <Requirement
        title="Documento válido"
        description="Utilize um documento oficial suportado e dentro da validade."
      />
      <Requirement
        title="Confirmação facial"
        description="O provedor poderá solicitar uma selfie e prova de vida para reduzir fraude."
      />
      <Requirement
        title="Análise protegida"
        description="A decisão final virá do serviço de KYC/backend; o aplicativo nunca se autoaprova."
      />
      <SecurityNotice>
        Documentos e biometria não devem entrar em logs, analytics, route params ou armazenamento persistente do Vanta. O provider deverá trabalhar com tokens opacos de captura.
      </SecurityNotice>
      <Button label="Iniciar verificação" fullWidth onPress={() => navigation.navigate('DocumentType')} />
    </KycScreenLayout>
  );
}

export function KycDocumentTypeScreen({ navigation }: DocumentTypeProps) {
  function choose(documentType: KycDocumentType) {
    navigation.navigate('DocumentCapture', { documentType });
  }

  return (
    <KycScreenLayout
      step="2 de 4"
      title="Escolha o documento"
      description="Selecione apenas o tipo. Nenhum número, imagem ou dado do documento é colocado na navegação."
    >
      <Card accessibilityLabel="Selecionar passaporte" onPress={() => choose('passport')}>
        <Text style={styles.cardTitle}>Passaporte</Text>
        <Text style={styles.cardDescription}>Documento internacional com página de identificação.</Text>
      </Card>
      <Card accessibilityLabel="Selecionar cartão de identidade" onPress={() => choose('identity-card')}>
        <Text style={styles.cardTitle}>Cartão de cidadão / identidade</Text>
        <Text style={styles.cardDescription}>Documento nacional de identificação suportado pelo provider.</Text>
      </Card>
      <Card accessibilityLabel="Selecionar título de residência" onPress={() => choose('residence-permit')}>
        <Text style={styles.cardTitle}>Título de residência</Text>
        <Text style={styles.cardDescription}>Documento de residência quando aceito para a jurisdição.</Text>
      </Card>
    </KycScreenLayout>
  );
}

export function KycDocumentCaptureScreen({ route, navigation }: DocumentCaptureProps) {
  const documentLabel = documentLabels[route.params.documentType];

  return (
    <KycScreenLayout
      step="3 de 4"
      title={`Capturar ${documentLabel.toLowerCase()}`}
      description="O enquadramento abaixo representa a experiência esperada. A captura real será delegada ao provider KYC."
    >
      <CapturePlaceholder label={`Área de captura — ${documentLabel}`} />
      <SecurityNotice>
        O Vanta não deve copiar o ficheiro bruto para Redux/Zustand, AsyncStorage/MMKV, navigation state ou analytics. O resultado esperado desta etapa é apenas um token efémero emitido pelo provider.
      </SecurityNotice>
      <Button label="Continuar para confirmação facial" fullWidth onPress={() => navigation.navigate('Selfie')} />
    </KycScreenLayout>
  );
}

export function KycSelfieScreen({ navigation }: SelfieProps) {
  return (
    <KycScreenLayout
      step="4 de 4"
      title="Confirmação facial"
      description="A prova de vida ajuda a confirmar que a pessoa presente corresponde ao documento apresentado."
    >
      <CapturePlaceholder label="Área de selfie e prova de vida" />
      <Requirement title="Boa iluminação" description="Evite contraluz, reflexos e rosto parcialmente coberto." />
      <Requirement title="Uma pessoa" description="A captura deve conter apenas a pessoa que está a realizar a verificação." />
      <Button label="Enviar para análise" fullWidth onPress={() => navigation.replace('Processing')} />
      <Text style={styles.prototypeNote}>
        Nesta fase, o botão apenas valida a sequência visual. Nenhuma biometria é capturada ou enviada por este código.
      </Text>
    </KycScreenLayout>
  );
}

export function KycProcessingScreen(_props: ProcessingProps) {
  return (
    <KycScreenLayout
      title="Verificação em análise"
      description="Quando a integração estiver ativa, esta tela será alimentada exclusivamente pelo estado retornado pelo backend/provider."
    >
      <Card elevated>
        <View style={styles.statusBlock}>
          <View style={styles.processingIndicator} />
          <View style={styles.requirementContent}>
            <Text style={styles.cardTitle}>Análise em curso</Text>
            <Text style={styles.cardDescription}>
              Não feche uma aprovação localmente. O resultado deve ser consultado de uma fonte confiável e auditável.
            </Text>
          </View>
        </View>
      </Card>
      <SecurityNotice>
        Estados `approved` e `rejected` existem como telas nesta fase, mas não há controlo local para escolher o resultado. Isso impede que o protótipo crie um bypass visual de KYC.
      </SecurityNotice>
    </KycScreenLayout>
  );
}

export function KycApprovedScreen(_props: ApprovedProps) {
  return (
    <KycScreenLayout
      title="Identidade verificada"
      description="Este estado só poderá ser apresentado após confirmação autenticada e íntegra do backend/provider."
    >
      <Card elevated>
        <Badge label="Aprovado" tone="success" />
        <Text style={styles.stateTitle}>Verificação concluída</Text>
        <Text style={styles.cardDescription}>
          A aprovação de KYC não autoriza por si só apostas, depósitos ou levantamentos. Jurisdição, limites, risco e restantes regras continuam server-side.
        </Text>
      </Card>
    </KycScreenLayout>
  );
}

export function KycRejectedScreen({ navigation }: RejectedProps) {
  return (
    <KycScreenLayout
      title="Não foi possível concluir"
      description="O backend/provider fornecerá um motivo seguro e apropriado para o utilizador, sem expor regras internas de fraude."
    >
      <Card elevated>
        <Badge label="Requer atenção" tone="danger" />
        <Text style={styles.stateTitle}>Verificação não aprovada</Text>
        <Text style={styles.cardDescription}>
          Dependendo do motivo, o utilizador poderá repetir a captura, fornecer outro documento ou aguardar revisão manual.
        </Text>
      </Card>
      <Button label="Ver opções de nova tentativa" fullWidth onPress={() => navigation.navigate('Retry')} />
    </KycScreenLayout>
  );
}

export function KycRetryScreen({ navigation }: RetryProps) {
  return (
    <KycScreenLayout
      title="Tentar novamente"
      description="Uma nova tentativa deve respeitar limites de frequência e regras de risco definidas pelo backend."
    >
      <Requirement title="Documento ilegível" description="Tente novamente com melhor iluminação e todo o documento visível." />
      <Requirement title="Documento alternativo" description="Quando permitido, escolha outro tipo de documento suportado." />
      <Requirement title="Revisão manual" description="Alguns casos não devem permitir novas tentativas automáticas." />
      <Button label="Escolher documento" fullWidth onPress={() => navigation.replace('DocumentType')} />
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
