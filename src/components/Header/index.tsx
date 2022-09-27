// utils
import React, {useRef} from 'react';

// components
import {View, TextInput, Platform} from 'react-native';
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
import {useRoute} from '@react-navigation/native';
import {StackNavigatorParamList} from 'navigation/navigation.types';

interface HeaderProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Autocomplete | Routes.Dashboard | Routes.Basket
  >;
  hideScannerButton?: boolean;
}

export const Header: React.FC<HeaderProps> = props => {
  const dispatch = useDispatch();
  const route = useRoute();
  const inputRef = useRef<TextInput>(null);

  const showAutocomplete = () => {
    if (props.navigation && route.name !== Routes.Autocomplete) {
      props.navigation.navigate(Routes.Autocomplete);
    }
  };

  const searchAutocomplete = (text: string) => {
    dispatch(updateSearchResults(text));
  };

  return (
    <View style={styles.header}>
      <View style={styles.autocompleteWrapper}>
        <TextInput
          ref={inputRef}
          style={styles.autocomplete}
          placeholder="Search foods to log"
          // onBlur={() => Keyboard.dismiss()}
          onLayout={() => {
            if (
              route.name === Routes.Autocomplete &&
              Platform.OS === 'android'
            ) {
              inputRef.current?.focus();
            }
          }}
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
