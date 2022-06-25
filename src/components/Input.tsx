import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { Colors } from '../styles/colors';

interface InputProps extends TextInputProps {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...restProps }) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <TextInput {...restProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: Colors.GRAY_LIGHT,
    fontSize: 16,
    marginBottom: 4,
  },
});

export default React.memo(Input);
