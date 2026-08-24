import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { useSession } from '../../../core/session/SessionProvider';
import { createApiSupportProvider } from '../../../features/support/provider/ApiSupportProvider';
import { SupportRequestDetailsScreen } from '../../../features/support/screens/SupportRequestDetailsScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'SupportRequestDetails'>;

export function SupportRequestDetailsRouteScreen({ route }: Props) {
  const { requestId } = route.params;
  const { request } = useSession();
  const provider = createApiSupportProvider(request);
  const requestQuery = useQuery({
    queryKey: ['support', 'request', requestId],
    queryFn: () => provider.getRequest(requestId),
  });

  return (
    <SupportRequestDetailsScreen
      requestId={requestId}
      request={requestQuery.data ?? null}
    />
  );
}
