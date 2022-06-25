import * as ethers from 'ethers';
import React, { StrictMode } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import {
  FlatList,
  Keyboard,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from 'react-native';

import { Colors } from './src/styles/colors';

import { useEthChain } from './src/hooks/useEthChain';
import { useAmountBalance } from './src/hooks/useAccountBalance';
import { useTransactions } from './src/hooks/useTransactions';

import Input from './src/components/Input';
import SubmitButton from './src/components/SubmitButton';
import TransactionCard from './src/components/TransactionCard';

import { showToast } from './src/utils/showToast';
import { DECIMAL_VALUE_REGEX, MAX_CONFIRMATIONS_NEEDED } from './src/utils/constants';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const App = () => {
  const [amount, setAmount] = React.useState('');
  const [toAddress, setToAddress] = React.useState('0xb1E747c007314CC31956F7fe8f72cbA333dF5226');
  const [addingTxn, setAddingTxn] = React.useState(false);

  const { wallet } = useEthChain('ropsten');
  const { formattedBalance, refreshBalance } = useAmountBalance(wallet);
  const { transactions, addTransaction } = useTransactions(wallet);

  const handleSendPress = React.useCallback(async () => {
    try {
      // check if amount is valid
      if (!DECIMAL_VALUE_REGEX.test(amount)) {
        return showToast('Please enter valid amount in $ETH!');
      }

      // check if toAddress is valid
      if (!ethers.utils.isAddress(toAddress)) {
        return showToast('Please enter valid address!');
      }

      const valueInEther = ethers.utils.parseEther(amount);

      if (valueInEther.lte(0)) {
        return showToast('Value of $ETH to be transferred should be more than 0');
      }

      setAddingTxn(true);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const txnResponse = await addTransaction(valueInEther, toAddress);

      setAmount('');
      // setToAddress('');
      setAddingTxn(false);

      showToast('Transaction added successfully');

      await txnResponse.wait(1);

      refreshBalance();
    } catch (error) {
      setAddingTxn(false);

      showToast('Transaction Failed');
    }
  }, [amount, toAddress, addTransaction, refreshBalance]);

  const _keyExtractor = React.useCallback(item => item.hash, []);

  const _renderItem = React.useCallback(
    ({ item }) => <TransactionCard txn={item} maxConfirmationsNeeded={MAX_CONFIRMATIONS_NEEDED} />,
    [],
  );

  const _itemSeparator = React.useCallback(() => <View style={styles.txnSeparator} />, []);

  const _noTransactions = React.useCallback(
    () => (
      <View style={styles.emptyTextWrapper}>
        <Text style={styles.emptyText}>No Transactions Available</Text>
      </View>
    ),
    [],
  );

  return (
    <RootSiblingParent>
      <StrictMode>
        <View style={styles.container}>
          <SafeAreaView />

          <StatusBar barStyle={'light-content'} backgroundColor={Colors.MAIN} />

          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.formContainer}>
              {/* Account Balance */}
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Your Balance</Text>
                <Text style={styles.balanceDenomination}>
                  $ETH <Text style={styles.balance}>{formattedBalance.slice(0, 5)}</Text>
                </Text>
              </View>

              <View style={styles.inputWrapper}>
                <Input
                  label="Amount ($ETH)"
                  value={amount}
                  placeholderTextColor={Colors.GRAY_DARK}
                  keyboardType={Platform.OS === 'android' ? 'phone-pad' : 'decimal-pad'}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  style={styles.input}
                  selectionColor={Colors.ACCENT_LIGHT}
                  onSubmitEditing={handleSendPress}
                />
              </View>

              <View style={styles.lastInputWrapper}>
                <Input
                  label="To (address)"
                  value={toAddress}
                  placeholderTextColor={Colors.GRAY_DARK}
                  onChangeText={setToAddress}
                  placeholder="0xAddress"
                  style={styles.input}
                  selectTextOnFocus={true}
                  selectionColor={Colors.ACCENT_LIGHT}
                  onSubmitEditing={handleSendPress}
                />
              </View>

              <SubmitButton
                onPress={handleSendPress}
                loading={addingTxn}
                text={'SEND'}
                loadingText={'Adding Transaction...'}
              />
            </View>
          </TouchableWithoutFeedback>

          <FlatList
            data={transactions}
            style={styles.listStyle}
            renderItem={_renderItem}
            ListHeaderComponent={<Text style={styles.heading}>Transactions</Text>}
            keyExtractor={_keyExtractor}
            ItemSeparatorComponent={_itemSeparator}
            ListEmptyComponent={_noTransactions}
          />
        </View>
      </StrictMode>
    </RootSiblingParent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MAIN,
  },
  formContainer: {
    marginHorizontal: 36,
    marginTop: 24,
  },
  balanceContainer: {
    marginBottom: 40,
    alignSelf: 'flex-end',
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.SECONDARY,
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 12,
    color: Colors.GRAY_LIGHT,
    marginBottom: 4,
  },
  balanceDenomination: {
    fontSize: 16,
    color: Colors.WHITE,
  },
  balance: {
    fontSize: 16,
    fontWeight: '500',
  },
  inputWrapper: {
    marginBottom: 32,
  },
  lastInputWrapper: {
    marginBottom: 48,
  },
  input: {
    color: Colors.WHITE,
    borderColor: Colors.GRAY_LIGHT,
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.WHITE,
    marginTop: 24,
    marginBottom: 16,
    marginLeft: 20,
  },
  txnSeparator: {
    height: 16,
  },
  listStyle: {
    marginTop: 24,
  },
  emptyTextWrapper: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.GRAY_LIGHT,
  },
});

export default App;
