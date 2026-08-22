import type { Meta, StoryObj } from '@storybook/react-native';

import type { PlinkoProvider } from '../provider/PlinkoProvider';
import type { PlinkoSnapshot } from '../types';
import { PlinkoGameScreen } from './PlinkoGameScreen';

const previewSnapshot: PlinkoSnapshot = {
  availability: 'ready',
  availableBalanceMinor: 25_000,
  ruleset: {
    id: 'storybook-preview',
    version: 'preview-v1',
    rows: 8,
    risk: 'medium',
    currency: 'EUR',
    minStakeMinor: 50,
    maxStakeMinor: 5_000,
    multipliersBps: [20_000, 15_000, 12_000, 10_000, 5_000, 10_000, 12_000, 15_000, 20_000],
  },
  message: 'Storybook preview only. These values are not production game math.',
};

const previewProvider: PlinkoProvider = {
  async getSnapshot() {
    return previewSnapshot;
  },
  async placeBet(input) {
    return {
      betId: 'preview-bet-001',
      rulesetId: 'storybook-preview',
      rulesetVersion: input.rulesetVersion,
      stakeMinor: input.stakeMinor,
      currency: 'EUR',
      path: ['left', 'right', 'right', 'left', 'right', 'left', 'left', 'right'],
      slot: 4,
      multiplierBps: 5_000,
      payoutMinor: Math.floor(input.stakeMinor / 2),
    };
  },
};

const meta = {
  title: 'Games/Plinko/GameScreen',
  component: PlinkoGameScreen,
} satisfies Meta<typeof PlinkoGameScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disconnected: Story = {};

export const DeterministicPreview: Story = {
  args: {
    snapshot: previewSnapshot,
    provider: previewProvider,
  },
};
