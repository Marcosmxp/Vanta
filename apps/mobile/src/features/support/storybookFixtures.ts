import type { SupportCapabilities, SupportSnapshot } from './types';

export const supportStorySnapshot: SupportSnapshot = {
  availability: 'ready',
  topics: [
    {
      topicId: 'topic_security',
      category: 'Segurança',
      title: 'Não reconheço uma sessão',
      summary: 'Use o Security Center e contacte o suporte se identificar atividade que não reconhece.',
    },
    {
      topicId: 'topic_payments',
      category: 'Pagamentos',
      title: 'Estado de um levantamento',
      summary: 'Consulte primeiro o movimento da carteira e use o identificador da transação ao pedir ajuda.',
    },
  ],
  channels: [
    { channelId: 'channel_inapp', type: 'in-app', label: 'Suporte dentro da aplicação', target: 'Canal autenticado' },
    { channelId: 'channel_web', type: 'web', label: 'Central de ajuda', target: 'URL fornecida pelo backend' },
  ],
  recentRequests: [
    {
      requestId: 'support_story_001',
      category: 'Segurança',
      subject: 'Sessão desconhecida',
      status: 'open',
      createdAt: '2026-08-22T10:00:00Z',
      updatedAt: '2026-08-23T07:30:00Z',
    },
  ],
  message: 'Fixture visual do Storybook; nenhum pedido real é carregado.',
};

export const supportStoryCapabilities: SupportCapabilities = {
  canCreateRequest: true,
  maxMessageLength: 4000,
  message: 'Fixture visual. O submit do Storybook não cria ticket real.',
};
