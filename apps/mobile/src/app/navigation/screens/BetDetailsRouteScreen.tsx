import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { useSession } from '../../../core/session/SessionProvider';
import { createApiBetHistoryProvider } from '../../../features/betting/history/provider/ApiBetHistoryProvider';
import { BetDetailsScreen } from '../../../features/betting/history/screens/BetDetailsScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'BetDetails'>;

export function BetDetailsRouteScreen({ route }: Props) {
  const { request } = useSession();
  const provider = createApiBetHistoryProvider(request);
  const detailsQuery = useQuery({
    queryKey: ['bets', 'details', route.params.betId],
    queryFn: () => provider.getBetDetails(route.params.betId),
  });

  return <BetDetailsScreen betId={route.params.betId} details={detailsQuery.data ?? null} />;
}
