// utils
import React, {useState, useEffect, useCallback, useRef} from 'react';

// components
import {
  ActivityIndicator,
  Text,
  View,
  Linking,
  Image,
  Platform,
} from 'react-native';
import {useCameraDevices, Camera, PhotoFile} from 'react-native-vision-camera';
import {Svg, Defs, Rect, Mask} from 'react-native-svg';
import {NixButton} from 'components/NixButton/index';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import {clearSnanedFood, getFoodByQRcode} from 'store/foods/foods.actions';
import {addFoodToBasket} from 'store/basket/basket.actions';
import {addExistFoodToBasket} from 'store/basket/basket.actions';

// constants
import {Routes} from 'navigation/Routes';
import {grocery_photo_upload} from 'config/index';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {FoodProps} from 'store/userLog/userLog.types';
import {RouteProp} from '@react-navigation/native';

// helpers
import {
  externalLinkV1,
  externalLinkV2,
  externalLinkV3,
} from 'helpers/externalLinks';

// styles
import {styles} from './BarcodeScannerScreen.styles';

interface BarcodeScannerScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.BarcodeScanner
  >;
  route: RouteProp<StackNavigatorParamList, Routes.BarcodeScanner>;
}

export const BarcodeScannerScreen: React.FC<BarcodeScannerScreenProps> =
  React.memo(({navigation, route}) => {
    const [picture, setPicture] = useState<PhotoFile | null>(null);
    const userData = useSelector(state => state.auth.userData);
    const force_photo_upload = route.params?.force_photo_upload;
    const [isActive, setActive] = useState(true);
    const [showHelpPopup, setShowHelpPopup] = useState<FoodProps[] | false>(
      false,
    );
    const dispatch = useDispatch();
    const [hasPermission, setHasPermission] = useState(false);
    const devices = useCameraDevices();
    const device = devices.back;
    const foodFindByQRcode = useSelector(state => state.foods.foodFindByQRcode);
    const [barcode, setBarcode] = useState<string>();
    const camera = useRef<Camera>(null);

    const [frameProcessor, barcodes] = useScanBarcodes(
      [BarcodeFormat.ALL_FORMATS],
      {
        checkInverted: true,
      },
    );

    const takeSnapShot = async () => {
      const photo = await camera.current?.takeSnapshot({
        quality: 85,
        skipMetadata: true,
      });
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
    //       takeSnapShot();
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

    useEffect(() => {
      if (barcodes.length && !barcode) {
        if (
          barcodes[0].format !== BarcodeFormat.QR_CODE ||
          barcodes[0].rawValue?.includes('nutritionix.com')
        ) {
          takeSnapShot();
          setTimeout(() => setBarcode(barcodes[0].rawValue), 3000);
        } else {
          navigation.navigate({
            key: route.params?.redirectStateKey || '',
            params: {
              scanError: true,
            },
          });
        }
      }
    }, [barcodes, dispatch, barcode, navigation, route]);

    useEffect(() => {
      if (barcode && barcode.length > 14) {
        if (barcode.includes('nutritionix.com/q1')) {
          dispatch(addExistFoodToBasket([externalLinkV1(barcode)])).then(() =>
            navigation.navigate(Routes.Basket, {
              redirectStateKey: route.params?.redirectStateKey,
            }),
          );
        } else if (barcode.includes('nutritionix.com/q2')) {
          dispatch(addFoodToBasket(externalLinkV2(barcode))).then(() =>
            navigation.navigate(Routes.Basket, {
              redirectStateKey: route.params?.redirectStateKey,
            }),
          );
        } else if (barcode.includes('nutritionix.com/q3')) {
          externalLinkV3(barcode).then(foods => {
            if (foods && foods.length) {
              foods[0].consumed_at = new Date();
              if (foods[0].ingredients) {
                foods[0].ingredients.map((ingredient: FoodProps) => {
                  ingredient.consumed_at = new Date();
                });
                dispatch(addExistFoodToBasket(foods[0].ingredients)).then(() =>
                  navigation.navigate(Routes.Basket, {
                    redirectStateKey: route.params?.redirectStateKey,
                  }),
                );
              } else {
                dispatch(addExistFoodToBasket(foods)).then(() =>
                  navigation.navigate(Routes.Basket, {
                    redirectStateKey: route.params?.redirectStateKey,
                  }),
                );
              }
            }
          });
        }
      } else if (barcode) {
        dispatch(getFoodByQRcode(barcode, force_photo_upload))
          .then((foods?: FoodProps[] | null) => {
            // return foods only if foods need to be updated
            if (
              foods &&
              (force_photo_upload ||
                userData.grocery_agent ||
                /* (check when add GroceryAgentScreen)  &&
          !!(
            $rootScope.groceryAgentPreferences &&
            $rootScope.groceryAgentPreferences.volunteer
          ) */ Math.floor(
                  Math.random() *
                    grocery_photo_upload.user_volunteering_multiplicator,
                ) === 0)
            ) {
              navigation.navigate(Routes.PhotoUpload, {
                barcode,
                redirectStateKey: route.params?.redirectStateKey,
              });
            } else if (foods && !force_photo_upload) {
              setShowHelpPopup(foods);
            } else {
              navigation.navigate(Routes.Basket, {
                redirectStateKey: route.params?.redirectStateKey,
              });
            }
          })
          .catch(error => {
            if (error.status === 404) {
              // check if user grocery_agent
              if (userData.grocery_agent) {
                navigation.navigate(Routes.PhotoUpload, {
                  barcode,
                  redirectStateKey: route.params?.redirectStateKey,
                });
              } else {
                navigation.navigate(Routes.PhotoUpload, {
                  barcode,
                  redirectStateKey: route.params?.redirectStateKey,
                });
              }
            } else {
              navigation.navigate(Routes.Basket, {
                redirectStateKey: route.params?.redirectStateKey,
              });
            }
          });
      }
    }, [barcode, dispatch, navigation, force_photo_upload, userData, route]);

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
        <Camera
          ref={camera}
          style={styles.camera}
          device={device}
          isActive={isActive}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
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

            {/* Frame border */}

            {/* // red rect
            <Rect
              x="18%"
              y="30%"
              height="250"
              width="250"
              strokeWidth="2"
              stroke="red"
            /> */}

            {/* TODO Animate line */}
            {/* <Rect
              x="18%"
              y="48%"
              height="1"
              width="250"
              strokeWidth="1"
              stroke="red"
            /> */}
          </Svg>
        </View>
        {picture && (
          <Image
            style={styles.snapshot}
            source={{
              uri:
                Platform.OS === 'ios'
                  ? picture?.path
                  : `file://${picture?.path}`,
            }}
            resizeMode="contain"
          />
        )}
        <View style={styles.qrCodeTitleContainer}>
          <Text style={styles.qrCodeTitle}>
            {foodFindByQRcode
              ? `Food: ${foodFindByQRcode.food_name}`
              : 'Please scan a barcode'}
          </Text>
        </View>
        {showHelpPopup && (
          <View style={styles.alert}>
            <Text style={styles.alertTitle}>We could use some help</Text>
            <Text style={styles.alertText}>
              {`Hey ${userData.first_name}! ${showHelpPopup[0].brand_name} ${
                showHelpPopup[0].nix_item_name ||
                showHelpPopup[0].food_name ||
                ''
              } exists in our
              database, but we could use some help submitting photos of
              this product's nutrition label so we can make sure our data
              is still up - to - date. Would you mind taking two photos of
              this product for us?`}
            </Text>
            <View style={styles.buttons}>
              <NixButton
                title="No thank you"
                type="gray"
                onPress={() => {
                  setShowHelpPopup(false);
                  navigation.navigate(Routes.Basket, {
                    redirectStateKey: route.params?.redirectStateKey,
                  });
                }}
              />
              <NixButton
                title="Sure, happy to help!"
                type="blue"
                onPress={() => {
                  setShowHelpPopup(false);
                  if (barcode) {
                    navigation.navigate(Routes.PhotoUpload, {
                      barcode,
                      redirectStateKey: route.params?.redirectStateKey,
                    });
                  }
                }}
              />
            </View>
          </View>
        )}
      </View>
    );
  });
