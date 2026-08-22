import type { Meta, StoryObj } from '@storybook/react-native';

import type { WalletSnapshot } from '../types';
import { WalletOverviewScreen } from './WalletOverviewScreen';

const readySnapshot: WalletSnapshot = {
  balance: {
    walletId: 'wallet_storybook_001',
    currency: 'EUR',
    availability: 'ready',
    availableBalanceMinor: 12450,
    reservedBalanceMinor: 1550,
    totalBalanceMinor: 14000,
    asOf: '2026-08-22T20:00:00Z',
  },
  transactions: [
    {
      transactionId: 'txn_storybook_001',
      kind: 'payout',
      direction: 'credit',
      status: 'completed',
      amountMinor: 2500,
      currency: 'EUR',
      occurredAt: '2026-08-22T19:55:03Z',
      referenceId: 'bet_storybook_001',
      description: 'Pagamento Plinko',
    },
    {
      transactionId: 'txn_storybook_002',
      kind: 'wager',
      direction: 'debit',
      status: 'completed',
      amountMinor: 1000,
      currency: 'EUR',
      occurredAt: '2026-08-22T19:55:00Z',
      referenceId: 'bet_storybook_001',
      description: 'Aposta Plinko',
    },
  ],
  nextCursor: null,
};

const meta = {
  title: 'Features/Wallet/Overview',
  component: WalletOverviewScreen,
  args: {
    onDeposit: () => undefined,
    onWithdraw: () => undefined,
    onOpenBetHistory: () => undefined,
    onOpenTransaction: () => undefined,
  },
} satisfies Meta<typeof WalletOverviewScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disconnected: Story = {};
export const ReadyWithTransactions: Story = { args: { snapshot: readySnapshot } };
