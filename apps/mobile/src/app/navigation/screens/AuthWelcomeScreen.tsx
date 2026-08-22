import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '../../../design-system';
import type { AuthStackParamList } from '../types';
import { ScreenScaffold } from './ScreenScaffold';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export function AuthWelcomeScreen({ navigation }: Props) {
  return (
    <ScreenScaffold
      eyebrow="Acesso"
      title="Bem-vindo ao Vanta"
      description="Estrutura inicial do fluxo de autenticação. As telas definitivas entram na Fase 05."
      statusLabel="Auth stack ready"
    >
      <Button label="Ir para login" onPress={() => navigation.navigate('Login')} />
    </ScreenScaffold>
  );
}
