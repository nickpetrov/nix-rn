// utils
import React, {useCallback, useState, useEffect, useLayoutEffect} from 'react';
import moment from 'moment-timezone';

// helpers
import {multiply} from 'helpers/multiply';
import NixHelpers from 'helpers/nixApiDataUtilites/nixApiDataUtilites';
import {guessMealTypeByTime} from 'helpers/foodLogHelpers';
import requestCameraPermission from 'helpers/cameraPermision';

// components
import BasketButton from 'components/BasketButton';
import {
  Text,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {NixButton} from 'components/NixButton';
import Totals from 'components/Totals';
import FoodEditItem from 'components/FoodEditItem';
import WhenSection from 'components/WhenSection';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {NavigationHeader} from 'components/NavigationHeader';
import {Swipeable} from 'react-native-gesture-handler';
import SwipeHiddenButtons from 'components/SwipeHiddenButtons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import InfoModal from 'components/InfoModal';
import RadioButton from 'components/RadioButton';
import {NixInput} from 'components/NixInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BugReportModal from 'components/BugReportModal';
import ChooseModal from 'components/ChooseModal';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';
import useStateWithCallback from 'hooks/useStateWithCallback';

// actions
import * as basketActions from 'store/basket/basket.actions';
import * as userLogActions from 'store/userLog/userLog.actions';
import {showAgreementPopup, setAskForReview} from 'store/base/base.actions';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  FoodProps,
  loggingOptionsProps,
  NutrientProps,
} from 'store/userLog/userLog.types';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {RouteProp} from '@react-navigation/native';
import {mealTypes} from 'store/basket/basket.types';

// constants
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './BasketScreen.styles';

interface BasketScreenProps {
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Basket>;
  route: RouteProp<StackNavigatorParamList, Routes.Basket>;
}

