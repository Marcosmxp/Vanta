export type PaymentFlowKind = 'deposit' | 'withdrawal';
export type PaymentAvailability = 'disconnected' | 'ready' | 'restricted';
export type PaymentIntentStatus =
  | 'requires_action'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'cancelled';

export interface PaymentMethodView {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface PaymentCapabilitySnapshot {
  availability: PaymentAvailability;
  currency: 'EUR';
  minDepositMinor: number | null;
  maxDepositMinor: number | null;
  minWithdrawalMinor: number | null;
  maxWithdrawalMinor: number | null;
  depositMethods: readonly PaymentMethodView[];
  withdrawalMethods: readonly PaymentMethodView[];
  message?: string;
}

export interface CreatePaymentIntentInput {
  kind: PaymentFlowKind;
  amountMinor: number;
  currency: 'EUR';
  methodId: string;
  idempotencyKey: string;
}

export interface PaymentIntentReadModel {
  paymentIntentId: string;
  kind: PaymentFlowKind;
  status: PaymentIntentStatus;
  amountMinor: number;
  currency: 'EUR';
  methodLabel: string;
  createdAt: string;
  updatedAt: string;
  failureCode?: string;
  userMessage?: string;
}
