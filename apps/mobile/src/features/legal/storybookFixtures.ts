import type { LegalDocumentDetail, LegalSnapshot } from './types';

const digest = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

export const legalStoryDocument: LegalDocumentDetail = {
  documentId: 'privacy_story_v1',
  kind: 'privacy',
  title: 'Política de Privacidade — fixture',
  version: '1.0.0-story',
  effectiveAt: '2026-08-23T00:00:00Z',
  updatedAt: '2026-08-23T00:00:00Z',
  contentSHA256: digest,
  bodyMarkdown: 'Fixture visual do Storybook. O conteúdo legal de produção deve ser fornecido pela API versionada e revisto juridicamente antes da publicação.',
};

export const legalStorySnapshot: LegalSnapshot = {
  availability: 'ready',
  documents: [
    legalStoryDocument,
    {
      documentId: 'complaints_story_v1',
      kind: 'complaints',
      title: 'Procedimento de Reclamações — fixture',
      version: '1.0.0-story',
      effectiveAt: '2026-08-23T00:00:00Z',
      updatedAt: '2026-08-23T00:00:00Z',
      contentSHA256: digest,
    },
  ],
  regulatory: {
    jurisdictionCode: 'PT',
    operatorLegalName: null,
    operatorContact: null,
    operatorAddress: null,
    licensingStatus: 'unconfigured',
    regulator: {
      name: 'SRIJ — Serviço de Regulação e Inspeção de Jogos',
      url: 'https://www.srij.turismodeportugal.pt/',
    },
    licenseReferences: [],
    licenseNotice: 'Fixture visual: não existe qualquer alegação de que a Vanta esteja licenciada.',
    complaintsDocumentId: 'complaints_story_v1',
  },
  privacy: {
    controllerName: 'Operador não configurado — fixture',
    privacyContact: 'Não configurado',
    dpoContact: null,
    supervisoryAuthority: {
      name: 'CNPD — Comissão Nacional de Proteção de Dados',
      url: 'https://www.cnpd.pt/cidadaos/direitos/',
    },
    privacyDocumentId: 'privacy_story_v1',
  },
  message: 'Fixture visual do Storybook; sem validade jurídica ou alegação de licenciamento.',
};
