// utils
import React, {useRef, useCallback, useState, useEffect} from 'react';

import 'react-native-reanimated';

// components
import {Camera, CameraType} from 'react-native-camera-kit';
import {
  View,
  Linking,
  ActivityIndicator,
  Image,
  Platform,
  Text,
  Vibration,
} from 'react-native';
import {Svg, Defs, Rect, Mask} from 'react-native-svg';

// helpers
import requestCameraPermission from 'helpers/cameraPermision';

// hooks
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'hooks/useRedux';

// actions
import {setInfoMessage} from 'store/base/base.actions';

// styles
import {styles} from './Scanner.styles';
import LoadIndicator from 'components/LoadIndicator';

interface ScannerProps {
  callBack: (newBarcode: string) => void;
  from?: string;
  withPreView?: boolean;
  isFocused: boolean;
}

export interface IPhoto {
  name: string;
  size: number;
  uri: string;
}

interface IScannerEvent {
  nativeEvent: {
    codeStringValue: string;
  };
}

const Scanner: React.FC<ScannerProps> = ({
  callBack,
  withPreView,
  from,
  isFocused,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const camera = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [picture, setPicture] = useState<IPhoto | null>(null);

  const takePhoto = async () => {
    const photo = await camera.current?.capture();

    if (photo?.uri) {
      setPicture((prev: IPhoto | null) => {
        if (!prev) {
          return photo;
        } else {
          return prev;
        }
      });
    }
  };

  const requestPermission = useCallback(async () => {
    const status = await requestCameraPermission();
    if (!status) {
      await Linking.openSettings();
    }
    setHasPermission(!!status);
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const handleBarcodeScanner = useCallback(
    (event: IScannerEvent) => {
      const code = event.nativeEvent.codeStringValue;
      if (!code || barcode) {
        return;
      }

      Vibration.vibrate(100);
      setBarcode(code);

      if (!isNaN(parseFloat(code)) || code?.includes('nutritionix.com')) {
        return callBack(code);
      }
      if (withPreView) {
        return takePhoto();
      }
      if (from) {
        navigation.navigate(from);
      }

      dispatch(
        setInfoMessage({
          title: 'Error',
          text: 'We scanned an unrecognized QR code, if you are trying to scan a food product barcode, please try to avoid scanning the QR code near the barcode and try scanning this product again',
          btnText: 'Ok',
        }),
      );
    },
    [dispatch, navigation, callBack, from, withPreView],
  );

  if (!hasPermission || !isFocused) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <Camera
        style={{flex: 1}}
        ref={camera}
        cameraType={CameraType.Back}
        flashMode="auto"
        scanBarcode={isFocused && !barcode}
        onReadCode={(event: IScannerEvent) =>
          isFocused && !barcode ? handleBarcodeScanner(event) : null
        }
        showFrame={false}
      />
      <View style={styles.qrCodeContainer}>
        <Svg height="100%" width="100%">
          <Defs>
            <Mask id="mask" x="0" y="0" height="100%" width="100%">
              <Rect height="100%" width="100%" fill="#fff" />
              <Rect x="18%" y="30%" height="250" width="250" fill="black" />
            </Mask>
          </Defs>
          <Rect
            height="100%"
            width="100%"
            fill="rgba(0,0,0,0.6)"
            mask="url(#mask)"
          />
        </Svg>
      </View>
      {picture && withPreView && (
        <Image
          style={styles.snapshot}
          source={{
            uri:
              Platform.OS === 'ios' ? picture?.uri : `file://${picture?.uri}`,
          }}
          resizeMode="contain"
        />
      )}
      {!barcode && (
        <View style={styles.qrCodeTitleContainer}>
          <Text style={styles.qrCodeTitle}>Please scan a barcode</Text>
        </View>
      )}
      {barcode && <LoadIndicator withShadow />}
    </>
  );
};

export default Scanner;
