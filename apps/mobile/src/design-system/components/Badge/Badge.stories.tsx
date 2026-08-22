import type { Meta, StoryObj } from '@storybook/react-native';

import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { label: 'Pendente' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const Brand: Story = { args: { tone: 'brand', label: 'Vanta' } };
export const Success: Story = { args: { tone: 'success', label: 'Aprovado' } };
export const Warning: Story = { args: { tone: 'warning', label: 'Em análise' } };
export const Danger: Story = { args: { tone: 'danger', label: 'Falhou' } };
