import { ethers } from 'ethers';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../styles/colors';

interface TransactionCardProps {
  txn: {
    hash: string;
    to: string;
    value: ethers.BigNumber;
    confirmations: number;
  };
  maxConfirmationsNeeded: number;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ txn, maxConfirmationsNeeded }) => {
  const viewTransactionOnEtherscan = () => {
    return Linking.openURL(`https://ropsten.etherscan.io/tx/${txn.hash}`);
  };

  const hasConfirmed = txn.confirmations >= maxConfirmationsNeeded;

  return (
    <View style={styles.container}>
      <View style={styles.startColumn}>
        <Text style={styles.heading}>Sent</Text>

        <Text numberOfLines={1} ellipsizeMode="middle" style={styles.toAddress}>
          to:{' '}
          <Text style={styles.value} ellipsizeMode="middle" numberOfLines={1}>
            {txn.to}
          </Text>
        </Text>

        <TouchableOpacity onPress={viewTransactionOnEtherscan}>
          <Text numberOfLines={2} ellipsizeMode="middle" style={styles.txnHash}>
            Txn hash: <Text style={styles.link}>{txn.hash}</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.endColumn}>
        <View style={styles.valueWrapper}>
          <Text style={styles.currency}>$ETH</Text>

          <Text style={styles.etherValue}>{ethers.utils.formatEther(txn.value)}</Text>
        </View>

        <Text style={styles.status}>
          {txn.confirmations} / {maxConfirmationsNeeded}{' '}
          <Text
            style={[
              styles.status,
              {
                color: hasConfirmed ? Colors.GREEN : Colors.YELLOW,
              },
            ]}
          >
            {hasConfirmed ? 'Confirmed' : 'Pending'}
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SECONDARY,
    borderRadius: 8,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  heading: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.WHITE,
    marginBottom: 4,
  },
  startColumn: {
    flex: 1,
    justifyContent: 'space-around',
  },
  endColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  toAddress: {
    flex: 1,
    fontSize: 14,
    color: Colors.GRAY_LIGHT,
    marginBottom: 4,
  },
  txnHash: {
    flex: 1,
    fontSize: 14,
    color: Colors.GRAY_LIGHT,
  },
  currency: {
    fontSize: 14,
    color: Colors.GRAY_LIGHT,
  },
  valueWrapper: {
    flex: 1,
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  value: {
    flex: 1,
    fontSize: 15,
    color: Colors.WHITE,
  },
  etherValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.WHITE,
    textAlign: 'right',
  },
  status: {
    flex: 1,
    fontSize: 14,
    color: Colors.WHITE,
  },
  link: {
    fontSize: 16,
    color: Colors.BLUE,
  },
});

export default React.memo(TransactionCard);
