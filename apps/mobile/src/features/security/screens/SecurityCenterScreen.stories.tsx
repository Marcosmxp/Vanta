import type { Meta, StoryObj } from '@storybook/react-native';

import type { SecurityCapabilities, SecuritySnapshot } from '../types';
import { SecurityCenterScreen } from './SecurityCenterScreen';

const readySnapshot: SecuritySnapshot = {
  availability: 'ready',
  mfaStatus: 'enabled',
  sessions: [
    {
      sessionId: 'session_story_current',
      deviceLabel: 'Pixel 9 Pro',
      platform: 'Android 16',
      ipMasked: '203.0.*.*',
      countryCode: 'PT',
      current: true,
      status: 'active',
      mfaUsed: true,
      trust: 'trusted',
      createdAt: '2026-08-20T08:00:00Z',
      lastSeenAt: '2026-08-23T06:10:00Z',
    },
    {
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
    },
  ],
};

const readyCapabilities: SecurityCapabilities = {
  canRevokeSession: true,
  canRevokeOtherSessions: true,
  canBeginMfaEnrollment: false,
  message: 'Fixtures visuais do Storybook; nenhuma sessão real é alterada.',
};

const meta = {
  title: 'Features/Security/Center',
  component: SecurityCenterScreen,
  args: {
    onOpenSession: () => undefined,
  },
} satisfies Meta<typeof SecurityCenterScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disconnected: Story = {};
export const Ready: Story = { args: { snapshot: readySnapshot, capabilities: readyCapabilities } };
