// utils
import React from 'react';

// constants
import {Routes} from 'navigation/Routes';

// components
import {TouchableOpacity, Keyboard, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// styles
import {styles} from './BarcodeScanner.styles';

// types
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useRoute} from '@react-navigation/native';
import {useSelector, useDispatch} from 'hooks/useRedux';
import TooltipView from 'components/TooltipView';
import {
  setCheckedEvents,
  setWalkthroughTooltip,
} from 'store/walkthrough/walkthrough.actions';

interface BarcodeScannerProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Autocomplete | Routes.Dashboard | Routes.Basket
  >;
  style?: {
    [key: string]: string | number;
  };
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = props => {
  const route = useRoute();
  const dispatch = useDispatch();
  const {checkedEvents, currentTooltip} = useSelector(
    state => state.walkthrough,
  );
  const initBarcodeScanner = () => {
    if (props.navigation) {
      props.navigation.navigate(Routes.BarcodeScanner, {
        redirectStateKey: route.key,
      });
    }
    Keyboard.dismiss();
  };

  return (
    <TooltipView
      isVisible={
        !checkedEvents.firstLogin.value &&
        currentTooltip?.eventName === 'firstLogin' &&
        currentTooltip?.step === 1
      }
      title={
        currentTooltip
          ? checkedEvents[currentTooltip?.eventName].steps[currentTooltip?.step]
              .title
          : ''
      }
      text={
        currentTooltip
          ? checkedEvents[currentTooltip?.eventName].steps[currentTooltip?.step]
              .text
          : ''
      }
      prevAction={() => {
        dispatch(setWalkthroughTooltip('firstLogin', 0));
      }}
      nextAction={() => {
        dispatch(setWalkthroughTooltip('firstLogin', 2));
      }}
      finishAction={() => {
        dispatch(setCheckedEvents('firstLogin', true));
      }}
      childrenWrapperStyle={{backgroundColor: '#fff', padding: 0}}
      parentWrapperStyle={{...styles.barcodeButtonWrapper, ...props.style}}>
      <TouchableOpacity
        onPress={initBarcodeScanner}
        // style={{ ...styles.barcodeButtonWrapper, ...props.style }}
      >
        <View style={styles.barcodeIconWrapper}>
          <FontAwesome name="barcode" size={30} color="#000" />
        </View>
      </TouchableOpacity>
    </TooltipView>
  );
};
