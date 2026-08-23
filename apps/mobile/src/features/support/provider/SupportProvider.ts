import type {
  CreateSupportRequestInput,
  SupportCapabilities,
  SupportRequestSummary,
  SupportSnapshot,
} from '../types';

export interface SupportProvider {
  getSnapshot(): Promise<SupportSnapshot>;
  getRequest(requestId: string): Promise<SupportRequestSummary | null>;
  createRequest(input: CreateSupportRequestInput): Promise<SupportRequestSummary>;
}

export const disconnectedSupportSnapshot: SupportSnapshot = {
  availability: 'unavailable',
  topics: [],
  channels: [],
  recentRequests: [],
  message: 'O suporte será disponibilizado quando a API autenticada estiver ligada.',
};

export const disconnectedSupportCapabilities: SupportCapabilities = {
  canCreateRequest: false,
  maxMessageLength: 4000,
  message: 'Criação de pedidos desativada até existir persistência, ownership e auditoria server-side.',
};
