export function parseEuroAmountToMinor(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;

  const [whole = '0', fraction = ''] = normalized.split('.');
  const wholeMinor = Number(whole) * 100;
  const fractionMinor = Number(fraction.padEnd(2, '0'));
  const amountMinor = wholeMinor + fractionMinor;

  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) return null;
  return amountMinor;
}

export function formatEuroMinor(amountMinor: number): string {
  return `${(amountMinor / 100).toFixed(2).replace('.', ',')} €`;
}
