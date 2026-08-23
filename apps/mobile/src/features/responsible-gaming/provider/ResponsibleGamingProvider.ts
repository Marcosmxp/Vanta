import type {
  RequestMoneyLimitChangeInput,
  RequestSessionLimitChangeInput,
  ResponsibleGamingSnapshot,
  StartProtectionInput,
} from '../types';

export interface ResponsibleGamingProvider {
  getSnapshot(): Promise<ResponsibleGamingSnapshot>;
  requestMoneyLimitChange(input: RequestMoneyLimitChangeInput): Promise<ResponsibleGamingSnapshot>;
  requestSessionLimitChange(input: RequestSessionLimitChangeInput): Promise<ResponsibleGamingSnapshot>;
  startTimeOut(input: StartProtectionInput): Promise<ResponsibleGamingSnapshot>;
  startSelfExclusion(input: StartProtectionInput): Promise<ResponsibleGamingSnapshot>;
}

export const disconnectedResponsibleGamingSnapshot: ResponsibleGamingSnapshot = {
  availability: 'unavailable',
  state: 'restricted',
  message: 'Os controlos de jogo responsável serão carregados pela API autenticada.',
  limits: [],
  sessionLimit: null,
  activeTimeOut: null,
  selfExclusion: null,
  policy: {
    timeOutOptions: [],
    selfExclusionOptions: [],
    canRequestLimitChange: false,
    canStartTimeOut: false,
    canSelfExclude: false,
  },
};

function unavailable(): never {
  throw new Error('Responsible Gaming provider is unavailable until authenticated backend integration is configured.');
}

export const disconnectedResponsibleGamingProvider: ResponsibleGamingProvider = {
  async getSnapshot() {
    return disconnectedResponsibleGamingSnapshot;
  },
  async requestMoneyLimitChange() {
    return unavailable();
  },
  async requestSessionLimitChange() {
    return unavailable();
  },
  async startTimeOut() {
    return unavailable();
  },
  async startSelfExclusion() {
    return unavailable();
  },
};
