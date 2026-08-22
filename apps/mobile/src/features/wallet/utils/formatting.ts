import type {
  WalletCurrency,
  WalletTransactionKind,
  WalletTransactionStatus,
} from '../types';

export function formatWalletAmount(amountMinor: number, currency: WalletCurrency) {
  const sign = amountMinor < 0 ? '-' : '';
  const absolute = Math.abs(amountMinor) / 100;
  const symbol = currency === 'EUR' ? '€' : currency;
  return `${sign}${absolute.toFixed(2).replace('.', ',')} ${symbol}`;
}

export function walletTransactionKindLabel(kind: WalletTransactionKind) {
  switch (kind) {
    case 'deposit':
      return 'Depósito';
    case 'withdrawal':
      return 'Levantamento';
    case 'wager':
      return 'Aposta';
    case 'payout':
      return 'Pagamento';
    case 'refund':
      return 'Reembolso';
    case 'adjustment':
      return 'Ajuste';
  }
}

export function walletTransactionStatusLabel(status: WalletTransactionStatus) {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'completed':
      return 'Concluído';
    case 'failed':
      return 'Falhou';
    case 'reversed':
      return 'Revertido';
  }
}
