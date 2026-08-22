export type BetGame = 'plinko';
export type BetStatus = 'accepted' | 'settled' | 'voided';
export type BetHistoryAvailability = 'disconnected' | 'ready' | 'restricted';

export interface BetHistoryItem {
  betId: string;
  game: BetGame;
  status: BetStatus;
  currency: 'EUR';
  stakeMinor: number;
  payoutMinor: number | null;
  multiplierBps: number | null;
  placedAt: string;
  settledAt: string | null;
}

export interface PlinkoBetDetails extends BetHistoryItem {
  game: 'plinko';
  rulesetId: string;
  rulesetVersion: string;
  rows: number;
  risk: 'low' | 'medium' | 'high';
  slot: number | null;
}

export type BetDetails = PlinkoBetDetails;

export interface BetHistorySnapshot {
  availability: BetHistoryAvailability;
  items: readonly BetHistoryItem[];
  nextCursor: string | null;
  message?: string;
}
