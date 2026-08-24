import type { SessionContextValue } from '../../../core/session/types';
import type { WalletProvider } from './WalletProvider';
import type {
  WalletSnapshot,
  WalletTransactionDetailReadModel,
} from '../types';

export function createApiWalletProvider(request: SessionContextValue['request']): WalletProvider {
  const loadSnapshot = () => request<WalletSnapshot>('/v1/wallet');

  return {
    getSnapshot: loadSnapshot,
    async getTransaction(transactionId: string): Promise<WalletTransactionDetailReadModel | null> {
      const snapshot = await loadSnapshot();
      const transaction = snapshot.transactions.find((item) => item.transactionId === transactionId);
      if (!transaction || !snapshot.balance.walletId) {
        return null;
      }
      return {
        ...transaction,
        walletId: snapshot.balance.walletId,
      };
    },
  };
}
