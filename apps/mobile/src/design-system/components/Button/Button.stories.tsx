import type { Meta, StoryObj } from '@storybook/react-native';

import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    label: 'Continuar',
  },
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Danger: Story = { args: { variant: 'danger', label: 'Bloquear conta' } };
export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true } };
export const FullWidth: Story = { args: { fullWidth: true } };
