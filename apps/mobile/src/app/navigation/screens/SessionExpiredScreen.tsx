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
      description="Rota modal reservada para expiração de sessão e reautenticação segura."
      statusLabel="Session state ready"
    >
      <Button label="Fechar" variant="secondary" onPress={() => navigation.goBack()} />
    </ScreenScaffold>
  );
}
