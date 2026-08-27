import type { BetDetails, BetHistorySnapshot } from '../types';

export interface BetHistoryQuery {
  cursor?: string;
  limit?: number;
}

export interface BetHistoryProvider {
  getHistory(query?: BetHistoryQuery): Promise<BetHistorySnapshot>;
  getBetDetails(betId: string): Promise<BetDetails>;
}

export const disconnectedBetHistorySnapshot: BetHistorySnapshot = {
  availability: 'disconnected',
  items: [],
  nextCursor: null,
};
