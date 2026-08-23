import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ResponsibleGamingLimitsScreen } from '../../../features/responsible-gaming/screens/ResponsibleGamingLimitsScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'ResponsibleGamingLimits'>;

export function ResponsibleGamingLimitsRouteScreen({ navigation }: Props) {
  return (
    <ResponsibleGamingLimitsScreen
      onRequestMoneyLimitChange={(limitId) =>
        navigation.navigate('ResponsibleGamingLimitChange', { target: 'money', limitId })
      }
      onRequestSessionLimitChange={() =>
        navigation.navigate('ResponsibleGamingLimitChange', { target: 'session' })
      }
    />
  );
}
