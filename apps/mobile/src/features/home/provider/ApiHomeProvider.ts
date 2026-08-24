import type { SessionContextValue } from '../../../core/session/types';
import { createApiWalletProvider } from '../../wallet/provider/ApiWalletProvider';
import type { WalletTransactionKind } from '../../wallet/types';
import type { HomeProvider } from './HomeProvider';
import type { HomeActivityKind, HomeSnapshot } from '../types';

function activityKind(kind: WalletTransactionKind): HomeActivityKind {
  switch (kind) {
    case 'deposit':
      return 'deposit';
    case 'withdrawal':
      return 'withdrawal';
    case 'wager':
      return 'bet';
    case 'payout':
    case 'refund':
    case 'adjustment':
      return 'settlement';
  }
}

export function createApiHomeProvider(request: SessionContextValue['request']): HomeProvider {
  const walletProvider = createApiWalletProvider(request);

  return {
    async getHomeSnapshot(): Promise<HomeSnapshot> {
      const wallet = await walletProvider.getSnapshot();
      return {
        wallet: {
          currency: wallet.balance.currency,
          availableBalanceMinor: wallet.balance.availableBalanceMinor,
          availability: wallet.balance.availability,
        },
        featuredGame: {
          id: 'plinko',
          eyebrow: 'Vanta Originals',
          title: 'Plinko',
          description: 'Experiência visual pronta; apostas reais permanecem bloqueadas até o endpoint autoritativo de wagering existir.',
        },
        recentActivity: wallet.transactions.slice(0, 3).map((transaction) => ({
          id: transaction.transactionId,
          kind: activityKind(transaction.kind),
          title: transaction.description,
          occurredAt: transaction.occurredAt,
          amountMinor: transaction.amountMinor,
          currency: transaction.currency,
        })),
      };
    },
  };
}
