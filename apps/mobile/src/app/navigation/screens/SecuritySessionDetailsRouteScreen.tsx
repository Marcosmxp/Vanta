import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { disconnectedSecurityCapabilities } from '../../../features/security/provider/SecurityProvider';
import { SecuritySessionDetailsScreen } from '../../../features/security/screens/SecuritySessionDetailsScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'SecuritySessionDetails'>;

export function SecuritySessionDetailsRouteScreen({ route }: Props) {
  return (
    <SecuritySessionDetailsScreen
      sessionId={route.params.sessionId}
      capabilities={disconnectedSecurityCapabilities}
    />
  );
}
