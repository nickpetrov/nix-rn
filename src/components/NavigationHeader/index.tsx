// utils
import React, {useRef} from 'react';

// components
import {View, Text, TextInput} from 'react-native';
import {BarcodeScanner} from 'components/BarcodeScanner';
import {getHeaderTitle, HeaderTitleProps} from '@react-navigation/elements';
import BackButton from 'components/BackButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native-gesture-handler';
import TooltipView from 'components/TooltipView';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import {setSearchValue} from 'store/autoComplete/autoComplete.actions';

// styles
import {styles} from './NavigationHeader.styles';

// types
import {
  NativeStackHeaderProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// constants
import {Routes} from 'navigation/Routes';

interface NavigationHeaderProps extends NativeStackHeaderProps {
  navigation: NativeStackNavigationProp<StackNavigatorParamList, any>;
  options: {
    title?: string | undefined;
    headerTitle?:
      | string
      | ((props: HeaderTitleProps) => React.ReactNode)
      | undefined;
  };
  headerRight?: React.ReactNode;
  headerLeft?: React.ReactNode;
  headerTitle?: string;
  withAutoComplete?: boolean;
  children?: React.ReactNode;
  withoutTitle?: boolean;
  emptyRight?: boolean;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  navigation,
  route,
  options,
  back,
  headerLeft,
  headerRight,
  headerTitle,
  withAutoComplete,
  children,
  withoutTitle,
  emptyRight,
}) => {
  const searchValue = useSelector(state => state.autoComplete.searchValue);
  const dispatch = useDispatch();
  const title = getHeaderTitle(options, route.name);
  const inputRef = useRef<TextInput>(null);

  const showAutocomplete = () => {
    if (navigation && route.name !== Routes.Autocomplete) {
      navigation.navigate(Routes.Autocomplete);
      inputRef.current?.blur();
    }
  };

  const searchAutocomplete = (text: string) => {
    dispatch(setSearchValue(text));
  };

  const smallSize =
    route.name === Routes.Totals
      ? {
          fontSize: 16,
        }
      : {};

  return (
    <View style={styles.header}>
      {headerLeft ? headerLeft : back && <BackButton navigation={navigation} />}
      {withAutoComplete && (
        <TooltipView
          eventName="firstLogin"
          step={0}
          childrenWrapperStyle={{flexDirection: 'row'}}
          parentWrapperStyle={styles.autocompleteWrapper}>
          {/* used without tooltip */}
          {/* <View style={styles.autocompleteWrapper}> */}
          <TextInput
            ref={inputRef}
            style={styles.autocomplete}
            placeholder="Search foods to log"
            // onBlur={() => Keyboard.dismiss()}
            onLayout={() => {
              if (route.name === Routes.Autocomplete) {
                inputRef.current?.focus();
              }
            }}
            value={searchValue}
            onFocus={showAutocomplete}
            onChangeText={searchAutocomplete}
            returnKeyType="search"
          />
          {searchValue.length > 0 && (
            <View style={styles.closeBtn}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesome name="close" color="#000" size={13} />
              </TouchableOpacity>
            </View>
          )}
          {route.name === Routes.Dashboard ||
          route.name === Routes.Basket ||
          route.name === Routes.TrackFoods ? (
            <BarcodeScanner
              navigation={navigation}
              style={styles.barcodeInAutocomplete}
            />
          ) : null}
          {/* </View> */}
        </TooltipView>
      )}
      {children && children}
      {!withAutoComplete && !withoutTitle && (
        <View style={styles.titleContainer}>
          <Text style={[styles.title, smallSize]}>
            {headerTitle ? headerTitle : title}
          </Text>
        </View>
      )}
      {headerRight ? (
        headerRight
      ) : !emptyRight ? (
        <View style={styles.emptyRight}></View>
      ) : null}
    </View>
  );
};
