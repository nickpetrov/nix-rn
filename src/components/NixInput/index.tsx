// utils
import React, {useRef} from 'react';

// components
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TextInputProps,
} from 'react-native';
import {TextInput} from 'react-native';

// styles
import {styles} from './Nixinput.styles';

interface NixInputProps extends TextInputProps {
  label?: string;
  subLabel?: string;
  unit?: string;
  unitValue?: string;
  labelContainerStyle?: {
    [key: string]: string | number;
  };
  labelStyle?: {
    [key: string]: string | number;
  };
  unitStyle?: {
    [key: string]: string | number;
  };
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  rootStyles?: {
    [key: string]: string | number;
  };
  style?: {
    [key: string]: string | number;
  };
  required?: boolean;
  emptyLabel?: boolean;
  withoutErorrText?: boolean;
}

export const NixInput: React.FC<NixInputProps> = ({
  value,
  onChangeText,
  label,
  unit,
  unitValue,
  placeholder,
  error,
  required,
  style,
  rootStyles,
  unitStyle,
  labelStyle,
  subLabel,
  labelContainerStyle,
  withoutErorrText,
  ...props
}) => {
  const inputRef: React.RefObject<TextInput> = useRef(null);

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  return (
    <>
      <TouchableWithoutFeedback
        style={[styles.root, rootStyles && rootStyles]}
        onPress={handleFocus}>
        <View style={styles.inputWrapper}>
          <View
            style={[
              styles.labelContainer,
              labelContainerStyle && labelContainerStyle,
            ]}>
            {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
            {label !== undefined && (
              <Text style={[styles.label, labelStyle && labelStyle]}>
                {label && label}
                {required && <Text style={styles.red}>*</Text>}
              </Text>
            )}
          </View>
          <TextInput
            ref={inputRef}
            style={[styles.input, style && style, !!error && styles.errorInput]}
            onChangeText={onChangeText}
            placeholder={placeholder}
            value={value}
            keyboardType={props.keyboardType}
            {...props}
          />
          {unit !== undefined && (
            <Text style={[styles.unit, unitStyle && unitStyle]}>
              {unit && unit}
            </Text>
          )}
          {unitValue && <Text style={styles.unitValue}>{unitValue}</Text>}
        </View>
      </TouchableWithoutFeedback>
      {error && !withoutErorrText && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </>
  );
};
