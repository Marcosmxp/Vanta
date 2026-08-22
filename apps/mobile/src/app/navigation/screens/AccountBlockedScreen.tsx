import { ScreenScaffold } from './ScreenScaffold';

export function AccountBlockedScreen() {
  return (
    <ScreenScaffold
      eyebrow="Segurança"
      title="Conta temporariamente bloqueada"
      description="Estado reservado para bloqueios de segurança, risco ou requisitos de verificação."
      statusLabel="Blocked state ready"
    />
  );
}
