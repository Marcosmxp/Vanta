import type { Meta, StoryObj } from '@storybook/react-native';

import type { PaymentIntentReadModel } from '../types';
import { PaymentStatusScreen } from './PaymentStatusScreen';

const baseIntent: PaymentIntentReadModel = {
  paymentIntentId: 'pi_storybook_001',
  kind: 'deposit',
  status: 'processing',
  amountMinor: 2500,
  currency: 'EUR',
  methodLabel: 'Cartão',
  createdAt: '2026-08-22T20:00:00Z',
  updatedAt: '2026-08-22T20:00:05Z',
};

const meta = {
  title: 'Features/Payments/PaymentStatus',
  component: PaymentStatusScreen,
  args: { intent: baseIntent, onDone: () => undefined },
} satisfies Meta<typeof PaymentStatusScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Processing: Story = {};
export const Succeeded: Story = { args: { intent: { ...baseIntent, status: 'succeeded' } } };
export const Failed: Story = {
  args: {
    intent: {
      ...baseIntent,
      status: 'failed',
      failureCode: 'storybook_declined',
      userMessage: 'Fixture visual: a operação não foi concluída.',
    },
  },
};
