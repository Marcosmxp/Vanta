import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '../../../design-system';
import type { AuthStackParamList } from '../types';
import { ScreenScaffold } from './ScreenScaffold';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function AuthLoginScreen({ navigation }: Props) {
  return (
    <ScreenScaffold
      eyebrow="Acesso"
      title="Login"
      description="Placeholder navegável para o futuro formulário seguro de autenticação."
      statusLabel="Login route ready"
    >
      <Button label="Voltar" variant="secondary" onPress={() => navigation.goBack()} />
    </ScreenScaffold>
  );
}
