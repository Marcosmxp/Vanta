import type { LegalDocumentDetail, LegalSnapshot } from '../types';

export interface LegalProvider {
  getSnapshot(): Promise<LegalSnapshot>;
  getDocument(documentId: string): Promise<LegalDocumentDetail | null>;
}

export const disconnectedLegalSnapshot: LegalSnapshot = {
  availability: 'unavailable',
  documents: [],
  regulatory: null,
  privacy: null,
  message: 'Conteúdo legal e regulatório indisponível até ser carregado pela API versionada.',
};
