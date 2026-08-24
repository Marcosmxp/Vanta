export type ResponsibleGamingAvailability = 'ready' | 'unavailable' | 'restricted';
export type ProtectionState =
  | 'standard'
  | 'limits-configured'
  | 'time-out'
  | 'self-excluded'
  | 'restricted';

export type MoneyLimitKind = 'deposit' | 'net-loss' | 'wager';
export type LimitPeriod = 'daily' | 'weekly' | 'monthly';
export type LimitChangeDirection = 'decrease' | 'increase';

export interface PendingMoneyLimitChange {
  requestedAmountMinor: number;
  requestedAt: string;
  effectiveAt: string | null;
  direction: LimitChangeDirection;
}

export interface MoneyLimitView {
  limitId: string;
  kind: MoneyLimitKind;
  period: LimitPeriod;
  currency: 'EUR';
  amountMinor: number;
  pendingChange: PendingMoneyLimitChange | null;
}

export interface PendingSessionLimitChange {
  requestedMinutes: number;
  requestedAt: string;
  effectiveAt: string | null;
  direction: LimitChangeDirection;
}

export interface SessionLimitView {
  minutes: number;
  pendingChange: PendingSessionLimitChange | null;
}

export interface ResponsibleGamingPolicyOption {
  optionId: string;
  label: string;
  description: string | null;
}

export interface ActiveProtectionRestriction {
  optionId: string;
  label: string;
  startedAt: string;
  endsAt: string | null;
}

export interface ResponsibleGamingPolicy {
  timeOutOptions: ResponsibleGamingPolicyOption[];
  selfExclusionOptions: ResponsibleGamingPolicyOption[];
  canRequestLimitChange: boolean;
  canStartTimeOut: boolean;
  canSelfExclude: boolean;
}

export interface ResponsibleGamingSnapshot {
  availability: ResponsibleGamingAvailability;
  state: ProtectionState;
  message: string | null;
  limits: MoneyLimitView[];
  sessionLimit: SessionLimitView | null;
  activeTimeOut: ActiveProtectionRestriction | null;
  selfExclusion: ActiveProtectionRestriction | null;
  policy: ResponsibleGamingPolicy;
}

export interface RequestMoneyLimitChangeInput {
  limitId: string;
  requestedAmountMinor: number;
  idempotencyKey: string;
}

export interface RequestSessionLimitChangeInput {
  requestedMinutes: number;
  idempotencyKey: string;
}

export interface StartProtectionInput {
  optionId: string;
  idempotencyKey: string;
  acknowledged?: boolean;
}
