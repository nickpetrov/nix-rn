// utils
import React, {useRef, useCallback, useState, useEffect} from 'react';

import 'react-native-reanimated';
import {first} from 'lodash';

// components
import {Camera, PhotoFile, PhysicalCameraDeviceType, useCameraDevices} from 'react-native-vision-camera';
import {
  View,
  Linking,
  ActivityIndicator,
  Image,
  Platform,
  Text,
  Pressable,
} from 'react-native';
import {Svg, Defs, Rect, Mask} from 'react-native-svg';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';

// hooks
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'hooks/useRedux';

// actions
import {setInfoMessage} from 'store/base/base.actions';

// styles
import {styles} from './Scanner.styles';

interface ScannerProps {
  callBack: (newBarcode: string) => void;
  from?: string;
  withPreView?: boolean;
  isFocused: boolean;
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
  const [hasPermission, setHasPermission] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [picture, setPicture] = useState<PhotoFile | null>(null);
  const [deviceType, setDeviceType] = useState<PhysicalCameraDeviceType>(); 
  
  const devices = useCameraDevices(deviceType as PhysicalCameraDeviceType);
  const device = devices.back;

  const handleChangeLens = (type: PhysicalCameraDeviceType) => {
    if(!device?.devices.includes(type)) {
      return
    }
    setDeviceType(type)
  }

  const [frameProcessor, barcodes] = useScanBarcodes(
    [BarcodeFormat.ALL_FORMATS],
    {
      checkInverted: true,
    },
  );

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
    setBarcode(prev => {
      if (!prev && barcodes.length) {
        if (
          barcodes[0].format !== BarcodeFormat.QR_CODE ||
          barcodes[0].rawValue?.includes('nutritionix.com')
        ) {
          if (withPreView) {
            takePhoto();
          }
        } else {
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
        }
        if (barcodes[0].rawValue) {
          callBack(barcodes[0].rawValue);
          return barcodes[0].rawValue;
        } else {
          return prev;
        }
      } else {
        return prev;
      }
    });
  }, [barcodes, dispatch, navigation, callBack, from, withPreView]);

  if (device == null || !hasPermission || !isFocused) {
    return <ActivityIndicator />;
  }

  const lensSize = (type: PhysicalCameraDeviceType) => {
    if (type === 'telephoto-camera') {
      return 2
    }
    if (type === 'ultra-wide-angle-camera') {
      return 0.5
    }
      return 1
  }

  return (
    <>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={isFocused && !barcode}
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
        {device.devices?.length > 1 && <View style={styles.zoom}>
          {device.devices.map(cameraType => (
              <Pressable
              key={cameraType}
              style={[styles.zoomButton, deviceType === cameraType && styles.activeZoomButton]}
              onPress={() => handleChangeLens(cameraType)}
            >
              <Text>{lensSize(cameraType)}</Text>
            </Pressable>
          ))}
        </View>}
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
