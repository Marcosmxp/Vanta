import type { Meta, StoryObj } from '@storybook/react-native';

import type { ProfileSnapshot } from '../types';
import { ProfileOverviewScreen } from './ProfileOverviewScreen';

const readySnapshot: ProfileSnapshot = {
  availability: 'ready',
  identity: {
    playerId: 'player_storybook_001',
    displayName: 'Marcos',
    emailMasked: 'm***@example.com',
    phoneMasked: '+351 *** *** 210',
    countryCode: 'PT',
    memberSince: '22/08/2026',
  },
  verification: {
    ageVerified: true,
    kycStatus: 'verified',
    accountStatus: 'active',
  },
  preferences: {
    language: 'pt-PT',
    marketingOptIn: false,
    protectionStatus: 'limits-configured',
  },
};

const meta = {
  title: 'Features/Profile/Overview',
  component: ProfileOverviewScreen,
  args: {
    onOpenDestination: () => undefined,
  },
} satisfies Meta<typeof ProfileOverviewScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disconnected: Story = {};
export const VerifiedAccount: Story = { args: { snapshot: readySnapshot } };
