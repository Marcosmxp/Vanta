import { disconnectedLegalSnapshot } from '../../../features/legal/provider/LegalProvider';
import { RegulatoryInformationScreen } from '../../../features/legal/screens/RegulatoryInformationScreen';

export function RegulatoryInformationRouteScreen() {
  return <RegulatoryInformationScreen disclosure={disconnectedLegalSnapshot.regulatory} />;
}
