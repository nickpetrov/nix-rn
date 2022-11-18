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
  errorStyles?: {
    [key: string]: string | number;
  };
  required?: boolean;
  emptyLabel?: boolean;
  withErrorBorder?: boolean;
  withoutErorrText?: boolean;
  column?: boolean;
  children?: React.ReactNode;
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
  column,
  children,
  errorStyles,
  withErrorBorder,
  ...props
}) => {
  const inputRef: React.RefObject<TextInput> = useRef(null);

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  return (
    <TouchableWithoutFeedback onPress={handleFocus}>
      <View>
        <View style={[styles.root, rootStyles && rootStyles]}>
          <View style={[styles.inputWrapper, column && styles.column]}>
            <View
              style={[
                styles.labelContainer,
                labelContainerStyle && labelContainerStyle,
                column && styles.labelColumn,
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
              style={[
                styles.input,
                style && style,
                column && styles.inputColumn,
                !!error && withErrorBorder && styles.errorInput,
              ]}
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
            {children && children}
          </View>
        </View>
        {error && !withoutErorrText && (
          <Text style={[styles.errorText, errorStyles && errorStyles]}>
            {error}
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
