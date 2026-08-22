import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { HomeDashboardScreen } from '../../../features/home/screens/HomeDashboardScreen';
import type { MainTabParamList } from '../types';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  return (
    <HomeDashboardScreen
      onOpenWallet={() => navigation.navigate('Wallet')}
      onOpenPlay={() => navigation.navigate('Play')}
      onOpenProfile={() => navigation.navigate('Profile')}
    />
  );
}
