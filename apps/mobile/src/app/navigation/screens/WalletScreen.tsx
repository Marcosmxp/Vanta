import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { WalletOverviewScreen } from '../../../features/wallet/screens/WalletOverviewScreen';
import type { MainStackParamList, MainTabParamList } from '../types';

type Props = BottomTabScreenProps<MainTabParamList, 'Wallet'>;

export function WalletScreen({ navigation }: Props) {
  const mainStack = navigation.getParent<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <WalletOverviewScreen
      onDeposit={() => mainStack?.navigate('Deposit')}
      onWithdraw={() => mainStack?.navigate('Withdrawal')}
      onOpenBetHistory={() => mainStack?.navigate('BetHistory')}
      onOpenTransaction={(transactionId) =>
        mainStack?.navigate('WalletTransactionDetails', { transactionId })
      }
    />
  );
}
