export const kycNavigationPtBR = {
  'kyc.nav.loadingTitle': 'Confirmando verificação',
  'kyc.nav.loadingDescription': 'Estamos verificando o estado da sua identidade.',
  'kyc.nav.unavailableTitle': 'Verificação indisponível',
  'kyc.nav.unavailableDescription': 'Não foi possível confirmar o estado da sua verificação agora.',
  'kyc.nav.intro': 'Verificação',
  'kyc.nav.document': 'Documento',
  'kyc.nav.capture': 'Captura do documento',
  'kyc.nav.selfie': 'Confirmação facial',
  'kyc.nav.processing': 'Em análise',
  'kyc.nav.approved': 'Verificado',
  'kyc.nav.rejected': 'Verificação',
  'kyc.nav.retry': 'Nova tentativa',
} as const;

export type KycNavigationTranslationKey = keyof typeof kycNavigationPtBR;
export type KycNavigationTranslationDictionary = Record<KycNavigationTranslationKey, string>;

export const kycNavigationEn: KycNavigationTranslationDictionary = {
  'kyc.nav.loadingTitle': 'Checking verification',
  'kyc.nav.loadingDescription': 'We are checking your identity verification status.',
  'kyc.nav.unavailableTitle': 'Verification unavailable',
  'kyc.nav.unavailableDescription': 'We could not confirm your verification status right now.',
  'kyc.nav.intro': 'Verification',
  'kyc.nav.document': 'Document',
  'kyc.nav.capture': 'Document capture',
  'kyc.nav.selfie': 'Face confirmation',
  'kyc.nav.processing': 'Under review',
  'kyc.nav.approved': 'Verified',
  'kyc.nav.rejected': 'Verification',
  'kyc.nav.retry': 'Try again',
};

export const kycNavigationEs: KycNavigationTranslationDictionary = {
  'kyc.nav.loadingTitle': 'Comprobando verificación',
  'kyc.nav.loadingDescription': 'Estamos comprobando el estado de tu verificación de identidad.',
  'kyc.nav.unavailableTitle': 'Verificación no disponible',
  'kyc.nav.unavailableDescription': 'No pudimos confirmar el estado de tu verificación ahora.',
  'kyc.nav.intro': 'Verificación',
  'kyc.nav.document': 'Documento',
  'kyc.nav.capture': 'Captura del documento',
  'kyc.nav.selfie': 'Confirmación facial',
  'kyc.nav.processing': 'En revisión',
  'kyc.nav.approved': 'Verificado',
  'kyc.nav.rejected': 'Verificación',
  'kyc.nav.retry': 'Nuevo intento',
};
