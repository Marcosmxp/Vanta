import type { Meta, StoryObj } from '@storybook/react-native';

import { legalStorySnapshot } from '../storybookFixtures';
import { PrivacyInformationScreen } from './PrivacyInformationScreen';

const meta = {
  title: 'Features/Legal/Privacy Information',
  component: PrivacyInformationScreen,
} satisfies Meta<typeof PrivacyInformationScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = { args: { disclosure: legalStorySnapshot.privacy } };
export const Disconnected: Story = { args: { disclosure: null } };
