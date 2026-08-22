import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { BetHistoryScreen } from '../../../features/betting/history/screens/BetHistoryScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'BetHistory'>;

export function BetHistoryRouteScreen({ navigation }: Props) {
  return <BetHistoryScreen onOpenBet={(betId) => navigation.navigate('BetDetails', { betId })} />;
}
