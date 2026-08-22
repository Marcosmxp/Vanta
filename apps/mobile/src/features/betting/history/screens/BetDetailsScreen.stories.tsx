import type { Meta, StoryObj } from '@storybook/react-native';

import type { BetDetails } from '../types';
import { BetDetailsScreen } from './BetDetailsScreen';

const settledBet: BetDetails = {
  betId: 'bet_storybook_001',
  game: 'plinko',
  status: 'settled',
  currency: 'EUR',
  stakeMinor: 500,
  payoutMinor: 1250,
  multiplierBps: 25000,
  placedAt: '2026-08-22T10:00:00Z',
  settledAt: '2026-08-22T10:00:03Z',
  rulesetId: 'plinko-storybook',
  rulesetVersion: 'visual-only',
  rows: 8,
  risk: 'medium',
  slot: 4,
};

const meta = {
  title: 'Features/Betting/BetDetails',
  component: BetDetailsScreen,
  args: {
    betId: 'bet_storybook_001',
  },
} satisfies Meta<typeof BetDetailsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unavailable: Story = {};
export const Settled: Story = { args: { details: settledBet } };
