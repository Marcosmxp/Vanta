import type { Meta, StoryObj } from '@storybook/react-native';

import type { SecurityCapabilities, SecuritySession } from '../types';
import { SecuritySessionDetailsScreen } from './SecuritySessionDetailsScreen';

const session: SecuritySession = {
  sessionId: 'session_story_other',
  deviceLabel: 'Chrome on Windows',
  platform: 'Windows 11',
  ipMasked: '198.51.*.*',
  countryCode: 'PT',
  current: false,
  status: 'active',
  mfaUsed: false,
  trust: 'unrecognized',
  createdAt: '2026-08-22T18:00:00Z',
  lastSeenAt: '2026-08-22T18:05:00Z',
};

const capabilities: SecurityCapabilities = {
  canRevokeSession: true,
  canRevokeOtherSessions: true,
  canBeginMfaEnrollment: true,
  message: 'Storybook only.',
};

const meta = {
  title: 'Features/Security/Session Details',
  component: SecuritySessionDetailsScreen,
  args: {
    sessionId: session.sessionId,
    capabilities,
  },
} satisfies Meta<typeof SecuritySessionDetailsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unavailable: Story = {};
export const ActiveSession: Story = { args: { session } };
