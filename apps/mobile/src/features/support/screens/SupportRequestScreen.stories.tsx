import type { Meta, StoryObj } from '@storybook/react-native';

import { supportStoryCapabilities } from '../storybookFixtures';
import { SupportRequestScreen } from './SupportRequestScreen';

const meta = {
  title: 'Features/Support/Create Request',
  component: SupportRequestScreen,
  args: {
    onSubmit: () => undefined,
  },
} satisfies Meta<typeof SupportRequestScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disconnected: Story = {};
export const Ready: Story = {
  args: {
    categories: ['Segurança', 'Pagamentos', 'Conta', 'Técnico'],
    capabilities: supportStoryCapabilities,
  },
};
