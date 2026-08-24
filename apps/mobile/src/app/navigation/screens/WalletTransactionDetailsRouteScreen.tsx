import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { useSession } from '../../../core/session/SessionProvider';
import { createApiWalletProvider } from '../../../features/wallet/provider/ApiWalletProvider';
import { WalletTransactionDetailsScreen } from '../../../features/wallet/screens/WalletTransactionDetailsScreen';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'WalletTransactionDetails'>;

export function WalletTransactionDetailsRouteScreen({ route }: Props) {
  const { transactionId } = route.params;
  const { request } = useSession();
  const provider = createApiWalletProvider(request);
  const transactionQuery = useQuery({
    queryKey: ['wallet', 'transaction', transactionId],
    queryFn: () => provider.getTransaction(transactionId),
  });

  return (
    <WalletTransactionDetailsScreen
      transactionId={transactionId}
      transaction={transactionQuery.data ?? null}
    />
  );
}
