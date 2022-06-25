import * as ethers from 'ethers';

export class CustomTransaction {
  hash = '';
  to = '';
  value = ethers.BigNumber.from(0);
  confirmations = 0;

  constructor(rawTxn: { hash: string; to?: string; value: ethers.BigNumber; confirmations: number }) {
    this.hash = rawTxn.hash;
    if (rawTxn.to) {
      this.to = rawTxn.to;
    }
    this.value = rawTxn.value;
    this.confirmations = rawTxn.confirmations;
  }
}
