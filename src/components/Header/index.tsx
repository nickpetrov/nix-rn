// utils
import React from 'react';

// components
import {View, TextInput} from 'react-native';
import {BarcodeScanner} from 'components/BarcodeScanner';

// hooks
import {useDispatch} from 'hooks/useRedux';

// actions
import {updateSearchResults} from 'store/autoComplete/autoComplete.actions';

// styles
import {styles} from './Header.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// constants
import {Routes} from 'navigation/Routes';

interface HeaderProps {
  navigation: NativeStackNavigationProp<any>;
  hideScannerButton?: boolean;
}

export const Header: React.FC<HeaderProps> = props => {
  const dispatch = useDispatch();

  const showAutocomplete = () => {
    if (props.navigation) {
      props.navigation.navigate(Routes.LoggedIn, {
        screen: Routes.Home,
        params: {
          screen: Routes.Autocomplete,
        },
      });
    }
  };

  const searchAutocomplete = (text: string) => {
    dispatch(updateSearchResults(text));
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
