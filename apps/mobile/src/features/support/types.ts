export type SupportAvailability = 'ready' | 'unavailable' | 'restricted';
export type SupportRequestStatus = 'open' | 'waiting-player' | 'resolved' | 'closed';
export type SupportChannelType = 'in-app' | 'email' | 'web';

export interface SupportTopic {
  topicId: string;
  category: string;
  title: string;
  summary: string;
}

export interface SupportChannel {
  channelId: string;
  type: SupportChannelType;
  label: string;
  target: string;
}

export interface SupportRequestSummary {
  requestId: string;
  category: string;
  subject: string;
  status: SupportRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SupportSnapshot {
  availability: SupportAvailability;
  topics: readonly SupportTopic[];
  channels: readonly SupportChannel[];
  recentRequests: readonly SupportRequestSummary[];
  message?: string;
}

export interface SupportCapabilities {
  canCreateRequest: boolean;
  maxMessageLength: number;
  message?: string;
}

export interface CreateSupportRequestInput {
  category: string;
  subject: string;
  message: string;
  idempotencyKey: string;
}
