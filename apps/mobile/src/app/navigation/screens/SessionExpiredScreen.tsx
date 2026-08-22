import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '../../../design-system';
import type { RootStackParamList } from '../types';
import { ScreenScaffold } from './ScreenScaffold';

type Props = NativeStackScreenProps<RootStackParamList, 'SessionExpired'>;

export function SessionExpiredScreen({ navigation }: Props) {
  return (
    <ScreenScaffold
      eyebrow="Segurança"
      title="Sessão expirada"
      description="Por segurança, volte a autenticar-se antes de continuar. A sessão anterior não deve ser reutilizada."
      statusLabel="Reauthentication required"
    >
      <Button label="Voltar a autenticar" onPress={() => navigation.replace('Auth')} />
    </ScreenScaffold>
  );
}
