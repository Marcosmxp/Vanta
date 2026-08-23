import type { Meta, StoryObj } from '@storybook/react-native';

import { legalStorySnapshot } from '../storybookFixtures';
import { RegulatoryInformationScreen } from './RegulatoryInformationScreen';

const meta = {
  title: 'Features/Legal/Regulatory Information',
  component: RegulatoryInformationScreen,
} satisfies Meta<typeof RegulatoryInformationScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unconfigured: Story = { args: { disclosure: legalStorySnapshot.regulatory } };
export const Disconnected: Story = { args: { disclosure: null } };
