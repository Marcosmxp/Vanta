import type { Meta, StoryObj } from '@storybook/react-native';

import { legalStorySnapshot } from '../storybookFixtures';
import { LegalCenterScreen } from './LegalCenterScreen';

const meta = {
  title: 'Features/Legal/Center',
  component: LegalCenterScreen,
  args: {
    onOpenDocument: () => undefined,
    onOpenPrivacy: () => undefined,
    onOpenRegulatory: () => undefined,
  },
} satisfies Meta<typeof LegalCenterScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disconnected: Story = {};
export const Ready: Story = { args: { snapshot: legalStorySnapshot } };
