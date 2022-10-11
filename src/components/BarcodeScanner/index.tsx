// utils
import React from 'react';

// constants
import {Routes} from 'navigation/Routes';

// components
import {View, TouchableOpacity, Keyboard} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// styles
import {styles} from './BarcodeScanner.styles';

// types
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useRoute} from '@react-navigation/native';

interface BarcodeScannerProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Autocomplete | Routes.Dashboard | Routes.Basket
  >;
  style: {
    [key: string]: string | number;
  };
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = props => {
  const route = useRoute();
  const initBarcodeScanner = () => {
    if (props.navigation) {
      props.navigation.navigate(Routes.BarcodeScanner, {
        redirectStateKey: route.key,
      });
    }
    Keyboard.dismiss();
  };

  return (
    <TouchableOpacity
      onPress={initBarcodeScanner}
      style={{...styles.barcodeButtonWrapper, ...props.style}}>
      <View style={styles.barcodeIconWrapper}>
        <FontAwesome name="barcode" size={30} color="#000" />
      </View>
    </TouchableOpacity>
  );
};
