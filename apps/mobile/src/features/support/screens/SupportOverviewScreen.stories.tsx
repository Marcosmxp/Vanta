import type { Meta, StoryObj } from '@storybook/react-native';

import { supportStoryCapabilities, supportStorySnapshot } from '../storybookFixtures';
import { SupportOverviewScreen } from './SupportOverviewScreen';

const meta = {
  title: 'Features/Support/Overview',
  component: SupportOverviewScreen,
  args: {
    onCreateRequest: () => undefined,
    onOpenRequest: () => undefined,
  },
} satisfies Meta<typeof SupportOverviewScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disconnected: Story = {};
export const Ready: Story = {
  args: {
    snapshot: supportStorySnapshot,
    capabilities: supportStoryCapabilities,
  },
};
