export function formatEuroMinor(amountMinor: number) {
  const major = amountMinor / 100;
  return `${major.toFixed(2).replace('.', ',')} €`;
}

export function formatMultiplierBps(multiplierBps: number | null) {
  if (multiplierBps === null) {
    return '—';
  }

  return `${(multiplierBps / 10_000).toFixed(2).replace('.', ',')}×`;
}

export function formatBetDate(isoDate: string) {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return 'Data indisponível';
  }

  return date.toLocaleString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
