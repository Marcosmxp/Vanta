import { useQuery } from '@tanstack/react-query';

import { useSession } from '../../../core/session/SessionProvider';
import { createApiLegalProvider } from '../../../features/legal/provider/ApiLegalProvider';
import { disconnectedLegalSnapshot } from '../../../features/legal/provider/LegalProvider';
import { PrivacyInformationScreen } from '../../../features/legal/screens/PrivacyInformationScreen';

export function PrivacyInformationRouteScreen() {
  const { publicRequest } = useSession();
  const provider = createApiLegalProvider(publicRequest);
  const snapshotQuery = useQuery({
    queryKey: ['legal'],
    queryFn: () => provider.getSnapshot(),
  });

  return (
    <PrivacyInformationScreen
      disclosure={(snapshotQuery.data ?? disconnectedLegalSnapshot).privacy}
    />
  );
}
