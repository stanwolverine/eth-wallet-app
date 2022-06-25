import React from 'react';
import * as ethers from 'ethers';

import { CustomTransaction } from '../models/CustomTransaction';
import { MAX_CONFIRMATIONS_NEEDED } from '../utils/constants';

export const useTransactions = (wallet: ethers.Wallet) => {
  const [transactions, setTransactions] = React.useState<CustomTransaction[]>([]);

  /**
   * Tracking `transaction hashes` for which event listener is subscribed
   */
  const activeTxns = React.useRef<string[]>([]);

  /**
   * Handle Event occurred on the subscribed `transaction hash`
   */
  const handleTransactionConfirmation = React.useCallback(
    (completedTxn: ethers.providers.TransactionReceipt) => {
      setTransactions(txns => {
        const foundTxn = txns.find(txn => txn.hash === completedTxn.transactionHash);

        if (foundTxn && foundTxn.confirmations < completedTxn.confirmations) {
          // If txn has been confirmed
          if (completedTxn.confirmations >= MAX_CONFIRMATIONS_NEEDED) {
            // Unsubscribe the event for txn
            wallet.provider.off(completedTxn.transactionHash);
            // Remove txn hash from list
            activeTxns.current = activeTxns.current.filter(txnHash => txnHash !== completedTxn.transactionHash);
          }

          return txns.map(txn =>
            txn.hash === completedTxn.transactionHash
              ? { ...txn, confirmations: Math.min(MAX_CONFIRMATIONS_NEEDED, completedTxn.confirmations) }
              : txn,
          );
        }

        return txns;
      });
    },
    [wallet.provider, setTransactions],
  );

  /**
   * Send $Eth to Address
   */
  const addTransaction = React.useCallback(
    async (value: ethers.BigNumber, to: string) => {
      // send transaction to eth
      const txn = await wallet.sendTransaction({ value, to });

      setTransactions(txns => [new CustomTransaction(txn), ...txns]);

      wallet.provider.on(txn.hash, handleTransactionConfirmation);
      activeTxns.current.push(txn.hash);

      return txn;
    },
    [wallet, setTransactions, handleTransactionConfirmation],
  );

  /**
   * Unsubscribe from all active listeners
   */
  React.useEffect(() => {
    return () => {
      activeTxns.current?.forEach(activeTxn => {
        wallet.provider.off(activeTxn);
      });
    };
  }, [wallet.provider]);

  return {
    transactions,
    addTransaction,
  };
};
