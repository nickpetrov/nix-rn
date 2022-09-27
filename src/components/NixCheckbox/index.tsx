// utils
import React, {useState} from 'react';

// components
import {View, TextInputProps} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

// styles
import {Colors} from 'constants';
import {styles} from './NixCheckbox.styles';

// types
import {FieldProps} from 'formik';

type NixCheckboxProps = TextInputProps &
  FieldProps & {
    label: string;
  };

const NixCheckbox: React.FC<NixCheckboxProps> = props => {
  const {
    field: {name, value, onBlur},
    form: {setFieldTouched, setFieldValue},
    ...inputProps
  } = props;

  const [isChecked, setIsChecked] = useState(value);

  // const hasError = !!errors[name] && !!touched[name];

  return (
    <>
      <View style={{...styles.inputWrapper, ...styles.pr20}}>
        <BouncyCheckbox
          size={25}
          fillColor={Colors.Primary}
          unfillColor="#FFFFFF"
          isChecked={isChecked}
          onPress={() => {
            setFieldValue(name, !isChecked);
            setFieldTouched(name);
            setIsChecked(!isChecked);
          }}
          {...inputProps}
          onBlur={e => onBlur(e)}
          onFocus={() => {}}
          style={[styles.checkbox, props.style]}
        />
      </View>
      {/* {hasError && (
        <Text style={styles.errorText}>{errors[name] as React.ReactNode}</Text>
      )} */}
    </>
  );
};

export default NixCheckbox;
