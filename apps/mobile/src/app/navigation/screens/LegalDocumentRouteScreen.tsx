import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { LegalDocumentScreen } from '../../../features/legal/screens/LegalDocumentScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'LegalDocument'>;

export function LegalDocumentRouteScreen({ route }: Props) {
  return <LegalDocumentScreen documentId={route.params.documentId} document={null} />;
}
