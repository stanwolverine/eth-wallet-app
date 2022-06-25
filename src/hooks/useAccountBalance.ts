import React from 'react';
import * as ethers from 'ethers';

export const useAmountBalance = (wallet: ethers.Wallet) => {
  const [balance, setBalance] = React.useState(ethers.BigNumber.from(0));

  /**
   * Function to get connected account/wallet balance
   */
  const fetchBalance = React.useCallback(async () => {
    setBalance(await wallet.getBalance());
  }, [wallet, setBalance]);

  /**
   * Initially fetch account balance
   */
  React.useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const formattedBalance = React.useMemo(() => ethers.utils.formatEther(balance), [balance]);

  return {
    refreshBalance: fetchBalance,
    balance,
    formattedBalance,
  };
};
