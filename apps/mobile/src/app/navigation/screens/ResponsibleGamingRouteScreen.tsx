import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { useSession } from '../../../core/session/SessionProvider';
import {
  type ResponsibleGamingDestination,
} from '../../../features/responsible-gaming/components/ResponsibleGamingActionCard';
import { createApiResponsibleGamingProvider } from '../../../features/responsible-gaming/provider/ApiResponsibleGamingProvider';
import { disconnectedResponsibleGamingSnapshot } from '../../../features/responsible-gaming/provider/ResponsibleGamingProvider';
import { ResponsibleGamingOverviewScreen } from '../../../features/responsible-gaming/screens/ResponsibleGamingOverviewScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'ResponsibleGaming'>;

export function ResponsibleGamingRouteScreen({ navigation }: Props) {
  const { request } = useSession();
  const provider = createApiResponsibleGamingProvider(request);
  const snapshotQuery = useQuery({
    queryKey: ['responsible-gaming'],
    queryFn: () => provider.getSnapshot(),
  });

  const snapshot = snapshotQuery.data ?? {
    ...disconnectedResponsibleGamingSnapshot,
    message: snapshotQuery.isPending
      ? 'A carregar os controlos de proteção confirmados pelo servidor.'
      : snapshotQuery.error instanceof Error
        ? snapshotQuery.error.message
        : disconnectedResponsibleGamingSnapshot.message,
  };

  const openDestination = (destination: ResponsibleGamingDestination) => {
    switch (destination) {
      case 'limits':
        navigation.navigate('ResponsibleGamingLimits');
        return;
      case 'time-out':
        navigation.navigate('ResponsibleGamingTimeOut');
        return;
      case 'self-exclusion':
        navigation.navigate('ResponsibleGamingSelfExclusion');
        return;
    }
  };

  return <ResponsibleGamingOverviewScreen snapshot={snapshot} onOpenDestination={openDestination} />;
}
