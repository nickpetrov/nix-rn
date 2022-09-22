// utils
import React from 'react';

// components
import {View, Text, TextInput} from 'react-native';

// styles
import {styles} from './CustomFoodField.styles';

// types
import {UpdateCustomFoodProps} from 'store/customFoods/customFoods.types';

interface CustomFoodFieldProps {
  label: string;
  measureUnit: string;
  fieldName: keyof UpdateCustomFoodProps;
  value: string | number | null;
  onFieldChange: (fieldName: keyof UpdateCustomFoodProps, text: string) => void;
  children?: React.ReactNode;
}

const CustomFoodField: React.FC<CustomFoodFieldProps> = props => {
  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.label}>{props.label}</Text>
        <TextInput
          style={styles.input}
          value={(props.value || '') + ''}
          onChangeText={text => {
            props.onFieldChange(props.fieldName, text);
          }}
          keyboardType="numeric"
        />
        <Text style={styles.text}>{props.measureUnit}</Text>
      </View>
      <View>{props.children}</View>
    </View>
  );
};

export default CustomFoodField;
