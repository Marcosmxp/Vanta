import type { KycDocumentType } from '../../features/kyc/types';

export type RootStackParamList = {
  Auth: undefined;
  Kyc: undefined;
  Main: undefined;
  SessionExpired: undefined;
  AccountBlocked: undefined;
};

export type VerificationPurpose = 'registration' | 'password-reset';

export type AuthStackParamList = {
  Splash: undefined;
  OnboardingOne: undefined;
  OnboardingTwo: undefined;
  OnboardingThree: undefined;
  Eligibility: undefined;
  Welcome: undefined;
  Login: undefined;
  CreateAccount: undefined;
  Verification: { purpose: VerificationPurpose };
  ForgotPassword: undefined;
  ResetPassword: undefined;
};

export type KycStackParamList = {
  Intro: undefined;
  DocumentType: undefined;
  DocumentCapture: { documentType: KycDocumentType };
  Selfie: undefined;
  Processing: undefined;
  Approved: undefined;
  Rejected: undefined;
  Retry: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  BetHistory: undefined;
  BetDetails: { betId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Play: undefined;
  Wallet: undefined;
  Profile: undefined;
};
