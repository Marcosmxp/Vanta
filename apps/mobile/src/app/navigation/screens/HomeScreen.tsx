import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { useSession } from '../../../core/session/SessionProvider';
import { createApiHomeProvider } from '../../../features/home/provider/ApiHomeProvider';
import { disconnectedHomeSnapshot } from '../../../features/home/provider/HomeProvider';
import { HomeDashboardScreen } from '../../../features/home/screens/HomeDashboardScreen';
import type { MainStackParamList, MainTabParamList } from '../types';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const mainStack = navigation.getParent<NativeStackNavigationProp<MainStackParamList>>();
  const { request } = useSession();
  const provider = createApiHomeProvider(request);
  const homeQuery = useQuery({
    queryKey: ['home'],
    queryFn: () => provider.getHomeSnapshot(),
  });

  return (
    <HomeDashboardScreen
      snapshot={homeQuery.data ?? disconnectedHomeSnapshot}
      onOpenWallet={() => navigation.navigate('Wallet')}
      onOpenPlay={() => navigation.navigate('Play')}
      onOpenProfile={() => navigation.navigate('Profile')}
      onOpenBetHistory={() => mainStack?.navigate('BetHistory')}
    />
  );
}
