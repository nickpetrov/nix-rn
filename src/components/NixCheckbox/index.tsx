// utils
import React from 'react';

// components
import {View, Text, TextInputProps} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

// styles
import {Colors} from 'constants/Colors';
import {styles} from './NixCheckbox.styles';

// types
import {FieldProps} from 'formik';

type NixCheckboxProps = TextInputProps &
  FieldProps & {
    label: string;
  };

const NixCheckbox: React.FC<NixCheckboxProps> = props => {
  const {
    field: {name, value},
    form: {errors, touched, setFieldValue},
    ...inputProps
  } = props;

  const hasError = !!errors[name] && !!touched[name];

  return (
    <>
      <View style={{...styles.inputWrapper, ...styles.pr20}}>
        {/* @ts-ignore */}
        <BouncyCheckbox
          {...inputProps}
          size={25}
          fillColor={Colors.Primary}
          unfillColor="#FFFFFF"
          isChecked={value}
          onPress={checked => {
            setFieldValue(name, checked, true);
            // setFieldTouched(name);
          }}
          style={[styles.checkbox, props.style]}
        />
      </View>
      {hasError && (
        <Text style={styles.errorText}>{errors[name] as string}</Text>
      )}
    </>
  );
};

export default NixCheckbox;
