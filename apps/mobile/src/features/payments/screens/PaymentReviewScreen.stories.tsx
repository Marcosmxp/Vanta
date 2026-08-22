import type { Meta, StoryObj } from '@storybook/react-native';

import { PaymentReviewScreen } from './PaymentReviewScreen';

const meta = {
  title: 'Features/Payments/PaymentReview',
  component: PaymentReviewScreen,
  args: {
    kind: 'deposit',
    amountMinor: 2500,
    methodLabel: 'Cartão',
    onConfirm: () => undefined,
    onEdit: () => undefined,
  },
} satisfies Meta<typeof PaymentReviewScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DepositReview: Story = {};
export const WithdrawalReview: Story = {
  args: { kind: 'withdrawal', amountMinor: 5000, methodLabel: 'Conta bancária' },
};
export const Submitting: Story = { args: { submitting: true } };
