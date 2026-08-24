import { ApiError } from '../../../core/api/ApiClient';
import type { SessionContextValue } from '../../../core/session/types';
import type { SupportProvider } from './SupportProvider';
import type {
  SupportCapabilities,
  SupportRequestSummary,
  SupportSnapshot,
} from '../types';

export const apiSupportCapabilities: SupportCapabilities = {
  canCreateRequest: true,
  maxMessageLength: 4000,
  message: 'Os pedidos são persistidos, cifrados e associados à conta autenticada pelo backend.',
};

export function createApiSupportProvider(request: SessionContextValue['request']): SupportProvider {
  return {
    async getSnapshot(): Promise<SupportSnapshot> {
      return request<SupportSnapshot>('/v1/support');
    },
    async getRequest(requestId: string): Promise<SupportRequestSummary | null> {
      try {
        return await request<SupportRequestSummary>(`/v1/support/requests/${encodeURIComponent(requestId)}`);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
    async createRequest(input): Promise<SupportRequestSummary> {
      const created = await request<{ requestId: string }>('/v1/support/requests', {
        method: 'POST',
        headers: { 'Idempotency-Key': input.idempotencyKey },
        body: {
          category: input.category,
          subject: input.subject,
          message: input.message,
        },
      });
      return request<SupportRequestSummary>(`/v1/support/requests/${encodeURIComponent(created.requestId)}`);
    },
  };
}
