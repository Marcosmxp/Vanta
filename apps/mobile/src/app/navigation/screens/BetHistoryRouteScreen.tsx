import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { useSession } from '../../../core/session/SessionProvider';
import { createApiBetHistoryProvider } from '../../../features/betting/history/provider/ApiBetHistoryProvider';
import { disconnectedBetHistorySnapshot } from '../../../features/betting/history/provider/BetHistoryProvider';
import { BetHistoryScreen } from '../../../features/betting/history/screens/BetHistoryScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'BetHistory'>;

export function BetHistoryRouteScreen({ navigation }: Props) {
  const { request } = useSession();
  const provider = createApiBetHistoryProvider(request);
  const historyQuery = useQuery({
    queryKey: ['bets', 'history'],
    queryFn: () => provider.getHistory({ limit: 50 }),
  });

  const snapshot = historyQuery.data ?? {
    ...disconnectedBetHistorySnapshot,
    message: historyQuery.isPending
      ? 'A carregar o histórico autenticado.'
      : historyQuery.error instanceof Error
        ? historyQuery.error.message
        : disconnectedBetHistorySnapshot.message,
  };

  return (
    <BetHistoryScreen
      snapshot={snapshot}
      onOpenBet={(betId) => navigation.navigate('BetDetails', { betId })}
    />
  );
}
