import type { SessionContextValue } from '../../../../core/session/types';
import type { BetDetails, BetHistorySnapshot } from '../types';
import type { BetHistoryProvider, BetHistoryQuery } from './BetHistoryProvider';

export function createApiBetHistoryProvider(request: SessionContextValue['request']): BetHistoryProvider {
  return {
    async getHistory(query: BetHistoryQuery = {}): Promise<BetHistorySnapshot> {
      const search: string[] = [];
      if (query.limit !== undefined) {
        search.push(`limit=${encodeURIComponent(String(query.limit))}`);
      }
      if (query.cursor) {
        search.push(`cursor=${encodeURIComponent(query.cursor)}`);
      }
      const suffix = search.length > 0 ? `?${search.join('&')}` : '';
      const response = await request<{ items: BetHistorySnapshot['items']; nextCursor?: string }>(`/v1/bets${suffix}`);
      return {
        availability: 'ready',
        items: response.items ?? [],
        nextCursor: response.nextCursor ?? null,
      };
    },
    async getBetDetails(betId: string): Promise<BetDetails> {
      return request<BetDetails>(`/v1/bets/${encodeURIComponent(betId)}`);
    },
  };
}
