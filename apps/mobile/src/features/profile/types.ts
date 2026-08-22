export type ProfileAvailability = 'ready' | 'unavailable' | 'restricted';
export type ProfileKycStatus = 'verified' | 'pending' | 'required' | 'rejected';
export type ProfileAccountStatus = 'active' | 'restricted' | 'blocked';
export type ProfileProtectionStatus = 'standard' | 'limits-configured' | 'restricted';
export type ProfileLanguage = 'pt-PT' | 'en';

export interface ProfileIdentityReadModel {
  playerId: string | null;
  displayName: string | null;
  emailMasked: string | null;
  phoneMasked: string | null;
  countryCode: string | null;
  memberSince: string | null;
}

export interface ProfileVerificationReadModel {
  ageVerified: boolean | null;
  kycStatus: ProfileKycStatus;
  accountStatus: ProfileAccountStatus;
}

export interface ProfilePreferencesReadModel {
  language: ProfileLanguage | null;
  marketingOptIn: boolean | null;
  protectionStatus: ProfileProtectionStatus;
}

export interface ProfileSnapshot {
  availability: ProfileAvailability;
  identity: ProfileIdentityReadModel;
  verification: ProfileVerificationReadModel;
  preferences: ProfilePreferencesReadModel;
  message?: string;
}
