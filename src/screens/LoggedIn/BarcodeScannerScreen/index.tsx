// utils
import React, {useState, useEffect} from 'react';

// components
import {Text, View} from 'react-native';
import {NixButton} from 'components/NixButton/index';

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
import Scanner from 'components/Scanner';

interface BarcodeScannerScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.BarcodeScanner
  >;
  route: RouteProp<StackNavigatorParamList, Routes.BarcodeScanner>;
}

export const BarcodeScannerScreen: React.FC<BarcodeScannerScreenProps> =
  React.memo(({navigation, route}) => {
    const volunteer = useSelector(
      state => state.base.groceryAgentPreferences.volunteer,
    );
    const userData = useSelector(state => state.auth.userData);
    const force_photo_upload = route.params?.force_photo_upload;
    const [showHelpPopup, setShowHelpPopup] = useState<FoodProps[] | false>(
      false,
    );
    const dispatch = useDispatch();
    const foodFindByQRcode = useSelector(state => state.foods.foodFindByQRcode);
    const [barcode, setBarcode] = useState<string>();

    useEffect(() => {
      if (barcode && barcode.length > 14) {
        if (barcode.includes('nutritionix.com/q1')) {
          dispatch(addExistFoodToBasket([externalLinkV1(barcode)])).then(() =>
            navigation.navigate(Routes.Basket, {
              redirectStateKey: route.params?.redirectStateKey,
            }),
          );
        } else if (barcode.includes('nutritionix.com/q2')) {
          dispatch(addFoodToBasket(externalLinkV2(barcode)))
            .then(() =>
              navigation.navigate(Routes.Basket, {
                redirectStateKey: route.params?.redirectStateKey,
              }),
            )
            .catch(err => console.log(err));
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
            console.log('Exist food');
            // return foods only if foods need to be updated
            if (
              foods &&
              (force_photo_upload ||
                userData.grocery_agent ||
                volunteer ||
                Math.floor(
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
              console.log('New food');
              console.log('userData.grocery_agent', userData.grocery_agent);
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
                  new_product: true,
                });
              }
            } else {
              navigation.navigate(Routes.Basket, {
                redirectStateKey: route.params?.redirectStateKey,
              });
            }
          });

        // add firebase analitics
        // AnalyticsService.trackEvent("foodlog_barcode", barcode);
      }
    }, [
      barcode,
      dispatch,
      navigation,
      force_photo_upload,
      userData,
      route,
      volunteer,
    ]);

    useEffect(() => {
      return () => {
        dispatch(clearSnanedFood());
        setBarcode(undefined);
      };
    }, [dispatch]);

    return (
      <View style={styles.root}>
        <Scanner
          callBack={barcodes => {
            setTimeout(() => setBarcode(barcodes[0].rawValue), 3000);
          }}
          redirectStateKey={route.params?.redirectStateKey}
        />
        {foodFindByQRcode && (
          <View style={styles.qrCodeTitleContainer}>
            <Text style={styles.qrCodeTitle}>
              Food: {foodFindByQRcode.food_name}
            </Text>
          </View>
        )}
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
