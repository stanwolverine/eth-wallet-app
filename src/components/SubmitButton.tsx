import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { Colors } from '../styles/colors';

interface SubmitButtonProps {
  onPress(): void;
  loading: boolean;
  text: string;
  loadingText?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onPress, loading, text, loadingText }) => {
  return (
    <TouchableHighlight
      style={[
        styles.container,
        {
          backgroundColor: loading ? Colors.ACCENT_LIGHT : Colors.ACCENT,
        },
      ]}
      onPress={onPress}
      disabled={loading}
      underlayColor={Colors.ACCENT_DARK}
    >
      {loading ? (
        <View style={styles.loadingWrapper}>
          {loadingText ? <Text style={styles.loadingText}>{loadingText}</Text> : null}

          <ActivityIndicator size={'small'} color={Colors.WHITE} />
        </View>
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.WHITE,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.WHITE,
    marginRight: 8,
  },
  loadingWrapper: { flexDirection: 'row' },
});

export default React.memo(SubmitButton);
