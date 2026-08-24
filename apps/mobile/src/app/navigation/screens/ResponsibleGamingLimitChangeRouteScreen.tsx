import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createIdempotencyKey } from '../../../core/api/idempotency';
import { useSession } from '../../../core/session/SessionProvider';
import { createApiResponsibleGamingProvider } from '../../../features/responsible-gaming/provider/ApiResponsibleGamingProvider';
import { disconnectedResponsibleGamingSnapshot } from '../../../features/responsible-gaming/provider/ResponsibleGamingProvider';
import { ResponsibleGamingLimitChangeScreen } from '../../../features/responsible-gaming/screens/ResponsibleGamingLimitChangeScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'ResponsibleGamingLimitChange'>;

export function ResponsibleGamingLimitChangeRouteScreen({ route }: Props) {
  const { request } = useSession();
  const queryClient = useQueryClient();
  const provider = createApiResponsibleGamingProvider(request);
  const snapshotQuery = useQuery({
    queryKey: ['responsible-gaming'],
    queryFn: () => provider.getSnapshot(),
  });
  const snapshot = snapshotQuery.data ?? disconnectedResponsibleGamingSnapshot;
  const params = route.params;

  const moneyMutation = useMutation({
    mutationFn: ({ limitId, amountMinor }: { limitId: string; amountMinor: number }) =>
      provider.requestMoneyLimitChange({
        limitId,
        requestedAmountMinor: amountMinor,
        idempotencyKey: createIdempotencyKey('responsible-gaming-money-limit'),
      }),
    onSuccess: (next) => queryClient.setQueryData(['responsible-gaming'], next),
  });

  const sessionMutation = useMutation({
    mutationFn: (minutes: number) =>
      provider.requestSessionLimitChange({
        requestedMinutes: minutes,
        idempotencyKey: createIdempotencyKey('responsible-gaming-session-limit'),
      }),
    onSuccess: (next) => queryClient.setQueryData(['responsible-gaming'], next),
  });

  const canSubmit =
    snapshot.availability === 'ready' &&
    snapshot.policy.canRequestLimitChange &&
    !moneyMutation.isPending &&
    !sessionMutation.isPending;

  if (params.target === 'money') {
    const limit = snapshot.limits.find((item) => item.limitId === params.limitId) ?? null;
    return (
      <ResponsibleGamingLimitChangeScreen
        mode="money"
        limit={limit}
        canSubmit={canSubmit}
        onSubmit={(limitId, requestedAmountMinor) =>
          moneyMutation.mutate({ limitId, amountMinor: requestedAmountMinor })
        }
      />
    );
  }

  return (
    <ResponsibleGamingLimitChangeScreen
      mode="session"
      limit={snapshot.sessionLimit}
      canSubmit={canSubmit}
      onSubmit={(requestedMinutes) => sessionMutation.mutate(requestedMinutes)}
    />
  );
}
