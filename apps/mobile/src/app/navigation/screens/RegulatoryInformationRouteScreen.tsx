import { useQuery } from '@tanstack/react-query';

import { useSession } from '../../../core/session/SessionProvider';
import { createApiLegalProvider } from '../../../features/legal/provider/ApiLegalProvider';
import { disconnectedLegalSnapshot } from '../../../features/legal/provider/LegalProvider';
import { RegulatoryInformationScreen } from '../../../features/legal/screens/RegulatoryInformationScreen';

export function RegulatoryInformationRouteScreen() {
  const { publicRequest } = useSession();
  const provider = createApiLegalProvider(publicRequest);
  const snapshotQuery = useQuery({
    queryKey: ['legal'],
    queryFn: () => provider.getSnapshot(),
  });

  return (
    <RegulatoryInformationScreen
      disclosure={(snapshotQuery.data ?? disconnectedLegalSnapshot).regulatory}
    />
  );
}
