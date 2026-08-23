import { disconnectedLegalSnapshot } from '../../../features/legal/provider/LegalProvider';
import { PrivacyInformationScreen } from '../../../features/legal/screens/PrivacyInformationScreen';

export function PrivacyInformationRouteScreen() {
  return <PrivacyInformationScreen disclosure={disconnectedLegalSnapshot.privacy} />;
}
