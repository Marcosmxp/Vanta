import type { Meta, StoryObj } from '@storybook/react-native';

import {
  readyResponsibleGamingStorySnapshot,
  selfExcludedResponsibleGamingStorySnapshot,
} from '../storybookFixtures';
import { ResponsibleGamingSelfExclusionScreen } from './ResponsibleGamingSelfExclusionScreen';

const meta = {
  title: 'Features/ResponsibleGaming/SelfExclusion',
  component: ResponsibleGamingSelfExclusionScreen,
  args: {
    onStartSelfExclusion: () => undefined,
  },
} satisfies Meta<typeof ResponsibleGamingSelfExclusionScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disconnected: Story = {};
export const AvailableOptions: Story = { args: { snapshot: readyResponsibleGamingStorySnapshot } };
export const Active: Story = { args: { snapshot: selfExcludedResponsibleGamingStorySnapshot } };
