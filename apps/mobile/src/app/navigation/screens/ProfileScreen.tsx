import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { useSession } from '../../../core/session/SessionProvider';
import { ProfileOverviewScreen } from '../../../features/profile/screens/ProfileOverviewScreen';
import type { ProfileDestination } from '../../../features/profile/components/ProfileMenuCard';
import { createApiProfileProvider } from '../../../features/profile/provider/ApiProfileProvider';
import { disconnectedProfileSnapshot } from '../../../features/profile/provider/ProfileProvider';
import type { MainStackParamList, MainTabParamList } from '../types';

type Props = BottomTabScreenProps<MainTabParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const mainStack = navigation.getParent<NativeStackNavigationProp<MainStackParamList>>();
  const { request, signOut } = useSession();
  const provider = createApiProfileProvider(request);
  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: () => provider.getProfile(),
  });

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

  const snapshot = profileQuery.data ?? {
    ...disconnectedProfileSnapshot,
    message: profileQuery.isPending
      ? 'A carregar o perfil autenticado.'
      : profileQuery.error instanceof Error
        ? profileQuery.error.message
        : disconnectedProfileSnapshot.message,
  };

  return (
    <ProfileOverviewScreen
      snapshot={snapshot}
      onOpenDestination={openDestination}
      onSignOut={() => void signOut()}
    />
  );
}
