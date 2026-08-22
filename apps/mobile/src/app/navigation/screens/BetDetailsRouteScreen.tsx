import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { BetDetailsScreen } from '../../../features/betting/history/screens/BetDetailsScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'BetDetails'>;

export function BetDetailsRouteScreen({ route }: Props) {
  return <BetDetailsScreen betId={route.params.betId} />;
}
