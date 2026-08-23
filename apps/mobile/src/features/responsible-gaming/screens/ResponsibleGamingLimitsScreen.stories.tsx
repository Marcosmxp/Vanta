import type { Meta, StoryObj } from '@storybook/react-native';

import { readyResponsibleGamingStorySnapshot } from '../storybookFixtures';
import { ResponsibleGamingLimitsScreen } from './ResponsibleGamingLimitsScreen';

const meta = {
  title: 'Features/ResponsibleGaming/Limits',
  component: ResponsibleGamingLimitsScreen,
  args: {
    onRequestMoneyLimitChange: () => undefined,
    onRequestSessionLimitChange: () => undefined,
  },
} satisfies Meta<typeof ResponsibleGamingLimitsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disconnected: Story = {};
export const Configured: Story = { args: { snapshot: readyResponsibleGamingStorySnapshot } };
