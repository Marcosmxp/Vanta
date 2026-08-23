import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SupportRequestDetailsScreen } from '../../../features/support/screens/SupportRequestDetailsScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'SupportRequestDetails'>;

export function SupportRequestDetailsRouteScreen({ route }: Props) {
  return <SupportRequestDetailsScreen requestId={route.params.requestId} request={null} />;
}
