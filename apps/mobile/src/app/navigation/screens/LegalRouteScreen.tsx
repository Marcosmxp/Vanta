import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { useSession } from '../../../core/session/SessionProvider';
import { createApiLegalProvider } from '../../../features/legal/provider/ApiLegalProvider';
import { disconnectedLegalSnapshot } from '../../../features/legal/provider/LegalProvider';
import { LegalCenterScreen } from '../../../features/legal/screens/LegalCenterScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'Legal'>;

export function LegalRouteScreen({ navigation }: Props) {
  const { publicRequest } = useSession();
  const provider = createApiLegalProvider(publicRequest);
  const snapshotQuery = useQuery({
    queryKey: ['legal'],
    queryFn: () => provider.getSnapshot(),
  });

  const snapshot = snapshotQuery.data ?? {
    ...disconnectedLegalSnapshot,
    message: snapshotQuery.isPending
      ? 'A carregar os documentos legais versionados.'
      : snapshotQuery.error instanceof Error
        ? snapshotQuery.error.message
        : disconnectedLegalSnapshot.message,
  };

  return (
    <LegalCenterScreen
      snapshot={snapshot}
      onOpenDocument={(documentId) => navigation.navigate('LegalDocument', { documentId })}
      onOpenPrivacy={() => navigation.navigate('PrivacyInformation')}
      onOpenRegulatory={() => navigation.navigate('RegulatoryInformation')}
    />
  );
}
