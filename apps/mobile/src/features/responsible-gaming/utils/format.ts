import type { LimitPeriod, MoneyLimitKind, ProtectionState } from '../types';

export function formatEuroMinor(amountMinor: number): string {
  return `${(amountMinor / 100).toFixed(2).replace('.', ',')} €`;
}

export function moneyLimitKindLabel(kind: MoneyLimitKind): string {
  switch (kind) {
    case 'deposit':
      return 'Depósitos';
    case 'net-loss':
      return 'Perdas líquidas';
    case 'wager':
      return 'Apostas';
  }
}

export function limitPeriodLabel(period: LimitPeriod): string {
  switch (period) {
    case 'daily':
      return 'Diário';
    case 'weekly':
      return 'Semanal';
    case 'monthly':
      return 'Mensal';
  }
}

export function protectionStateLabel(state: ProtectionState): string {
  switch (state) {
    case 'standard':
      return 'Proteção padrão';
    case 'limits-configured':
      return 'Limites configurados';
    case 'time-out':
      return 'Time-out ativo';
    case 'self-excluded':
      return 'Autoexclusão ativa';
    case 'restricted':
      return 'Proteção restrita';
  }
}
