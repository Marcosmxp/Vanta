import type {
  CreatePaymentIntentInput,
  PaymentCapabilitySnapshot,
  PaymentIntentReadModel,
} from '../types';

export interface PaymentProvider {
  getCapabilities(): Promise<PaymentCapabilitySnapshot>;
  createIntent(input: CreatePaymentIntentInput): Promise<PaymentIntentReadModel>;
  getIntent(paymentIntentId: string): Promise<PaymentIntentReadModel | null>;
}

export const disconnectedPaymentCapabilities: PaymentCapabilitySnapshot = {
  availability: 'disconnected',
  currency: 'EUR',
  minDepositMinor: null,
  maxDepositMinor: null,
  minWithdrawalMinor: null,
  maxWithdrawalMinor: null,
  depositMethods: [],
  withdrawalMethods: [],
  message:
    'Pagamentos reais permanecem indisponíveis até que provider, ledger, KYC/AML, limites e idempotência estejam integrados.',
};
