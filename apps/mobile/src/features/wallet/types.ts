export type WalletAvailability = 'ready' | 'unavailable' | 'restricted';
export type WalletCurrency = 'EUR';
export type WalletTransactionDirection = 'credit' | 'debit';
export type WalletTransactionKind =
  | 'deposit'
  | 'withdrawal'
  | 'wager'
  | 'payout'
  | 'refund'
  | 'adjustment';
export type WalletTransactionStatus = 'pending' | 'completed' | 'failed' | 'reversed';

export interface WalletBalanceReadModel {
  walletId: string | null;
  currency: WalletCurrency;
  availability: WalletAvailability;
  availableBalanceMinor: number | null;
  reservedBalanceMinor: number | null;
  totalBalanceMinor: number | null;
  asOf: string | null;
}

export interface WalletTransactionReadModel {
  transactionId: string;
  kind: WalletTransactionKind;
  direction: WalletTransactionDirection;
  status: WalletTransactionStatus;
  amountMinor: number;
  currency: WalletCurrency;
  occurredAt: string;
  referenceId?: string;
  description: string;
}

export interface WalletSnapshot {
  balance: WalletBalanceReadModel;
  transactions: readonly WalletTransactionReadModel[];
  nextCursor: string | null;
  message?: string;
}

export interface WalletTransactionDetailReadModel extends WalletTransactionReadModel {
  walletId: string;
  balanceAfterMinor?: number;
  settledAt?: string;
}
