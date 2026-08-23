import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  disconnectedSupportCapabilities,
  disconnectedSupportSnapshot,
} from '../../../features/support/provider/SupportProvider';
import { SupportOverviewScreen } from '../../../features/support/screens/SupportOverviewScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'Support'>;

export function SupportRouteScreen({ navigation }: Props) {
  return (
    <SupportOverviewScreen
      snapshot={disconnectedSupportSnapshot}
      capabilities={disconnectedSupportCapabilities}
      onCreateRequest={() => navigation.navigate('SupportRequestCreate')}
      onOpenRequest={(requestId) => navigation.navigate('SupportRequestDetails', { requestId })}
    />
  );
}
