import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { disconnectedResponsibleGamingSnapshot } from '../../../features/responsible-gaming/provider/ResponsibleGamingProvider';
import { ResponsibleGamingLimitChangeScreen } from '../../../features/responsible-gaming/screens/ResponsibleGamingLimitChangeScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'ResponsibleGamingLimitChange'>;

export function ResponsibleGamingLimitChangeRouteScreen({ route }: Props) {
  const snapshot = disconnectedResponsibleGamingSnapshot;
  const canSubmit = snapshot.availability === 'ready' && snapshot.policy.canRequestLimitChange;

  if (route.params.target === 'money') {
    const limit = snapshot.limits.find((item) => item.limitId === route.params.limitId) ?? null;
    return <ResponsibleGamingLimitChangeScreen mode="money" limit={limit} canSubmit={canSubmit} />;
  }

  return (
    <ResponsibleGamingLimitChangeScreen
      mode="session"
      limit={snapshot.sessionLimit}
      canSubmit={canSubmit}
    />
  );
}
