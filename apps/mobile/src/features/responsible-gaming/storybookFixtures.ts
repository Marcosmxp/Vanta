import type { ResponsibleGamingSnapshot } from './types';

export const readyResponsibleGamingStorySnapshot: ResponsibleGamingSnapshot = {
  availability: 'ready',
  state: 'limits-configured',
  message: 'Fixtures visuais do Storybook; nenhum controlo real é alterado.',
  limits: [
    {
      limitId: 'limit_story_deposit_weekly',
      kind: 'deposit',
      period: 'weekly',
      currency: 'EUR',
      amountMinor: 25000,
      pendingChange: null,
    },
    {
      limitId: 'limit_story_loss_monthly',
      kind: 'net-loss',
      period: 'monthly',
      currency: 'EUR',
      amountMinor: 40000,
      pendingChange: {
        requestedAmountMinor: 50000,
        requestedAt: '2026-08-22T10:00:00Z',
        effectiveAt: '2026-08-24T10:00:00Z',
        direction: 'increase',
      },
    },
  ],
  sessionLimit: {
    minutes: 120,
    pendingChange: null,
  },
  activeTimeOut: null,
  selfExclusion: null,
  policy: {
    timeOutOptions: [
      { optionId: 'timeout_story_short', label: 'Pausa curta', description: 'Opção visual fornecida pelo mock do Storybook.' },
      { optionId: 'timeout_story_long', label: 'Pausa prolongada', description: 'A duração real seria definida pela política do backend.' },
    ],
    selfExclusionOptions: [
      { optionId: 'exclude_story_fixed', label: 'Autoexclusão por período', description: 'Exemplo visual não produtivo.' },
      { optionId: 'exclude_story_open', label: 'Autoexclusão sem término apresentado', description: 'O backend determina a política aplicável.' },
    ],
    canRequestLimitChange: true,
    canStartTimeOut: true,
    canSelfExclude: true,
  },
};

export const selfExcludedResponsibleGamingStorySnapshot: ResponsibleGamingSnapshot = {
  ...readyResponsibleGamingStorySnapshot,
  state: 'self-excluded',
  limits: [],
  sessionLimit: null,
  selfExclusion: {
    optionId: 'exclude_story_open',
    label: 'Autoexclusão ativa',
    startedAt: '2026-08-23T06:00:00Z',
    endsAt: null,
  },
  policy: {
    timeOutOptions: [],
    selfExclusionOptions: [],
    canRequestLimitChange: false,
    canStartTimeOut: false,
    canSelfExclude: false,
  },
};
