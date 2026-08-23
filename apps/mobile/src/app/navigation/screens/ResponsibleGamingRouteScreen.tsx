import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  type ResponsibleGamingDestination,
} from '../../../features/responsible-gaming/components/ResponsibleGamingActionCard';
import { ResponsibleGamingOverviewScreen } from '../../../features/responsible-gaming/screens/ResponsibleGamingOverviewScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'ResponsibleGaming'>;

export function ResponsibleGamingRouteScreen({ navigation }: Props) {
  const openDestination = (destination: ResponsibleGamingDestination) => {
    switch (destination) {
      case 'limits':
        navigation.navigate('ResponsibleGamingLimits');
        return;
      case 'time-out':
        navigation.navigate('ResponsibleGamingTimeOut');
        return;
      case 'self-exclusion':
        navigation.navigate('ResponsibleGamingSelfExclusion');
        return;
    }
  };

  return <ResponsibleGamingOverviewScreen onOpenDestination={openDestination} />;
}
