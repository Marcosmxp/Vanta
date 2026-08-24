import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createIdempotencyKey } from '../../../core/api/idempotency';
import { useSession } from '../../../core/session/SessionProvider';
import {
  apiSupportCapabilities,
  createApiSupportProvider,
} from '../../../features/support/provider/ApiSupportProvider';
import { disconnectedSupportSnapshot } from '../../../features/support/provider/SupportProvider';
import { SupportRequestScreen } from '../../../features/support/screens/SupportRequestScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'SupportRequestCreate'>;

export function SupportRequestCreateRouteScreen({ navigation }: Props) {
  const { request } = useSession();
  const queryClient = useQueryClient();
  const provider = createApiSupportProvider(request);
  const snapshotQuery = useQuery({
    queryKey: ['support'],
    queryFn: () => provider.getSnapshot(),
  });
  const snapshot = snapshotQuery.data ?? disconnectedSupportSnapshot;
  const categories = Array.from(new Set(snapshot.topics.map((topic) => topic.category)));

  const createMutation = useMutation({
    mutationFn: (input: { category: string; subject: string; message: string }) =>
      provider.createRequest({
        ...input,
        idempotencyKey: createIdempotencyKey('support-request'),
      }),
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: ['support'] });
      navigation.replace('SupportRequestDetails', { requestId: created.requestId });
    },
  });

  return (
    <SupportRequestScreen
      categories={categories}
      capabilities={{
        ...apiSupportCapabilities,
        canCreateRequest: apiSupportCapabilities.canCreateRequest && !createMutation.isPending,
        message: createMutation.error instanceof Error
          ? createMutation.error.message
          : apiSupportCapabilities.message,
      }}
      onSubmit={(input) => createMutation.mutate(input)}
    />
  );
}
