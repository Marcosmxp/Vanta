import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileOverviewScreen } from '../../../features/profile/screens/ProfileOverviewScreen';
import type { ProfileDestination } from '../../../features/profile/components/ProfileMenuCard';
import type { MainStackParamList, MainTabParamList } from '../types';

type Props = BottomTabScreenProps<MainTabParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const mainStack = navigation.getParent<NativeStackNavigationProp<MainStackParamList>>();

  const openDestination = (destination: ProfileDestination) => {
    switch (destination) {
      case 'security':
        mainStack?.navigate('SecurityCenter');
        return;
      case 'responsible-gaming':
        mainStack?.navigate('ResponsibleGaming');
        return;
      case 'support':
        mainStack?.navigate('Support');
        return;
      case 'legal':
        mainStack?.navigate('Legal');
        return;
    }
  };

  return <ProfileOverviewScreen onOpenDestination={openDestination} />;
}
