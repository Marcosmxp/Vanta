import type { Meta, StoryObj } from '@storybook/react-native';

import {
  readyResponsibleGamingStorySnapshot,
  selfExcludedResponsibleGamingStorySnapshot,
} from '../storybookFixtures';
import { ResponsibleGamingOverviewScreen } from './ResponsibleGamingOverviewScreen';

const meta = {
  title: 'Features/ResponsibleGaming/Overview',
  component: ResponsibleGamingOverviewScreen,
  args: {
    onOpenDestination: () => undefined,
  },
} satisfies Meta<typeof ResponsibleGamingOverviewScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disconnected: Story = {};
export const LimitsConfigured: Story = { args: { snapshot: readyResponsibleGamingStorySnapshot } };
export const SelfExcluded: Story = { args: { snapshot: selfExcludedResponsibleGamingStorySnapshot } };
