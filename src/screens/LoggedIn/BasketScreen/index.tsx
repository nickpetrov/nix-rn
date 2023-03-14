// utils
import React, {useCallback, useState, useEffect, useLayoutEffect} from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';
// @ts-ignore
import nutritionixApiDataUtilities from 'nutritionix-api-data-utilities';

// helpers
import {multiply} from 'helpers/multiply';
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
  Keyboard,
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
import TooltipView from 'components/TooltipView';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';
import useStateWithCallback from 'hooks/useStateWithCallback';

// actions
import * as basketActions from 'store/basket/basket.actions';
import * as userLogActions from 'store/userLog/userLog.actions';
import {showAgreementPopup, setAskForReview} from 'store/base/base.actions';
import {setWalkthroughTooltip} from 'store/walkthrough/walkthrough.actions';

// types
import {
  NativeStackHeaderProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
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
import {analyticTrackEvent} from 'helpers/analytics.ts';
import {store} from 'store/index';

interface BasketScreenProps {
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Basket>;
  route: RouteProp<StackNavigatorParamList, Routes.Basket>;
}

export const BasketScreen: React.FC<BasketScreenProps> = ({
  navigation,
  route,
}) => {
  const {
    firstFoodAddedToFoodLog,
    firstFoodAddedToBasket,
    firstMultipleFoodsInBasket,
  } = useSelector(state => state.walkthrough.checkedEvents);
  const helpPopupInfo = route.params?.helpPopup;
  const [helpPopup, setHelpPopup] = useState(false);
  const timezone = useSelector(state => state.auth.userData.timezone);
  const {agreedToUsePhoto, reviewCheck} = useSelector(state => state.base);
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
  const dispatch = useDispatch();
  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarb = 0;

  foods.map((food: FoodProps) => {
    food = {
      ...food,
      ...nutritionixApiDataUtilities.convertFullNutrientsToNfAttributes(
        food?.full_nutrients,
      ),
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
      header: (props: NativeStackHeaderProps) => (
        <NavigationHeader
          {...props}
          navigation={navigation}
          withAutoComplete
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
    if (helpPopupInfo) {
      setHelpPopup(true);
    }
  }, [helpPopupInfo]);

  useEffect(() => {
    if (foods.length > 1) {
      if (!firstFoodAddedToBasket.value) {
        setTimeout(() => {
          dispatch(setWalkthroughTooltip('firstMultipleFoodsInBasket', 0));
        }, 1000);
      } else if (!firstMultipleFoodsInBasket.value) {
        setTimeout(() => {
          dispatch(
            setWalkthroughTooltip('firstMultipleFoodsInBasket', 2, true),
          );
        }, 1000);
      }
    } else if (foods.length > 0) {
      if (!firstFoodAddedToBasket.value) {
        setTimeout(() => {
          dispatch(setWalkthroughTooltip('firstFoodAddedToBasket', 0));
        }, 1000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const basketFoods = store.getState().basket.foods;
    const clonedFoods = _.cloneDeep(basketFoods);
    let adjustedFoods = clonedFoods;

    if (isSingleFood) {
      if (+servings > 1) {
        const mult = 1 / parseFloat(servings);
        adjustedFoods = clonedFoods.map((foodObj: FoodProps) => {
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
      adjustedFoods = clonedFoods.map((foodObj: FoodProps) => {
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
        setLoadingSubmit(false);
        return;
      }
      if (!loggingOptions.serving_qty) {
        setErrorMessage('Please enter a valid serving size');
        setLoadingSubmit(false);
        return;
      }
      if (!loggingOptions.consumed_at) {
        setErrorMessage('Please enter date of consumption');
        setLoadingSubmit(false);
        return;
      } else if (!loggingOptions.meal_type) {
        loggingOptions.meal_type = guessMealTypeByTime(
          moment(loggingOptions.consumed_at).hours(),
        );
      }
    }

    dispatch(userLogActions.addFoodToLog(adjustedFoods, loggingOptions))
      .then(() => {
        if (customPhoto) {
          analyticTrackEvent('Custom_photo_added', ' ');
        }
        if (isSingleFood) {
          analyticTrackEvent('Recipe_created', 'Created from the basket');
        }
        dispatch(basketActions.reset());
        setLoadingSubmit(false);

        const consumed_at_data = moment
          .utc(loggingOptions.consumed_at)
          .tz(timezone)
          .format('YYYY-MM-DD');

        if (consumed_at_data !== selectedDate) {
          dispatch(userLogActions.changeSelectedDay(consumed_at_data));
        }
        navigation.navigate(Routes.Dashboard, {
          startWalkthroughAfterLog: !firstFoodAddedToFoodLog.value,
        });
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
      })
      .catch(err => {
        setLoadingSubmit(false);
        console.log(err);
      });
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

  const foodsList = useCallback(() => {
    let rowRefs = new Map();
    return (
      <>
        {foods.map((item: FoodProps, index: number) => {
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
                        analyticTrackEvent('swipe_left', 'swipe_left_delete');
                        if (foods.length === 1) {
                          dispatch(basketActions.reset());
                        } else {
                          if (item._hiddenQuery !== undefined) {
                            analyticTrackEvent(
                              'deleted_natural',
                              `${item.food_name};${item._hiddenQuery},Deleted Natural`,
                            );
                          }
                          dispatch(
                            basketActions.deleteFoodFromBasket(
                              item.basketId || '-1',
                            ),
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
                withTooltip={
                  index === 0 &&
                  (!firstFoodAddedToBasket.value ||
                    !firstMultipleFoodsInBasket.value)
                }
                tooltipEventName={
                  foods.length > 1
                    ? 'firstMultipleFoodsInBasket'
                    : 'firstFoodAddedToBasket'
                }
              />
            </Swipeable>
          );
        })}
      </>
    );
  }, [
    foods,
    dispatch,
    changeFoodAtBasket,
    firstFoodAddedToBasket,
    firstMultipleFoodsInBasket,
  ]);

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
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
        {foodsList()}

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
                    <TooltipView
                      eventName="firstMultipleFoodsInBasket"
                      step={2}
                      placement="top"
                      doNotDisplay={
                        foods.length > 3 || route.name !== Routes.Basket
                      }
                      childrenWrapperStyle={{
                        backgroundColor: '#fff',
                      }}>
                      <RadioButton
                        selected={isSingleFood}
                        onPress={() => setIsSingleFood(true)}
                        text="Single Food (Recipe)"
                      />
                    </TooltipView>
                  </View>
                </View>
              ) : null}
              {isSingleFood && foods.length > 1 ? (
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
                              !!foods[0].photo?.highres)
                          ? foods[0].photo?.highres || ''
                          : '',
                      }}
                      resizeMode="cover"
                    />
                  ) : null}
                  {isUploadPhotoLoading && (
                    <View style={styles.uploadPhotoLoading}>
                      <FontAwesome name="spinner" color="#fff" size={16} />
                    </View>
                  )}
                </View>
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
              onPressIn={() => {
                Keyboard.dismiss();
                setLoadingSubmit(true);
              }}
              onPress={() => {
                setTimeout(() => {
                  handleSubmit();
                }, 300);
              }}
              type="primary"
              style={{borderRadius: 0}}
            />
          </View>
        ) : (
          <View>
            <NixButton
              onPress={() => navigation.navigate(Routes.Dashboard)}
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
                from: Routes.Basket,
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
      <ChooseModal
        modalVisible={helpPopup}
        hideModal={() => setHelpPopup(false)}
        title="We could use some help"
        text={helpPopupInfo?.text || ''}
        btns={[
          {
            type: 'gray',
            title: 'No thank you',
            onPress: () => setHelpPopup(false),
          },
          {
            type: 'primary',
            title: 'Sure, happy to help!',
            style: {
              height: 50,
            },
            onPress: () => {
              setHelpPopup(false);
              if (helpPopupInfo?.barcode) {
                navigation.navigate(Routes.PhotoUpload, {
                  barcode: helpPopupInfo?.barcode,
                });
              }
            },
          },
        ]}
      />
    </SafeAreaView>
  );
};
