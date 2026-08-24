import { useSession } from '../../../core/session/SessionProvider';
import { Button } from '../../../design-system';
import { ScreenScaffold } from './ScreenScaffold';

export function AccountBlockedScreen() {
  const { signOut } = useSession();

  return (
    <ScreenScaffold
      eyebrow="Segurança"
      title="Conta temporariamente bloqueada"
      description="O servidor bloqueou o acesso a esta conta. Operações autenticadas permanecem indisponíveis até o estado ser revisto."
      statusLabel="Acesso bloqueado"
    >
      <Button
        label="Terminar sessão"
        variant="secondary"
        onPress={() => void signOut().catch(() => undefined)}
      />
    </ScreenScaffold>
  );
}
