import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SecurityCenterScreen } from '../../../features/security/screens/SecurityCenterScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'SecurityCenter'>;

export function SecurityCenterRouteScreen({ navigation }: Props) {
  return (
    <SecurityCenterScreen
      onOpenSession={(sessionId) => navigation.navigate('SecuritySessionDetails', { sessionId })}
    />
  );
}
