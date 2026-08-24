import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { useSession } from '../../../core/session/SessionProvider';
import { createApiLegalProvider } from '../../../features/legal/provider/ApiLegalProvider';
import { LegalDocumentScreen } from '../../../features/legal/screens/LegalDocumentScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'LegalDocument'>;

export function LegalDocumentRouteScreen({ route }: Props) {
  const { documentId } = route.params;
  const { publicRequest } = useSession();
  const provider = createApiLegalProvider(publicRequest);
  const documentQuery = useQuery({
    queryKey: ['legal', 'document', documentId],
    queryFn: () => provider.getDocument(documentId),
  });

  return <LegalDocumentScreen documentId={documentId} document={documentQuery.data ?? null} />;
}
