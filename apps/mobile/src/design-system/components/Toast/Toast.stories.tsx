import type { Meta, StoryObj } from '@storybook/react-native';

import { Toast } from './Toast';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  args: {
    title: 'Aposta registrada',
    message: 'O resultado será atualizado automaticamente.',
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const Success: Story = { args: { tone: 'success', title: 'Depósito concluído' } };
export const Warning: Story = { args: { tone: 'warning', title: 'Sessão próxima do limite' } };
export const Danger: Story = { args: { tone: 'danger', title: 'Não foi possível concluir' } };
export const WithAction: Story = { args: { actionLabel: 'Tentar novamente', onAction: () => undefined } };
