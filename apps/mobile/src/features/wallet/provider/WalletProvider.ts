import type {
  WalletSnapshot,
  WalletTransactionDetailReadModel,
} from '../types';

export interface WalletProvider {
  getSnapshot(): Promise<WalletSnapshot>;
  getTransaction(transactionId: string): Promise<WalletTransactionDetailReadModel | null>;
}

export const disconnectedWalletSnapshot: WalletSnapshot = {
  balance: {
    walletId: null,
    currency: 'EUR',
    availability: 'unavailable',
    availableBalanceMinor: null,
    reservedBalanceMinor: null,
    totalBalanceMinor: null,
    asOf: null,
  },
  transactions: [],
  nextCursor: null,
  message: 'A carteira será apresentada quando a API financeira autenticada estiver ligada.',
};
