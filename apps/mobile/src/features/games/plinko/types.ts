export type PlinkoDirection = 'left' | 'right';
export type PlinkoAvailability = 'disconnected' | 'ready' | 'restricted';
export type PlinkoRisk = 'low' | 'medium' | 'high';

export interface PlinkoRulesetView {
  id: string;
  version: string;
  rows: number;
  risk: PlinkoRisk;
  currency: 'EUR';
  minStakeMinor: number;
  maxStakeMinor: number;
  multipliersBps: readonly number[];
}

export interface PlinkoAuthoritativeResult {
  betId: string;
  rulesetId: string;
  rulesetVersion: string;
  stakeMinor: number;
  currency: 'EUR';
  path: readonly PlinkoDirection[];
  slot: number;
  multiplierBps: number;
  payoutMinor: number;
}

export interface PlinkoSnapshot {
  availability: PlinkoAvailability;
  ruleset: PlinkoRulesetView | null;
  availableBalanceMinor: number | null;
  message?: string;
}

export interface PlacePlinkoBetInput {
  stakeMinor: number;
  rulesetVersion: string;
}
