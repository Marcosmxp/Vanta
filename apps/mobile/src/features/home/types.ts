export type HomeWalletAvailability = 'ready' | 'unavailable' | 'restricted';

export interface HomeWalletSummary {
  currency: 'EUR';
  availableBalanceMinor: number | null;
  availability: HomeWalletAvailability;
}

export type HomeActivityKind = 'bet' | 'deposit' | 'withdrawal' | 'settlement';

export interface HomeActivityItem {
  id: string;
  kind: HomeActivityKind;
  title: string;
  occurredAt: string;
  amountMinor?: number;
  currency?: 'EUR';
}

export interface HomeFeaturedGame {
  id: 'plinko';
  title: string;
  eyebrow: string;
  description: string;
}

export interface HomeSnapshot {
  wallet: HomeWalletSummary;
  featuredGame: HomeFeaturedGame;
  recentActivity: readonly HomeActivityItem[];
}
