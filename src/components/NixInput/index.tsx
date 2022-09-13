// utils
import React, {useState} from 'react';

// components
import {View, Text, TextInputProps} from 'react-native';
import {FloatingLabelInput} from 'react-native-floating-label-input';
import {FieldProps} from 'formik';

// styles
import {styles} from './Nixinput.styles';

type NixInputProps = TextInputProps &
  FieldProps & {
    label: string;
  };

export const NixInput: React.FC<NixInputProps> = props => {
  const {
    field: {name, onBlur, onChange, value},
    form: {errors, touched, setFieldTouched},
    label,
    ...inputProps
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  const hasError = errors[name] && touched[name];

  return (
    <>
      <View style={styles.inputWrapper}>
        <FloatingLabelInput
          style={[hasError ? styles.errorInput : {}]}
          onChangeText={(text: string) => onChange(name)(text)}
          isFocused={isFocused}
          onBlur={() => {
            setFieldTouched(name);
            onBlur(name);
            value === '' && setIsFocused(false);
          }}
          value={value}
          label={label}
          {...inputProps}
        />
      </View>
      {hasError && (
        <Text style={styles.errorText}>{errors[name] as React.ReactNode}</Text>
      )}
    </>
  );
};
