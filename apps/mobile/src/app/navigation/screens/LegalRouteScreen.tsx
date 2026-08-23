import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { disconnectedLegalSnapshot } from '../../../features/legal/provider/LegalProvider';
import { LegalCenterScreen } from '../../../features/legal/screens/LegalCenterScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'Legal'>;

export function LegalRouteScreen({ navigation }: Props) {
  return (
    <LegalCenterScreen
      snapshot={disconnectedLegalSnapshot}
      onOpenDocument={(documentId) => navigation.navigate('LegalDocument', { documentId })}
      onOpenPrivacy={() => navigation.navigate('PrivacyInformation')}
      onOpenRegulatory={() => navigation.navigate('RegulatoryInformation')}
    />
  );
}
