// utils
import React from 'react';

// components
import {View, TouchableOpacity, Keyboard} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// hooks
// import {useDispatch} from 'hooks';

// styles
import {styles} from './BarcodeScanner.styles';

export const BarcodeScanner = (props: any) => {
  // const dispatch = useDispatch();

  const initBarcodeScanner = () => {
    if (props.navigation) {
      props.navigation.navigate('BarcodeScanner');
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
