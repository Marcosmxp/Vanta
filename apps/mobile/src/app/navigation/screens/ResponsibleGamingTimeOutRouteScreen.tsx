import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createIdempotencyKey } from '../../../core/api/idempotency';
import { useSession } from '../../../core/session/SessionProvider';
import { createApiResponsibleGamingProvider } from '../../../features/responsible-gaming/provider/ApiResponsibleGamingProvider';
import { disconnectedResponsibleGamingSnapshot } from '../../../features/responsible-gaming/provider/ResponsibleGamingProvider';
import { ResponsibleGamingTimeOutScreen } from '../../../features/responsible-gaming/screens/ResponsibleGamingTimeOutScreen';

export function ResponsibleGamingTimeOutRouteScreen() {
  const { request } = useSession();
  const queryClient = useQueryClient();
  const provider = createApiResponsibleGamingProvider(request);
  const snapshotQuery = useQuery({
    queryKey: ['responsible-gaming'],
    queryFn: () => provider.getSnapshot(),
  });
  const mutation = useMutation({
    mutationFn: (optionId: string) =>
      provider.startTimeOut({
        optionId,
        idempotencyKey: createIdempotencyKey('responsible-gaming-time-out'),
      }),
    onSuccess: (next) => queryClient.setQueryData(['responsible-gaming'], next),
  });

  return (
    <ResponsibleGamingTimeOutScreen
      snapshot={snapshotQuery.data ?? disconnectedResponsibleGamingSnapshot}
      onStartTimeOut={mutation.isPending ? undefined : (optionId) => mutation.mutate(optionId)}
    />
  );
}
