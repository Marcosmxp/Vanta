import { ApiError } from '../../../core/api/ApiClient';
import type { SessionContextValue } from '../../../core/session/types';
import type { LegalProvider } from './LegalProvider';
import type { LegalDocumentDetail, LegalSnapshot } from '../types';

function normalizeLegalSnapshot(snapshot: LegalSnapshot): LegalSnapshot {
  return {
    ...snapshot,
    documents: Array.isArray(snapshot.documents) ? snapshot.documents : [],
    regulatory: snapshot.regulatory
      ? {
          ...snapshot.regulatory,
          licenseReferences: Array.isArray(snapshot.regulatory.licenseReferences)
            ? snapshot.regulatory.licenseReferences
            : [],
        }
      : null,
  };
}

export function createApiLegalProvider(publicRequest: SessionContextValue['publicRequest']): LegalProvider {
  return {
    async getSnapshot(): Promise<LegalSnapshot> {
      const snapshot = await publicRequest<LegalSnapshot>('/v1/legal');
      return normalizeLegalSnapshot(snapshot);
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
