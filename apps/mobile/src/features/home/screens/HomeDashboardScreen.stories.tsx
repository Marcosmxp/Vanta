import type { Meta, StoryObj } from '@storybook/react-native';

import { HomeDashboardScreen } from './HomeDashboardScreen';

const meta = {
  title: 'Home/Dashboard',
  component: HomeDashboardScreen,
  args: {
    onOpenWallet: () => undefined,
    onOpenPlay: () => undefined,
    onOpenProfile: () => undefined,
  },
} satisfies Meta<typeof HomeDashboardScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
