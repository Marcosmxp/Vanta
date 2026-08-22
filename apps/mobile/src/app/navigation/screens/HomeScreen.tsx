import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { HomeDashboardScreen } from '../../../features/home/screens/HomeDashboardScreen';
import type { MainStackParamList, MainTabParamList } from '../types';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const mainStack = navigation.getParent<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <HomeDashboardScreen
      onOpenWallet={() => navigation.navigate('Wallet')}
      onOpenPlay={() => navigation.navigate('Play')}
      onOpenProfile={() => navigation.navigate('Profile')}
      onOpenBetHistory={() => mainStack?.navigate('BetHistory')}
    />
  );
}
