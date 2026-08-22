import type { Meta, StoryObj } from '@storybook/react-native';

import { WalletSummaryCard } from './WalletSummaryCard';

const meta = {
  title: 'Home/WalletSummaryCard',
  component: WalletSummaryCard,
  args: {
    wallet: {
      currency: 'EUR',
      availableBalanceMinor: 125450,
      availability: 'ready',
    },
    onOpenWallet: () => undefined,
  },
} satisfies Meta<typeof WalletSummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Unavailable: Story = {
  args: {
    wallet: {
      currency: 'EUR',
      availableBalanceMinor: null,
      availability: 'unavailable',
    },
  },
};

export const Restricted: Story = {
  args: {
    wallet: {
      currency: 'EUR',
      availableBalanceMinor: null,
      availability: 'restricted',
    },
  },
};
