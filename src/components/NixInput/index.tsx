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
  unit?: string;
  unitStyle?: {
    [key: string]: string | number;
  };
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  style?: {
    [key: string]: string | number;
  };
  required?: boolean;
  emptyLabel?: boolean;
}

export const NixInput: React.FC<NixInputProps> = ({
  value,
  onChangeText,
  label,
  unit,
  placeholder,
  error,
  required,
  style,
  unitStyle,
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
      <TouchableWithoutFeedback style={styles.root} onPress={handleFocus}>
        <View style={styles.inputWrapper}>
          {label !== undefined && (
            <Text style={styles.label}>
              {label && label}
              {required && <Text style={styles.red}>*</Text>}
            </Text>
          )}
          <TextInput
            ref={inputRef}
            style={[styles.input, !!error && styles.errorInput, style && style]}
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
        </View>
      </TouchableWithoutFeedback>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};
