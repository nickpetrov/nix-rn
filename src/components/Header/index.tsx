import React from 'react';
import {View, TextInput} from 'react-native';
// import {useDispatch} from 'react-redux';

import {BarcodeScanner} from 'components/BarcodeScanner';
import {styles} from './Header.styles';

// import * as autocompleteActions from '../../store/actions/autocomplete';

export const Header = (props: any) => {
  //   const dispatch = useDispatch();

  const showAutocomplete = () => {
    if (props.navigation) {
      props.navigation.navigate('Autocomplete');
    }
  };

  const searchAutocomplete = (text: string) => {
    console.log(text);
    // dispatch(autocompleteActions.updateSearchResults(text));
  };

  return (
    <View style={styles.header}>
      <View style={styles.autocompleteWrapper}>
        <TextInput
          style={styles.autocomplete}
          placeholder="Search foods to log"
          // onBlur={() => Keyboard.dismiss()}
          onFocus={showAutocomplete}
          onChangeText={searchAutocomplete}
        />
        {!props.hideScannerButton ? (
          <BarcodeScanner {...props} style={styles.barcodeInAutocomplete} />
        ) : null}
      </View>
    </View>
  );
};
