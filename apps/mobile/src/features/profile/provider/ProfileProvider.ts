import type { ProfileSnapshot } from '../types';

export interface ProfileProvider {
  getProfile(): Promise<ProfileSnapshot>;
}

export const disconnectedProfileSnapshot: ProfileSnapshot = {
  availability: 'unavailable',
  identity: {
    playerId: null,
    displayName: null,
    emailMasked: null,
    phoneMasked: null,
    countryCode: null,
    memberSince: null,
  },
  verification: {
    ageVerified: null,
    kycStatus: 'required',
    accountStatus: 'restricted',
  },
  preferences: {
    language: null,
    marketingOptIn: null,
    protectionStatus: 'restricted',
  },
  message: 'O perfil será apresentado quando a API autenticada da conta estiver ligada.',
};
