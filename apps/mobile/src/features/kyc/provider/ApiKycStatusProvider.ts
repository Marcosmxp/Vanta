import type { SessionContextValue } from '../../../core/session/types';
import type { KycVerificationSnapshot } from '../types';

export interface CurrentKycStatusProvider {
  getCurrentVerification(): Promise<KycVerificationSnapshot>;
}

export function createApiKycStatusProvider(
  request: SessionContextValue['request'],
): CurrentKycStatusProvider {
  return {
    async getCurrentVerification() {
      const response = await request<KycVerificationSnapshot & { updatedAt?: string }>(
        '/v1/kyc/status',
      );
      return {
        status: response.status,
        ...(response.rejectionCode ? { rejectionCode: response.rejectionCode } : {}),
      };
    },
  };
}
