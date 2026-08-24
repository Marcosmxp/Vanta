import { useQuery } from '@tanstack/react-query';

import { useSession } from '../../../core/session/SessionProvider';
import { createApiSystemAvailabilityProvider } from '../../../core/system-state/provider/ApiSystemAvailabilityProvider';
import { MaintenanceScreen } from '../../../core/system-state/screens/MaintenanceScreen';

export function MaintenanceRouteScreen() {
  const { publicRequest } = useSession();
  const provider = createApiSystemAvailabilityProvider(publicRequest);
  const statusQuery = useQuery({
    queryKey: ['platform-status'],
    queryFn: () => provider.getAvailability(),
    refetchInterval: 30_000,
  });
  const snapshot = statusQuery.data;

  return (
    <MaintenanceScreen
      message={snapshot?.message}
      incidentId={snapshot?.incidentId}
      retryAfterAt={snapshot?.retryAfterAt}
      onRetry={() => void statusQuery.refetch()}
    />
  );
}
