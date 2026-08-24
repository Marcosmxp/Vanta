import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { useSession } from '../../../core/session/SessionProvider';
import { createApiWalletProvider } from '../../../features/wallet/provider/ApiWalletProvider';
import { disconnectedWalletSnapshot } from '../../../features/wallet/provider/WalletProvider';
import { WalletOverviewScreen } from '../../../features/wallet/screens/WalletOverviewScreen';
import type { MainStackParamList, MainTabParamList } from '../types';

type Props = BottomTabScreenProps<MainTabParamList, 'Wallet'>;

export function WalletScreen({ navigation }: Props) {
  const mainStack = navigation.getParent<NativeStackNavigationProp<MainStackParamList>>();
  const { request } = useSession();
  const provider = createApiWalletProvider(request);
  const walletQuery = useQuery({
    queryKey: ['wallet'],
    queryFn: () => provider.getSnapshot(),
  });

  const snapshot = walletQuery.data ?? {
    ...disconnectedWalletSnapshot,
    message: walletQuery.isPending
      ? 'A carregar a projeção financeira autorizada pelo servidor.'
      : walletQuery.error instanceof Error
        ? walletQuery.error.message
        : disconnectedWalletSnapshot.message,
  };

  return (
    <WalletOverviewScreen
      snapshot={snapshot}
      onDeposit={() => mainStack?.navigate('Deposit')}
      onWithdraw={() => mainStack?.navigate('Withdrawal')}
      onOpenBetHistory={() => mainStack?.navigate('BetHistory')}
      onOpenTransaction={(transactionId) =>
        mainStack?.navigate('WalletTransactionDetails', { transactionId })
      }
    />
  );
}
