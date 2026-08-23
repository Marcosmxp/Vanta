import type { Meta, StoryObj } from '@storybook/react-native';

import { supportStorySnapshot } from '../storybookFixtures';
import { SupportRequestDetailsScreen } from './SupportRequestDetailsScreen';

const meta = {
  title: 'Features/Support/Request Details',
  component: SupportRequestDetailsScreen,
  args: {
    requestId: 'support_story_001',
    request: null,
  },
} satisfies Meta<typeof SupportRequestDetailsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {};
export const OpenRequest: Story = { args: { request: supportStorySnapshot.recentRequests[0] ?? null } };
