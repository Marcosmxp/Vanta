import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createIdempotencyKey } from '../../../core/api/idempotency';
import { useSession } from '../../../core/session/SessionProvider';
import { createApiResponsibleGamingProvider } from '../../../features/responsible-gaming/provider/ApiResponsibleGamingProvider';
import { disconnectedResponsibleGamingSnapshot } from '../../../features/responsible-gaming/provider/ResponsibleGamingProvider';
import { ResponsibleGamingSelfExclusionScreen } from '../../../features/responsible-gaming/screens/ResponsibleGamingSelfExclusionScreen';

export function ResponsibleGamingSelfExclusionRouteScreen() {
  const { request } = useSession();
  const queryClient = useQueryClient();
  const provider = createApiResponsibleGamingProvider(request);
  const snapshotQuery = useQuery({
    queryKey: ['responsible-gaming'],
    queryFn: () => provider.getSnapshot(),
  });
  const mutation = useMutation({
    mutationFn: (optionId: string) =>
      provider.startSelfExclusion({
        optionId,
        acknowledged: true,
        idempotencyKey: createIdempotencyKey('responsible-gaming-self-exclusion'),
      }),
    onSuccess: (next) => queryClient.setQueryData(['responsible-gaming'], next),
  });

  return (
    <ResponsibleGamingSelfExclusionScreen
      snapshot={snapshotQuery.data ?? disconnectedResponsibleGamingSnapshot}
      onStartSelfExclusion={mutation.isPending ? undefined : (optionId) => mutation.mutate(optionId)}
    />
  );
}
