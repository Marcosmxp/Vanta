import type { Meta, StoryObj } from '@storybook/react-native';

import type { PaymentCapabilitySnapshot } from '../types';
import { PaymentFlowScreen } from './PaymentFlowScreen';

const readyCapabilities: PaymentCapabilitySnapshot = {
  availability: 'ready',
  currency: 'EUR',
  minDepositMinor: 1000,
  maxDepositMinor: 100000,
  minWithdrawalMinor: 2000,
  maxWithdrawalMinor: 50000,
  depositMethods: [
    { id: 'storybook-card', label: 'Cartão', description: 'Fixture visual não produtiva.', enabled: true },
  ],
  withdrawalMethods: [
    { id: 'storybook-bank', label: 'Conta bancária', description: 'Fixture visual não produtiva.', enabled: true },
  ],
};

const meta = {
  title: 'Features/Payments/PaymentFlow',
  component: PaymentFlowScreen,
  args: { kind: 'deposit', onConfirm: () => undefined },
} satisfies Meta<typeof PaymentFlowScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DisconnectedDeposit: Story = {};
export const ReadyDeposit: Story = { args: { capabilities: readyCapabilities } };
export const ReadyWithdrawal: Story = { args: { kind: 'withdrawal', capabilities: readyCapabilities } };
