import { ScreenScaffold } from './ScreenScaffold';

export function SecurityCenterRouteScreen() {
  return (
    <ScreenScaffold
      eyebrow="Segurança"
      title="Security Center"
      description="Entrada reservada para sessões, dispositivos, autenticação forte e controlos de segurança da Fase 13."
      statusLabel="Phase 13 boundary ready"
    />
  );
}
