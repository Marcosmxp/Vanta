import type { Meta, StoryObj } from '@storybook/react-native';

import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  args: {
    label: 'E-mail',
    placeholder: 'nome@exemplo.com',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHelper: Story = { args: { helperText: 'Use o e-mail verificado da sua conta.' } };
export const Error: Story = { args: { errorMessage: 'Insira um e-mail válido.' } };
export const Disabled: Story = { args: { editable: false, value: 'conta@vanta.test' } };
export const Password: Story = { args: { label: 'Senha', secureTextEntry: true, placeholder: '••••••••' } };
