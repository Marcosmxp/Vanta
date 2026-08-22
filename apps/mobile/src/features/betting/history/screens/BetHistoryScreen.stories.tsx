import type { Meta, StoryObj } from '@storybook/react-native';

import type { BetHistorySnapshot } from '../types';
import { BetHistoryScreen } from './BetHistoryScreen';

const settledSnapshot: BetHistorySnapshot = {
  availability: 'ready',
  nextCursor: null,
  items: [
    {
      betId: 'bet_storybook_001',
      game: 'plinko',
      status: 'settled',
      currency: 'EUR',
      stakeMinor: 500,
      payoutMinor: 1250,
      multiplierBps: 25000,
      placedAt: '2026-08-22T10:00:00Z',
      settledAt: '2026-08-22T10:00:03Z',
    },
    {
      betId: 'bet_storybook_002',
      game: 'plinko',
      status: 'voided',
      currency: 'EUR',
      stakeMinor: 250,
      payoutMinor: 250,
      multiplierBps: null,
      placedAt: '2026-08-22T09:45:00Z',
      settledAt: '2026-08-22T09:45:05Z',
    },
  ],
};

const meta = {
  title: 'Features/Betting/BetHistory',
  component: BetHistoryScreen,
  args: {
    onOpenBet: () => undefined,
  },
} satisfies Meta<typeof BetHistoryScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disconnected: Story = {};
export const Populated: Story = { args: { snapshot: settledSnapshot } };
