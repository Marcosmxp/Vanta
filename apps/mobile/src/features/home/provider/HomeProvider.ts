import type { HomeSnapshot } from '../types';

/**
 * Read-only boundary for the authenticated Home experience.
 *
 * Implementations must source wallet and activity data from trusted backend APIs.
 * The mobile client may format and render these values, but it must never become
 * the canonical source of financial state.
 */
export interface HomeProvider {
  getHomeSnapshot(): Promise<HomeSnapshot>;
}

/**
 * Safe disconnected state used until the authenticated API integration exists.
 * It deliberately contains no fabricated balance or financial activity.
 */
export const disconnectedHomeSnapshot: HomeSnapshot = {
  wallet: {
    currency: 'EUR',
    availableBalanceMinor: null,
    availability: 'unavailable',
  },
  featuredGame: {
    id: 'plinko',
    eyebrow: 'Vanta Originals',
    title: 'Plinko',
    description: 'Uma experiência rápida e visual. O resultado real será sempre decidido pelo servidor.',
  },
  recentActivity: [],
};
