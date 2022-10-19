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
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  style?: {
    [key: string]: string | number;
  };
}

export const NixInput: React.FC<NixInputProps> = ({
  value,
  onChangeText,
  label,
  placeholder,
  error,
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
          {label && <Text style={styles.label}>{label}</Text>}
          <TextInput
            ref={inputRef}
            style={[styles.input, !!error && styles.errorInput]}
            onChangeText={onChangeText}
            placeholder={placeholder}
            value={value}
            keyboardType={props.keyboardType}
          />
        </View>
      </TouchableWithoutFeedback>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};
