import { ScreenScaffold } from './ScreenScaffold';

export function WalletScreen() {
  return (
    <ScreenScaffold
      eyebrow="Financeiro"
      title="Carteira"
      description="Shell da experiência financeira para saldo, depósitos, levantamentos e histórico."
      statusLabel="Wallet route ready"
    />
  );
}
