import type {
  PlacePlinkoBetInput,
  PlinkoAuthoritativeResult,
  PlinkoSnapshot,
} from '../types';

export interface PlinkoProvider {
  getSnapshot(): Promise<PlinkoSnapshot>;
  placeBet(input: PlacePlinkoBetInput): Promise<PlinkoAuthoritativeResult>;
}

export const disconnectedPlinkoSnapshot: PlinkoSnapshot = {
  availability: 'disconnected',
  ruleset: null,
  availableBalanceMinor: null,
  message: 'Apostas reais ficam bloqueadas até a API autenticada, wallet e ledger estarem ligados.',
};
