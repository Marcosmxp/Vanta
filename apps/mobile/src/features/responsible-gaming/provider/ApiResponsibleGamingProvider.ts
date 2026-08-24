import type { SessionContextValue } from '../../../core/session/types';
import type { ResponsibleGamingProvider } from './ResponsibleGamingProvider';
import type { ResponsibleGamingSnapshot } from '../types';

export function createApiResponsibleGamingProvider(request: SessionContextValue['request']): ResponsibleGamingProvider {
  const getSnapshot = () => request<ResponsibleGamingSnapshot>('/v1/responsible-gaming');

  return {
    getSnapshot,
    async requestMoneyLimitChange(input) {
      await request<void>(`/v1/responsible-gaming/limits/${encodeURIComponent(input.limitId)}`, {
        method: 'POST',
        headers: { 'Idempotency-Key': input.idempotencyKey },
        body: { amountMinor: input.requestedAmountMinor },
      });
      return getSnapshot();
    },
    async requestSessionLimitChange(input) {
      await request<void>('/v1/responsible-gaming/session-limit', {
        method: 'POST',
        headers: { 'Idempotency-Key': input.idempotencyKey },
        body: { minutes: input.requestedMinutes },
      });
      return getSnapshot();
    },
    async startTimeOut(input) {
      await request<void>('/v1/responsible-gaming/time-out', {
        method: 'POST',
        headers: { 'Idempotency-Key': input.idempotencyKey },
        body: { optionId: input.optionId },
      });
      return getSnapshot();
    },
    async startSelfExclusion(input) {
      if (input.acknowledged !== true) {
        throw new Error('Explicit self-exclusion acknowledgement is required.');
      }
      await request<void>('/v1/responsible-gaming/self-exclusion', {
        method: 'POST',
        headers: { 'Idempotency-Key': input.idempotencyKey },
        body: { optionId: input.optionId, acknowledged: true },
      });
      return getSnapshot();
    },
  };
}
