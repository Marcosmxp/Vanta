import type {
  PlinkoAuthoritativeResult,
  PlinkoRulesetView,
} from '../types';

export function isRenderablePlinkoResult(
  result: PlinkoAuthoritativeResult,
  ruleset: PlinkoRulesetView,
): boolean {
  if (result.rulesetId !== ruleset.id || result.rulesetVersion !== ruleset.version) {
    return false;
  }
  if (result.currency !== ruleset.currency || result.path.length !== ruleset.rows) {
    return false;
  }
  if (result.slot < 0 || result.slot > ruleset.rows) {
    return false;
  }
  if (!result.path.every((direction) => direction === 'left' || direction === 'right')) {
    return false;
  }

  const expectedSlot = result.path.reduce(
    (rights, direction) => rights + (direction === 'right' ? 1 : 0),
    0,
  );
  if (expectedSlot !== result.slot) {
    return false;
  }

  const expectedMultiplier = ruleset.multipliersBps[result.slot];
  if (expectedMultiplier === undefined || expectedMultiplier !== result.multiplierBps) {
    return false;
  }

  return Number.isInteger(result.stakeMinor) && result.stakeMinor > 0 && Number.isInteger(result.payoutMinor);
}
