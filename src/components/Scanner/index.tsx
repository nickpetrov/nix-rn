// utils
import React, {useRef, useCallback, useState, useEffect} from 'react';

// components
import {Camera, PhotoFile, useCameraDevices} from 'react-native-vision-camera';
import {
  View,
  Linking,
  ActivityIndicator,
  Image,
  Platform,
  Text,
} from 'react-native';
import {Svg, Defs, Rect, Mask} from 'react-native-svg';
import {
  useScanBarcodes,
  BarcodeFormat,
  Barcode,
} from 'vision-camera-code-scanner';

// hooks
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch} from 'hooks/useRedux';

// actions
import {setInfoMessage} from 'store/base/base.actions';

// styles
import {styles} from './Scanner.styles';

interface ScannerProps {
  callBack: (barcodes: Barcode[]) => void;
  redirectStateKey?: string;
  withPreView?: boolean;
}

const Scanner: React.FC<ScannerProps> = ({
  callBack,
  withPreView,
  redirectStateKey,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const isActive = useIsFocused();
  const devices = useCameraDevices();
  const device = devices.back;
  const camera = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [picture, setPicture] = useState<PhotoFile | null>(null);

  const [frameProcessor, barcodes] = useScanBarcodes(
    [BarcodeFormat.ALL_FORMATS],
    {
      checkInverted: true,
    },
  );
  // for some reason close app when use this
  // const frameProcessor = useFrameProcessor(frame => {
  //   'worklet';
  //   const detectedBarcodes = scanBarcodes(
  //     frame,
  //     [BarcodeFormat.ALL_FORMATS],
  //     {
  //       checkInverted: true,
  //     },
  //   );
  //   console.log('detectedBarcodes', detectedBarcodes);
  //   const scanedBarcode = detectedBarcodes[0];
  //   if (scanedBarcode) {
  //     if (
  //       scanedBarcode.format !== BarcodeFormat.QR_CODE ||
  //       scanedBarcode.rawValue?.includes('nutritionix.com')
  //     ) {
  //       takePhoto();
  //       setTimeout(() => runOnJS(setBarcode)(scanedBarcode.rawValue), 3000);
  //     } else {
  //       navigation.navigate({
  //         key: route.params?.redirectStateKey || '',
  //         params: {
  //           scanError: true,
  //         },
  //       });
  //     }
  //   }
  // }, []);

  const takePhoto = async () => {
    const photo = await camera.current?.takePhoto();
    if (photo?.path) {
      setPicture((prev: PhotoFile | null) => {
        if (!prev) {
          return photo;
        } else {
          return prev;
        }
      });
    }
  };

  const requestPermission = useCallback(async () => {
    const status = await Camera.requestCameraPermission();
    if (status === 'denied') {
      await Linking.openSettings();
    }
    setHasPermission(status === 'authorized');
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    if (barcodes.length && !barcode) {
      if (
        barcodes[0].format !== BarcodeFormat.QR_CODE ||
        barcodes[0].rawValue?.includes('nutritionix.com')
      ) {
        if (withPreView) {
          takePhoto();
        }
        callBack(barcodes);
        if (barcodes[0].rawValue) {
          setBarcode(barcodes[0].rawValue);
        }
      } else {
        if (redirectStateKey) {
          navigation.navigate({
            key: redirectStateKey,
          });
        }
        dispatch(
          setInfoMessage({
            title: 'Error',
            text: 'We scanned an unrecognized QR code, if you are trying to scan a food product barcode, please try to avoid scanning the QR code near the barcode and try scanning this product again',
            btnText: 'Ok',
          }),
        );
      }
    }
  }, [
    barcodes,
    dispatch,
    barcode,
    navigation,
    callBack,
    redirectStateKey,
    withPreView,
  ]);

  if (device == null || !hasPermission || !isActive) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={isActive}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
        photo={true}
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
              Platform.OS === 'ios' ? picture?.path : `file://${picture?.path}`,
          }}
          resizeMode="contain"
        />
      )}
      {!barcode && (
        <View style={styles.qrCodeTitleContainer}>
          <Text style={styles.qrCodeTitle}>Please scan a barcode</Text>
        </View>
      )}
    </>
  );
};

export default Scanner;
