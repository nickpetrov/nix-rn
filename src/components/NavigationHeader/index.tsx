// utils
import React, {useRef} from 'react';

// components
import {View, Text, TextInput, Platform} from 'react-native';
import {BarcodeScanner} from 'components/BarcodeScanner';
import {getHeaderTitle} from '@react-navigation/elements';
import BackButton from 'components/BackButton';

// hooks
import {useDispatch} from 'hooks/useRedux';

// actions
import {updateSearchResults} from 'store/autoComplete/autoComplete.actions';

// styles
import {styles} from './NavigationHeader.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// constants
import {Routes} from 'navigation/Routes';

interface NavigationHeaderProps {
  navigation: NativeStackNavigationProp<StackNavigatorParamList, any>;
  route: any;
  back: boolean;
  options: any;
  headerRight?: React.ReactNode;
  headerLeft?: React.ReactNode;
  headerTitle?: string;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  navigation,
  route,
  options,
  back,
  headerLeft,
  headerRight,
  headerTitle,
}) => {
  const dispatch = useDispatch();
  const title = getHeaderTitle(options, route.name);
  const inputRef = useRef<TextInput>(null);

  const showAutocomplete = () => {
    if (navigation && route.name !== Routes.Autocomplete) {
      navigation.navigate(Routes.Autocomplete);
    }
  };

  const searchAutocomplete = (text: string) => {
    dispatch(updateSearchResults(text));
  };

  return (
    <View style={styles.header}>
      {headerLeft ? headerLeft : back && <BackButton navigation={navigation} />}
      {route.name === Routes.Dashboard ||
      route.name === Routes.Autocomplete ||
      route.name === Routes.Basket ? (
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
          {route.name === Routes.Dashboard || route.name === Routes.Basket ? (
            <BarcodeScanner
              navigation={navigation}
              style={styles.barcodeInAutocomplete}
            />
          ) : null}
        </View>
      ) : (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{headerTitle ? headerTitle : title}</Text>
        </View>
      )}
      {headerRight ? headerRight : null}
    </View>
  );
};
