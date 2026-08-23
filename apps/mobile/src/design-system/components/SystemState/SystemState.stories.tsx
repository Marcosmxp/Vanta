import type { Meta, StoryObj } from '@storybook/react-native';

import { SystemState } from './SystemState';

const meta = {
  title: 'Design System/SystemState',
  component: SystemState,
  args: {
    title: 'Estado do sistema',
    description: 'Mensagem descritiva do estado atual.',
  },
} satisfies Meta<typeof SystemState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = { args: { kind: 'loading', title: 'A carregar', description: 'A obter dados autorizados do Vanta.' } };
export const Empty: Story = { args: { kind: 'empty', title: 'Sem dados', description: 'Ainda não existem dados para apresentar.' } };
export const Offline: Story = { args: { kind: 'offline', title: 'Sem ligação', description: 'Verifique a ligação e tente novamente.' } };
export const Error: Story = { args: { kind: 'error', title: 'Não foi possível carregar', description: 'O pedido falhou sem alterar qualquer estado sensível.' } };
export const Maintenance: Story = { args: { kind: 'maintenance', title: 'Manutenção em curso', description: 'O serviço está temporariamente indisponível.' } };
export const Compact: Story = { args: { kind: 'empty', compact: true, title: 'Sem movimentos', description: 'A atividade aparecerá aqui quando existir.' } };
