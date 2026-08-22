import type { Meta, StoryObj } from '@storybook/react-native';

import type { WalletTransactionDetailReadModel } from '../types';
import { WalletTransactionDetailsScreen } from './WalletTransactionDetailsScreen';

const transaction: WalletTransactionDetailReadModel = {
  transactionId: 'txn_storybook_001',
  walletId: 'wallet_storybook_001',
  kind: 'payout',
  direction: 'credit',
  status: 'completed',
  amountMinor: 2500,
  currency: 'EUR',
  occurredAt: '2026-08-22T19:55:03Z',
  settledAt: '2026-08-22T19:55:04Z',
  referenceId: 'bet_storybook_001',
  description: 'Pagamento Plinko',
  balanceAfterMinor: 12450,
};

const meta = {
  title: 'Features/Wallet/TransactionDetails',
  component: WalletTransactionDetailsScreen,
  args: {
    transactionId: 'txn_storybook_001',
    transaction: null,
  },
} satisfies Meta<typeof WalletTransactionDetailsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unavailable: Story = {};
export const CompletedCredit: Story = { args: { transaction } };
