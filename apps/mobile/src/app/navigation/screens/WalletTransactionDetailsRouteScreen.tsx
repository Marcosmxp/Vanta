import { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { disconnectedWalletProvider } from '../../../features/wallet/provider/WalletProvider';
import { WalletTransactionDetailsScreen } from '../../../features/wallet/screens/WalletTransactionDetailsScreen';
import type { WalletTransactionDetailReadModel } from '../../../features/wallet/types';
import type { MainStackParamList } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'WalletTransactionDetails'>;

export function WalletTransactionDetailsRouteScreen({ route }: Props) {
  const { transactionId } = route.params;
  const [transaction, setTransaction] = useState<WalletTransactionDetailReadModel | null>(null);

  useEffect(() => {
    let active = true;

    void disconnectedWalletProvider.getTransaction(transactionId).then((result) => {
      if (active) setTransaction(result);
    });

    return () => {
      active = false;
    };
  }, [transactionId]);

  return (
    <WalletTransactionDetailsScreen
      transactionId={transactionId}
      transaction={transaction}
    />
  );
}