export const BasketScreen: React.FC<BasketScreenProps> = ({
  navigation,
  route,
}) => {
  const {agreedToUsePhoto, reviewCheck} = useSelector(state => state.base);
  const [scanError, setScanError] = useState(false);
  const [deleteteModal, setDeleteteModal] = useState(false);
  const [isUploadPhotoLoading, setIsUploadPhotoLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showChooseGetPhoto, setShowChooseGetPhoto] = useState(false);
  const [uploadPhoto, setUploadPhoto] = useStateWithCallback<Asset | null>(
    null,
  );
  const [uploadPhotoFailedPopup, setUploadPhotoFailedPopup] = useState(false);
  const [photoVisible, setPhotoVisible] = useState<boolean>(false);
  const [showBugReport, setShowBugReport] = useState<boolean>(false);
  const [showReportNutrion, setShowReportNutrion] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {
    foods,
    isSingleFood,
    servings,
    recipeName,
    consumed_at,
    meal_type,
    recipeBrand,
    customPhoto,
  } = useSelector(state => state.basket);
  const selectedDate = useSelector(state => state.userLog.selectedDate);
  let rowRefs = new Map();
  const dispatch = useDispatch();
  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarb = 0;

  foods.map((food: FoodProps) => {
    food = {
      ...food,
      ...NixHelpers.convertFullNutrientsToNfAttributes(food?.full_nutrients),
    };

    totalCalories +=
      food.nf_calories ||
      food?.full_nutrients?.filter(
        (item: NutrientProps) => item.attr_id === 208,
      )[0].value;
    totalProtein += food.nf_protein || 0;
    totalFat += food.nf_total_fat || 0;
    totalCarb += food.nf_total_carbohydrate || 0;
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: any) => (
        <NavigationHeader
          {...props}
          headerRight={
            <BasketButton
              icon="shopping-basket"
              withCount
              onPress={() => navigation.navigate(Routes.Basket)}
            />
          }
        />
      ),
    });
  }, [navigation, route]);

  useEffect(() => {
    if (route.params?.scanError) {
      setScanError(true);
    }
  }, [route.params?.scanError]);

  useEffect(() => {
    if (uploadPhoto) {
      console.log('uploadPhoto', uploadPhoto);
      setIsUploadPhotoLoading(true);
      userLogActions
        .uploadImage('foods', moment().format('YYYY-MM-DD'), uploadPhoto)
        .then(result => {
          setIsUploadPhotoLoading(false);
          if (result) {
            dispatch(
              basketActions.mergeBasket({
                customPhoto: {
                  full: result.full,
                  thumb: result.thumb,
                  is_user_uploaded: true,
                },
              }),
            );
          }
        })
        .catch(() => {
          setIsUploadPhotoLoading(false);
        });
    }
  }, [uploadPhoto, dispatch]);

  const logFoods = () => {
    setLoadingSubmit(true);
    let loggingOptions: Partial<loggingOptionsProps> = {};

    let adjustedFoods = foods;

    if (isSingleFood) {
      if (+servings > 1) {
        const mult = 1 / parseFloat(servings);
        adjustedFoods = foods.map((foodObj: FoodProps) => {
          foodObj.meal_type = meal_type;
          return multiply(foodObj, mult, foodObj.serving_qty * mult);
        });
      }
      loggingOptions = {
        // "lat": 0,
        // "lng": 0,
        aggregate: recipeName,
        // "aggregate_photo": {},
        serving_qty: parseFloat(servings),
        // "brand_name": "string",
        single: true,
      };
      if (customPhoto) {
        loggingOptions.aggregate_photo = {
          highres: customPhoto.full,
          thumb: customPhoto.thumb,
          is_user_uploaded: !!customPhoto.full || !!customPhoto.thumb,
        };
      }
    }

    if (!isSingleFood && customPhoto) {
      adjustedFoods = foods.map((foodObj: FoodProps) => {
        foodObj.photo = {
          highres: customPhoto.full,
          thumb: customPhoto.thumb,
          is_user_uploaded: !!customPhoto.full || !!customPhoto.thumb,
        };
        return foodObj;
      });
    }

    if (recipeBrand) {
      loggingOptions.brand_name = recipeBrand;
    }

    loggingOptions.meal_type = meal_type;
    loggingOptions.consumed_at = consumed_at || selectedDate;

    // delete temp basketId
    adjustedFoods.forEach((item: FoodProps) => {
      delete item.basketId;
    });

    if (isSingleFood) {
      if (!loggingOptions.aggregate) {
        setErrorMessage('Please enter a food name');
        return;
      }
      if (!loggingOptions.serving_qty) {
        setErrorMessage('Please enter a valid serving size');
        return;
      }
      if (!loggingOptions.consumed_at) {
        setErrorMessage('Please enter date of consumption');
        return;
      } else if (!loggingOptions.meal_type) {
        loggingOptions.meal_type = guessMealTypeByTime(
          moment(loggingOptions.consumed_at).hours(),
        );
      }
    }

    dispatch(userLogActions.addFoodToLog(adjustedFoods, loggingOptions)).then(
      () => {
        dispatch(basketActions.reset());
        setLoadingSubmit(false);
        navigation.navigate(Routes.Dashboard);
        if (
          !(
            !!reviewCheck.rateClicked ||
            (!!reviewCheck.scheduleDate &&
              moment(reviewCheck.scheduleDate, 'DD-MM-YYYY').isAfter(moment()))
          ) &&
          reviewCheck.runCounter > 4
        ) {
          dispatch(setAskForReview(true));
        }
      },
    );
  };

  const handleSubmit = () => {
    if (uploadPhoto && !customPhoto) {
      setIsUploadPhotoLoading(true);
      userLogActions
        .uploadImage('foods', moment().format('YYYY-MM-DD'), uploadPhoto)
        .then(result => {
          setIsUploadPhotoLoading(false);
          if (result) {
            dispatch(
              basketActions.mergeBasket({
                customPhoto: {
                  full: result.full,
                  thumb: result.thumb,
                  is_user_uploaded: true,
                },
              }),
            );
          }
        })
        .then(() => logFoods())
        .catch(() => {
          setUploadPhotoFailedPopup(true);
          setIsUploadPhotoLoading(false);
        });
    } else {
      logFoods();
    }
  };

  const clearBasket = () => {
    setDeleteteModal(true);
  };

  const setIsSingleFood = (value: boolean) => {
    dispatch(basketActions.mergeBasket({isSingleFood: value}));
  };

  const handleSingleFoodNameChange = (newValue: string) => {
    dispatch(basketActions.mergeBasket({recipeName: newValue}));
  };

  const handleSingleFoodServingsChange = (qty: string) => {
    dispatch(basketActions.mergeBasket({servings: qty}));
  };

  const onDateChange = (newDate: string) => {
    dispatch(basketActions.mergeBasket({consumed_at: newDate}));
  };

  const onMealTypeChange = (newMealType: mealTypes) => {
    dispatch(basketActions.mergeBasket({meal_type: newMealType}));
  };

  const changeFoodAtBasket = useCallback(
    (foodObj: FoodProps, index: number) => {
      dispatch(basketActions.updateFoodAtBasket(foodObj, index));
    },
    [dispatch],
  );

  const lauchImageFromGallery = () => {
    setShowChooseGetPhoto(false);
    const options = {
      mediaType: 'photo' as MediaType,
    };

    launchImageLibrary(options, response => {
      if (response) {
        if (response.assets?.length) {
          setUploadPhoto(response.assets[0]);
          console.log('choosen image', response.assets[0]);
          setPhotoVisible(true);
        }
      }
    });
  };
  const lauchImageFromCamera = () => {
    setShowChooseGetPhoto(false);
    const options = {
      mediaType: 'photo' as MediaType,
      noData: true,
    };

    requestCameraPermission().then(result => {
      if (result) {
        launchCamera(options, response => {
          if (response) {
            if (response.assets?.length) {
              setUploadPhoto(response.assets[0]);
              console.log('choosen image', response.assets[0]);
              setPhotoVisible(true);
            }
          }
        });
      }
    });
  };

  const foodsList = foods.map((item: FoodProps, index: number) => {
    return (
      <Swipeable
        key={item.basketId}
        containerStyle={styles.swipeItemContainer}
        renderRightActions={() => (
          <SwipeHiddenButtons
            buttons={[
              {
                type: 'delete',
                onPress: () => {
                  if (foods.length === 1) {
                    dispatch(basketActions.reset());
                  } else {
                    dispatch(
                      basketActions.deleteFoodFromBasket(item.basketId || '-1'),
                    );
                  }
                },
              },
            ]}
          />
        )}
        ref={ref => {
          if (ref && !rowRefs.get(item.basketId)) {
            rowRefs.set(item.basketId, ref);
          }
        }}
        onSwipeableWillOpen={() => {
          [...rowRefs.entries()].forEach(([key, ref]) => {
            if (key !== item.basketId && ref) ref.close();
          });
        }}>
        <FoodEditItem
          key={item.basketId}
          itemIndex={index}
          foodObj={item}
          itemChangeCallback={changeFoodAtBasket}
          withInfo
        />
      </Swipeable>
    );
  });

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAwareScrollView
        style={styles.keyboardView}
        enableOnAndroid={true}
        enableAutomaticScroll={true}>
        {foods.length > 0 && (
          <Text style={styles.swipeNote}>swipe left to delete </Text>
        )}
        {foods.length === 0 && (
          <View style={styles.emptyContainer}>
            <FontAwesome name="arrow-up" color="#aaa" size={16} />
            <Text style={styles.emptyText}>
              Your basket is empty! Please use the search box above to add a
              food to your basket.
            </Text>
          </View>
        )}
        {foodsList}

        {foods.length ? (
          <View style={styles.main}>
            <Totals
              totalCalories={totalCalories}
              protein={totalProtein}
              carbohydrates={totalCarb}
              fat={totalFat}
            />
            <View>
              {foods.length > 1 ? (
                <View style={styles.appearContainer}>
                  <Text style={styles.title}>Appear on food log as:</Text>
                  <View style={styles.content}>
                    <RadioButton
                      selected={!isSingleFood}
                      onPress={() => setIsSingleFood(false)}
                      text="Multiple Foods"
                    />
                    <RadioButton
                      selected={isSingleFood}
                      onPress={() => setIsSingleFood(true)}
                      text="Single Food (Recipe)"
                    />
                  </View>
                </View>
              ) : null}
              {isSingleFood ? (
                <View>
                  <NixInput
                    label="Meal Name"
                    style={styles.input}
                    value={recipeName}
                    onChangeText={(value: string) =>
                      handleSingleFoodNameChange(value)
                    }
                    placeholder="E.g: After workout meal"
                  />
                  <NixInput
                    label="Servings"
                    style={styles.input}
                    value={servings}
                    onChangeText={(value: string) =>
                      handleSingleFoodServingsChange(value)
                    }
                    keyboardType="numeric"
                  />
                </View>
              ) : null}
            </View>
            {errorMessage && (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}
            <View>
              <WhenSection
                consumed_at={consumed_at || selectedDate}
                meal_type={meal_type}
                onDateChange={onDateChange}
                onMealTypeChange={onMealTypeChange}
              />
            </View>
            {foods.length > 0 ? (
              <TouchableWithoutFeedback
                onPress={() => {
                  if (!uploadPhoto && !customPhoto && foods.length <= 1) {
                    setPhotoVisible(!photoVisible);
                  }
                }}>
                <View style={styles.photoBtnContainer}>
                  <View style={styles.photoBtn}>
                    <FontAwesome name="camera" color="#000" size={20} />
                    <Text style={styles.photoBtnText}>Photo</Text>
                    {!uploadPhoto && !customPhoto && !(foods.length > 1) && (
                      <FontAwesome
                        name={photoVisible ? 'chevron-down' : 'chevron-right'}
                        color="#000"
                        size={15}
                      />
                    )}
                  </View>
                  {!uploadPhoto && !customPhoto && Platform.OS === 'android' && (
                    <View style={styles.photoBtnAndroid}>
                      <Text style={styles.photoBtnText}>
                        {uploadPhoto ? 'Change Photo:' : 'Add Photo:'}
                      </Text>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          if (agreedToUsePhoto) {
                            lauchImageFromCamera();
                          } else {
                            dispatch(showAgreementPopup());
                          }
                        }}>
                        <FontAwesome
                          name="camera"
                          color="#000"
                          size={20}
                          style={{paddingHorizontal: 5}}
                        />
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          if (agreedToUsePhoto) {
                            lauchImageFromGallery();
                          } else {
                            dispatch(showAgreementPopup());
                          }
                        }}>
                        <FontAwesome
                          name="image"
                          color="#000"
                          size={20}
                          style={{paddingHorizontal: 5}}
                        />
                      </TouchableWithoutFeedback>
                    </View>
                  )}
                  {!uploadPhoto && !customPhoto && Platform.OS === 'ios' && (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        if (agreedToUsePhoto) {
                          setShowChooseGetPhoto(!showChooseGetPhoto);
                        } else {
                          dispatch(showAgreementPopup());
                        }
                      }}>
                      <View style={styles.photoBtn}>
                        <FontAwesome name="plus" color="#000" size={11} />
                        <Text style={styles.photoBtnText}>Add Photo</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  )}
                </View>
              </TouchableWithoutFeedback>
            ) : null}
            {showChooseGetPhoto && (
              <View style={styles.photoChoose}>
                <TouchableOpacity
                  style={[styles.photoChooseItem, styles.photoChooseItemBorder]}
                  onPress={lauchImageFromGallery}>
                  <View style={styles.photoChooseItemRow}>
                    <Text style={styles.photoChooseItemText}>Choose File</Text>
                    <Ionicons name="folder-outline" color="#000" size={20} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.photoChooseItem}
                  onPress={lauchImageFromCamera}>
                  <View style={styles.photoChooseItemRow}>
                    <Text style={styles.photoChooseItemText}>Take photo</Text>
                    <Ionicons name="camera-outline" color="#000" size={20} />
                  </View>
                </TouchableOpacity>
              </View>
            )}
            {photoVisible && (
              <>
                {!uploadPhoto &&
                !customPhoto &&
                foods.length === 1 &&
                (!foods[0].photo || !foods[0].photo.highres) ? (
                  <Text style={styles.noPhoto}>This food has no photo.</Text>
                ) : null}
                <View style={styles.imageContainer}>
                  {(!!uploadPhoto || !!customPhoto) && (
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => {
                        setUploadPhoto(null);
                        dispatch(
                          basketActions.mergeBasket({customPhoto: null}),
                        );
                      }}>
                      <FontAwesome name="trash" color="#fff" size={16} />
                    </TouchableOpacity>
                  )}
                  {!!uploadPhoto ||
                  !!customPhoto ||
                  (foods.length === 1 &&
                    !!foods[0].photo &&
                    !!foods[0].photo.highres) ? (
                    <Image
                      style={styles.image}
                      source={{
                        uri: uploadPhoto
                          ? uploadPhoto.uri
                          : customPhoto?.full ||
                            customPhoto?.thumb ||
                            (foods.length === 1 &&
                              !!foods[0].photo &&
                              !!foods[0].photo.highres)
                          ? foods[0].photo.highres || ''
                          : '',
                      }}
                      resizeMode="cover"
                    />
                  ) : null}
                </View>
                {isUploadPhotoLoading && (
                  <View style={styles.uploadPhotoLoading}>
                    <FontAwesome name="spinner" color="#fff" size={16} />
                  </View>
                )}
              </>
            )}
            <NixButton
              disabled={loadingSubmit || isUploadPhotoLoading}
              title={
                isSingleFood
                  ? 'Log 1 Serving'
                  : foods.length === 1
                  ? 'Log 1 Food'
                  : `Log ${foods.length} Foods`
              }
              onPress={handleSubmit}
              type="primary"
              style={{borderRadius: 0}}
            />
          </View>
        ) : (
          <View>
            <NixButton
              onPress={() => navigation.goBack()}
              title="Back to Food Log"
              type="primary"
              style={{borderRadius: 0}}
            />
          </View>
        )}
        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => setShowBugReport(true)}>
            <Text style={styles.link}>Report a problem</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowReportNutrion(true)}>
            <Text style={styles.link}>Report nutrition discrepancy</Text>
          </TouchableOpacity>
        </View>
        {foods.length > 0 ? (
          <View style={styles.mb20}>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={clearBasket}>
              <Text style={styles.clearBtn}>Clear Basket</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <InfoModal
          modalVisible={scanError}
          setModalVisible={() => setScanError(false)}
          title="Error"
          text="We scanned an unrecognized QR code, if you are trying to scan a
        food product barcode, please try to avoid scanning the QR code
        near the barcode and try scanning this product again"
        />
      </KeyboardAwareScrollView>
      <BugReportModal
        modalVisible={showBugReport}
        setModalVisible={() => setShowBugReport(false)}
      />
      <InfoModal
        modalVisible={showReportNutrion}
        setModalVisible={() => setShowReportNutrion(false)}
        btn={{
          title: 'Cancel',
          type: 'gray',
        }}
        title="Report Updated Nutrition Labels"
        subtitle="Flag a product that needs to be updated or corrected by scanning the barcode and sending a photo of packaging:">
        <View style={styles.reportNutrionContainer}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.barcodeBtn}
            onPress={() => {
              setShowReportNutrion(false);
              navigation.navigate(Routes.BarcodeScanner, {
                force_photo_upload: true,
                redirectStateKey: route.key,
              });
            }}>
            <FontAwesome name="barcode" color="#fff" size={25} />
          </TouchableOpacity>
        </View>
      </InfoModal>
      <ChooseModal
        modalVisible={uploadPhotoFailedPopup}
        hideModal={() => setUploadPhotoFailedPopup(false)}
        title="Oops, something went wrong"
        subtitle="Image upload failed"
        text="Tap 'Ok' to try again, or 'Cancel' to proceed without image"
        btns={[
          {
            type: 'gray',
            title: 'Cancel',
            onPress: () => {
              setUploadPhotoFailedPopup(false);
              setUploadPhoto(null, () => {
                logFoods();
              });
            },
          },
          {
            type: 'primary',
            title: 'Ok',
            onPress: () => {
              setUploadPhotoFailedPopup(false);
              handleSubmit();
            },
          },
        ]}
      />
      <ChooseModal
        modalVisible={!!deleteteModal}
        hideModal={() => setDeleteteModal(false)}
        title="Clear Foods"
        subtitle="Are you sure you want to clear the meal builder?"
        btns={[
          {
            type: 'gray',
            title: 'Cancel',
            onPress: () => setDeleteteModal(false),
          },
          {
            type: 'primary',
            title: 'Yes',
            onPress: () => {
              setDeleteteModal(false);
              dispatch(basketActions.reset());
            },
          },
        ]}
      />
    </SafeAreaView>
  );
};
