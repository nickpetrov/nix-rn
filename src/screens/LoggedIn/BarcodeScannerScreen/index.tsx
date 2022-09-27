// utils
import React, {useState, useEffect, useCallback} from 'react';

// components
import {ActivityIndicator, Text, View, Linking} from 'react-native';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import MealListItem from 'components/FoodLog/MealListItem';
import {BarcodeFormat, useScanBarcodes} from 'vision-camera-code-scanner';
import {Svg, Defs, Rect, Mask} from 'react-native-svg';
import {NixButton} from 'components/NixButton/index';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import {clearSnanedFood, getFoodByQRcode} from 'store/foods/foods.actions';

// constants
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// styles
import {styles} from './BarcodeScannerScreen.styles';

interface BarcodeScannerScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.BarcodeScanner
  >;
}

export const BarcodeScannerScreen: React.FC<BarcodeScannerScreenProps> =
  React.memo(({navigation}) => {
    const [isActive, setActive] = useState(true);
    const dispatch = useDispatch();
    const [inProgress, setInProgress] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const devices = useCameraDevices();
    const device = devices.back;
    const [scanStatus, setScanStatus] = useState<'success' | 'error'>();
    const foodFindByQRcode = useSelector(state => state.foods.foodFindByQRcode);
    const [barcode, setBarcode] = useState<string>();

    const [frameProcessor, barcodes] = useScanBarcodes(
      [BarcodeFormat.ALL_FORMATS],
      {
        checkInverted: true,
      },
    );

    useEffect(() => {
      if (barcodes.length && barcodes[0]?.rawValue && !inProgress && !barcode) {
        setInProgress(true);
        dispatch(getFoodByQRcode(barcodes[0]?.rawValue))
          .then(() => {
            setInProgress(false);
            setScanStatus('success');
            setBarcode(barcodes[0]?.rawValue);
          })
          .catch(error => {
            if (error.status === 404) {
              setScanStatus('success');
              setBarcode(barcodes[0]?.rawValue);
            } else {
              setScanStatus('error');
            }

            setInProgress(false);
          });
      }
    }, [barcodes, dispatch, inProgress, barcode]);

    const tryAgainHandler = () => {
      dispatch(clearSnanedFood());
      setScanStatus(undefined);
      setBarcode(undefined);
    };

    const useBarcodeHandler = () => {
      if (navigation && barcode) {
        navigation.navigate(Routes.PhotoUpload, {
          barcode,
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
      dispatch(clearSnanedFood());
      setScanStatus(undefined);
      setBarcode(undefined);
    }, [requestPermission, dispatch]);

    useEffect(() => {
      const unsubscribe = navigation.addListener('beforeRemove', () => {
        setActive(false);
      });
      return unsubscribe;
    }, [navigation]);

    if (device == null || !hasPermission) {
      return <ActivityIndicator />;
    }

    return (
      <View style={styles.root}>
        {scanStatus === 'success' && foodFindByQRcode && (
          <View>
            <MealListItem foodObj={foodFindByQRcode} />
          </View>
        )}
        {scanStatus && (
          <View style={styles.btnContainer}>
            <NixButton
              type="royal"
              title="Try Again"
              onPress={tryAgainHandler}
            />
          </View>
        )}
        {scanStatus === 'success' && (
          <View style={styles.btnContainer}>
            <NixButton
              type="primary"
              title="Correct"
              onPress={useBarcodeHandler}
            />
          </View>
        )}
        {!foodFindByQRcode && !scanStatus && (
          <>
            <Camera
              style={styles.camera}
              device={device}
              isActive={isActive}
              frameProcessor={frameProcessor}
              frameProcessorFps={5}
            />
            <View style={styles.qrCodeContainer}>
              <View style={styles.qrCodeTitleContainer}>
                <Text style={styles.qrCodeTitle}>Please scan a barcode</Text>
              </View>
              <Svg height="100%" width="100%">
                <Defs>
                  <Mask id="mask" x="0" y="0" height="100%" width="100%">
                    <Rect height="100%" width="100%" fill="#fff" />
                    <Rect
                      x="18%"
                      y="30%"
                      height="250"
                      width="250"
                      fill="black"
                    />
                  </Mask>
                </Defs>
                <Rect
                  height="100%"
                  width="100%"
                  fill="rgba(0,0,0,0.6)"
                  mask="url(#mask)"
                />

                {/* Frame border */}
                <Rect
                  x="18%"
                  y="30%"
                  height="250"
                  width="250"
                  strokeWidth="2"
                  stroke="red"
                />
              </Svg>
            </View>
          </>
        )}
      </View>
    );
  });
