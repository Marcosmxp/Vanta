import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '../../../core/session/SessionProvider';
import { createApiSecurityProvider } from '../../../features/security/provider/ApiSecurityProvider';
import { disconnectedSecurityCapabilities } from '../../../features/security/provider/SecurityProvider';
import { SecuritySessionDetailsScreen } from '../../../features/security/screens/SecuritySessionDetailsScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'SecuritySessionDetails'>;

export function SecuritySessionDetailsRouteScreen({ route }: Props) {
  const { sessionId } = route.params;
  const { request } = useSession();
  const queryClient = useQueryClient();
  const provider = createApiSecurityProvider(request);

  const sessionQuery = useQuery({
    queryKey: ['security', 'session', sessionId],
    queryFn: () => provider.getSession(sessionId),
  });
  const capabilitiesQuery = useQuery({
    queryKey: ['security', 'capabilities'],
    queryFn: () => provider.getCapabilities(),
    staleTime: Infinity,
  });
  const revokeMutation = useMutation({
    mutationFn: () => provider.revokeSession({ sessionId }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['security'] }),
        queryClient.invalidateQueries({ queryKey: ['security', 'session', sessionId] }),
      ]);
    },
  });

  const capabilities = capabilitiesQuery.data ?? disconnectedSecurityCapabilities;

  return (
    <SecuritySessionDetailsScreen
      sessionId={sessionId}
      session={sessionQuery.data ?? null}
      capabilities={capabilities}
      onRevokeSession={
        capabilities.canRevokeSession && !revokeMutation.isPending
          ? () => revokeMutation.mutate()
          : undefined
      }
    />
  );
}
