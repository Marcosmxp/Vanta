import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { useSession } from '../../../core/session/SessionProvider';
import {
  apiSupportCapabilities,
  createApiSupportProvider,
} from '../../../features/support/provider/ApiSupportProvider';
import { disconnectedSupportSnapshot } from '../../../features/support/provider/SupportProvider';
import { SupportOverviewScreen } from '../../../features/support/screens/SupportOverviewScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'Support'>;

export function SupportRouteScreen({ navigation }: Props) {
  const { request } = useSession();
  const provider = createApiSupportProvider(request);
  const snapshotQuery = useQuery({
    queryKey: ['support'],
    queryFn: () => provider.getSnapshot(),
  });

  const snapshot = snapshotQuery.data ?? {
    ...disconnectedSupportSnapshot,
    message: snapshotQuery.isPending
      ? 'A carregar suporte e pedidos associados à conta.'
      : snapshotQuery.error instanceof Error
        ? snapshotQuery.error.message
        : disconnectedSupportSnapshot.message,
  };

  return (
    <SupportOverviewScreen
      snapshot={snapshot}
      capabilities={apiSupportCapabilities}
      onCreateRequest={() => navigation.navigate('SupportRequestCreate')}
      onOpenRequest={(requestId) => navigation.navigate('SupportRequestDetails', { requestId })}
    />
  );
}
