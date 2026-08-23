import type { Meta, StoryObj } from '@storybook/react-native';

import { SystemStateScreen } from './SystemStateScreen';

const meta = {
  title: 'Core/System State/Screen',
  component: SystemStateScreen,
} satisfies Meta<typeof SystemStateScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    kind: 'loading',
    title: 'A carregar dados seguros',
    description: 'A aguardar a resposta do serviço autoritativo antes de apresentar informação sensível.',
  },
};

export const Offline: Story = {
  args: {
    kind: 'offline',
    title: 'Sem ligação',
    description: 'Não foi possível contactar os serviços Vanta. Operações sensíveis permanecem bloqueadas.',
    actionLabel: 'Tentar novamente',
    onAction: () => undefined,
  },
};

export const Error: Story = {
  args: {
    kind: 'error',
    title: 'Não foi possível carregar',
    description: 'O pedido falhou sem assumir sucesso local nem alterar o estado autorizado pelo servidor.',
    actionLabel: 'Repetir pedido',
    onAction: () => undefined,
  },
};
