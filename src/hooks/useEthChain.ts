import React from 'react';
import * as ethers from 'ethers';
import { ACCOUNT_PRIVATE_KEY } from '@env';

export const useEthChain = (network: 'ropsten' | 'rinkeby') => {
  const provider = React.useMemo(() => ethers.getDefaultProvider(network), [network]);

  const wallet = React.useMemo(() => new ethers.Wallet(ACCOUNT_PRIVATE_KEY, provider), [provider]);

  return { wallet, provider };
};
