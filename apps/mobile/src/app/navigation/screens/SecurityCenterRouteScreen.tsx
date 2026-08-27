import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useI18n } from '../../../core/i18n';
import { useSession } from '../../../core/session/SessionProvider';
import { createApiSecurityProvider } from '../../../features/security/provider/ApiSecurityProvider';
import {
  disconnectedSecurityCapabilities,
  disconnectedSecuritySnapshot,
} from '../../../features/security/provider/SecurityProvider';
import { SecurityCenterScreen } from '../../../features/security/screens/SecurityCenterScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'SecurityCenter'>;

export function SecurityCenterRouteScreen({ navigation }: Props) {
  const { t } = useI18n();
  const { request } = useSession();
  const queryClient = useQueryClient();
  const provider = createApiSecurityProvider(request);

  const snapshotQuery = useQuery({
    queryKey: ['security'],
    queryFn: () => provider.getSnapshot(),
  });
  const capabilitiesQuery = useQuery({
    queryKey: ['security', 'capabilities'],
    queryFn: () => provider.getCapabilities(),
    staleTime: Infinity,
  });
  const revokeOthers = useMutation({
    mutationFn: () => provider.revokeOtherSessions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['security'] });
    },
  });

  const snapshot = snapshotQuery.data ?? {
    ...disconnectedSecuritySnapshot,
    message: snapshotQuery.isPending
      ? t('security.snapshot.loading')
      : t('security.center.unavailableDescription'),
  };
  const capabilities = capabilitiesQuery.data ?? disconnectedSecurityCapabilities;

  return (
    <SecurityCenterScreen
      snapshot={snapshot}
      capabilities={capabilities}
      onOpenSession={(sessionId) => navigation.navigate('SecuritySessionDetails', { sessionId })}
      onRevokeOtherSessions={
        capabilities.canRevokeOtherSessions && !revokeOthers.isPending
          ? () => revokeOthers.mutate()
          : undefined
      }
    />
  );
}
