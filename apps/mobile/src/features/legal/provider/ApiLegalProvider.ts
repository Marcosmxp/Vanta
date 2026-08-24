import { ApiError } from '../../../core/api/ApiClient';
import type { SessionContextValue } from '../../../core/session/types';
import type { LegalProvider } from './LegalProvider';
import type { LegalDocumentDetail, LegalSnapshot } from '../types';

export function createApiLegalProvider(publicRequest: SessionContextValue['publicRequest']): LegalProvider {
  return {
    async getSnapshot(): Promise<LegalSnapshot> {
      return publicRequest<LegalSnapshot>('/v1/legal');
    },
    async getDocument(documentId: string): Promise<LegalDocumentDetail | null> {
      try {
        return await publicRequest<LegalDocumentDetail>(`/v1/legal/documents/${encodeURIComponent(documentId)}`);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
  };
}
