import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { useSession } from '../../../core/session/SessionProvider';
import { createApiResponsibleGamingProvider } from '../../../features/responsible-gaming/provider/ApiResponsibleGamingProvider';
import { disconnectedResponsibleGamingSnapshot } from '../../../features/responsible-gaming/provider/ResponsibleGamingProvider';
import { ResponsibleGamingLimitsScreen } from '../../../features/responsible-gaming/screens/ResponsibleGamingLimitsScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'ResponsibleGamingLimits'>;

export function ResponsibleGamingLimitsRouteScreen({ navigation }: Props) {
  const { request } = useSession();
  const provider = createApiResponsibleGamingProvider(request);
  const snapshotQuery = useQuery({
    queryKey: ['responsible-gaming'],
    queryFn: () => provider.getSnapshot(),
  });
  const snapshot = snapshotQuery.data ?? disconnectedResponsibleGamingSnapshot;

  return (
    <ResponsibleGamingLimitsScreen
      snapshot={snapshot}
      onRequestMoneyLimitChange={(limitId) =>
        navigation.navigate('ResponsibleGamingLimitChange', { target: 'money', limitId })
      }
      onRequestSessionLimitChange={() =>
        navigation.navigate('ResponsibleGamingLimitChange', { target: 'session' })
      }
    />
  );
}
