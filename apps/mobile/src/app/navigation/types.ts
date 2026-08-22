export type RootStackParamList = {
  Auth: undefined;
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

export type MainTabParamList = {
  Home: undefined;
  Play: undefined;
  Wallet: undefined;
  Profile: undefined;
};
