// utils
import React from 'react';

// components
import {Text, TouchableOpacity, View} from 'react-native';

// styles
import {styles} from './RadioButton.styles';

interface RadioButtonProps {
  onPress: () => void;
  selected: boolean;
  text: string;
  style?: {
    [key: string]: string | number;
  };
  disabled?: boolean;
}

const RadioButton: React.FC<RadioButtonProps> = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={styles.container}
      disabled={props.disabled}>
      <View
        style={[styles.root, {marginRight: props.text ? 5 : 0}, props.style]}>
        {props.selected ? <View style={styles.selected} /> : null}
      </View>
      <Text>{props.text}</Text>
    </TouchableOpacity>
  );
};

export default RadioButton;
