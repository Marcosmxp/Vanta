import type { Meta, StoryObj } from '@storybook/react-native';

import { readyResponsibleGamingStorySnapshot } from '../storybookFixtures';
import { ResponsibleGamingTimeOutScreen } from './ResponsibleGamingTimeOutScreen';

const meta = {
  title: 'Features/ResponsibleGaming/TimeOut',
  component: ResponsibleGamingTimeOutScreen,
  args: {
    onStartTimeOut: () => undefined,
  },
} satisfies Meta<typeof ResponsibleGamingTimeOutScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disconnected: Story = {};
export const AvailableOptions: Story = { args: { snapshot: readyResponsibleGamingStorySnapshot } };
