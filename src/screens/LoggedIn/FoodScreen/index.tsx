// utils
import React, {useEffect, useState, useCallback, useLayoutEffect} from 'react';
import moment from 'moment-timezone';
import {
  launchImageLibrary,
  launchCamera,
  PhotoQuality,
  MediaType,
  Asset,
} from 'react-native-image-picker';
import _ from 'lodash';
import {Easing} from 'react-native-reanimated';
import {Platform} from 'react-native';

// helpers
import {defaultOption} from 'helpers/nutrionixLabel';
import {analyticTrackEvent} from 'helpers/analytics.ts';
import {calculateConsumedTimestamp} from 'helpers/foodLogHelpers';

// components
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  TouchableOpacity,
  Share,
  Animated,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import FoodEditItem from 'components/FoodEditItem';
import WhenSection from 'components/WhenSection';
import {NixButton} from 'components/NixButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import FoodLabel from 'components/FoodLabel';
import ChooseModal from 'components/ChooseModal';
// @ts-ignore
import QRCode from 'react-native-qrcode-svg';
import {NavigationHeader} from 'components/NavigationHeader';
import MealListItem from 'components/FoodLog/MealListItem';
import GoBackModal from 'components/GoBackModal';
import NutritionLabel from 'components/NutrionixLabel/NutritionLabel';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';
import useFoodLabel from './useFoodLabel';

// actions
import * as basketActions from 'store/basket/basket.actions';
import {
  deleteFoodFromLog,
  updateFoodFromlog,
  uploadImage,
} from 'store/userLog/userLog.actions';
import {showAgreementPopup} from 'store/base/base.actions';

// helpers
import requestCameraPermission from 'helpers/cameraPermision';

// constants
import {Routes} from 'navigation/Routes';

// types
import {
  NativeStackHeaderProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {FoodProps} from 'store/userLog/userLog.types';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {mealTypes} from 'store/basket/basket.types';

// styles
import {styles} from './FoodScreen.styles';
import {grocery_photo_upload} from 'config/index';

interface FoodScreenProps {
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Food>;
  route: RouteProp<StackNavigatorParamList, Routes.Food>;
}

export const FoodScreen: React.FC<FoodScreenProps> = ({navigation, route}) => {
  const readOnly = route.params.readOnly;
  const agreedToUsePhoto = useSelector(state => state.base.agreedToUsePhoto);
  const [photoVisible, setPhotoVisible] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [showCheck, setShowCheck] = useState<boolean>(false);
  const [showUnsavedPopup, setShowUnsavedPopup] = useState<null | {
    backAction: Readonly<{
      type: string;
      payload?: object | undefined;
      source?: string | undefined;
      target?: string | undefined;
    }>;
  }>(null);
  const userTimezone = useSelector(state => state.auth.userData.timezone);
  const [foodObj, setFoodObj] = useState<FoodProps>(route.params?.foodObj);
  const [showNotes, setShowNotes] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChooseGetPhoto, setShowChooseGetPhoto] = useState(false);
  const [image, setImage] = useState<Asset | null>(null);
  const [showSave, setShowSave] = useState<boolean>(false);
  const [photoError, setPhotoError] = useState('');
  const dispatch = useDispatch();
  const net_carbs =
    foodObj.nf_total_carbohydrate === 0 ||
    (foodObj.nf_total_carbohydrate || 0) - (foodObj.nf_dietary_fiber || 0) <= 0
      ? 0
      : (foodObj.nf_total_carbohydrate || 0) - (foodObj.nf_dietary_fiber || 0);
  const phosphorus = foodObj.nf_p;
  const labelData = useFoodLabel(foodObj);
  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    setFoodObj(route.params?.foodObj);
  }, [route, setFoodObj]);

  useLayoutEffect(() => {
    const getRightIcon = () => {
      return (
        <>
          {!showCheck ? (
            <Animated.View
              style={{
                transform: [{rotate: spin}],
                opacity: showSpinner ? 1 : 0,
              }}>
              <FontAwesome name="spinner" color="#fff" size={25} />
            </Animated.View>
          ) : (
            <FontAwesome name="check" color="#fff" size={25} />
          )}
        </>
      );
    };
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <NavigationHeader
          {...props}
          navigation={navigation}
          headerTitle={readOnly ? 'View Food' : 'Edit Food'}
          headerRight={getRightIcon()}
        />
      ),
    });
  }, [navigation, readOnly, showSpinner, showCheck, spin]);

  const deleteFromLog = () => {
    analyticTrackEvent('deletedFood', foodObj.food_name);
    dispatch(deleteFoodFromLog([{id: foodObj?.id || '-1'}])).then(() => {
      setShowDeleteModal(false);
      navigation.navigate(Routes.Dashboard);
    });
  };

  const addItemToBasket = async () => {
    dispatch(basketActions.addExistFoodToBasket([foodObj]))
      .then(() => {
        dispatch(
          basketActions.mergeBasket(
            route.params?.mealType
              ? {
                  consumed_at: moment().format('YYYY-MM-DD'),
                  meal_type: route.params?.mealType,
                }
              : {
                  consumed_at: moment().format('YYYY-MM-DD'),
                },
          ),
        );
        navigation.replace('Basket');
      })
      .catch(err => console.log(err));
  };

  const onMealTypeChange = (newMealType: mealTypes) => {
    setFoodObj((prev: FoodProps) => {
      const newDate =
        calculateConsumedTimestamp(newMealType, prev.consumed_at) +
        moment.tz(userTimezone).format('Z');
      return {...prev, meal_type: newMealType, consumed_at: newDate};
    });
  };

  const handleNotesChange = (note: string) => {
    setFoodObj((prev: FoodProps) => ({...prev, note: note ? note : null}));
  };

  const onDateChange = (date: string) => {
    setFoodObj((prev: FoodProps) => {
      const newDate =
        calculateConsumedTimestamp(prev.meal_type, date) +
        moment.tz(userTimezone).format('Z');
      return {...prev, consumed_at: newDate};
    });
  };

  const handleChangeFood = useCallback(
    async (food: Partial<FoodProps> | FoodProps) => {
      setFoodObj((prev: FoodProps) => ({
        ...prev,
        ...food,
      }));
    },
    [setFoodObj],
  );

  const lauchImageFromGallery = () => {
    setShowChooseGetPhoto(!showChooseGetPhoto);
    setPhotoError('');
    const options = {
      mediaType: 'photo' as MediaType,
      noData: true,
      maxWidth: grocery_photo_upload.max_photo_width,
      maxHeight: grocery_photo_upload.max_photo_height,
      quality: 0.9 as PhotoQuality,
    };
    setPhotoVisible(true);

    launchImageLibrary(options, response => {
      if (response) {
        if (response.assets?.length) {
          setImage(response.assets[0]);
          console.log('choosen image', response.assets[0]);
        }
      }
    });
  };
  const lauchImageFromCamera = () => {
    setShowChooseGetPhoto(!showChooseGetPhoto);
    setPhotoError('');
    const options = {
      mediaType: 'photo' as MediaType,
      noData: true,
      maxWidth: grocery_photo_upload.max_photo_width,
      maxHeight: grocery_photo_upload.max_photo_height,
      quality: 0.9 as PhotoQuality,
    };
    setPhotoVisible(true);
    requestCameraPermission().then(result => {
      if (result) {
        launchCamera(options, response => {
          if (response) {
            if (response.assets?.length) {
              setImage(response.assets[0]);
              console.log('choosen image', response.assets[0]);
            }
          }
        });
      }
    });
  };

  const handleUploadImage = () => {
    if (image) {
      uploadImage(
        'foods',
        moment(foodObj.consumed_at).format('YYYY-MM-DD'),
        image,
      )
        .then(result => {
          const photoEventName = foodObj.photo?.is_user_uploaded
            ? 'Changed_photo'
            : 'Custom_photo_added';
          analyticTrackEvent(photoEventName, ' ');
          if (result) {
            console.log(result);
            setImage(null);
            handleChangeFood({
              photo: {
                highres: result.full,
                thumb: result.thumb,
                is_user_uploaded: true,
              },
            });
          }
        })
        .catch(err => {
          setPhotoError(err.message);
        });
    }
  };

  const handleSave = async (
    updatedFood: FoodProps,
    backAction?: Readonly<{
      type: string;
      payload?: object | undefined;
      source?: string | undefined;
      target?: string | undefined;
    }>,
  ) => {
    setShowSpinner(true);
    analyticTrackEvent('updatedFood', updatedFood.food_name);
    dispatch(updateFoodFromlog([updatedFood]))
      .then(() => {
        setTimeout(() => setShowSpinner(false), 800);
        setShowCheck(true);
        setTimeout(() => setShowCheck(false), 1500);
        setShowSave(false);
      })
      .then(() => {
        if (backAction) {
          navigation.dispatch(backAction);
        } else {
          navigation.goBack();
        }
      })
      .catch(err => {
        console.log(err);
        setShowSpinner(false);
      });
  };

  useEffect(() => {
    setShowSave(!_.isEqual(foodObj, route.params?.foodObj));
  }, [foodObj, route.params?.foodObj]);

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (!showSave) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        // Prompt the user before leaving the screen
        setShowUnsavedPopup({
          backAction: e.data.action,
        });
      }),
    [navigation, showSave],
  );

  const handleShare = () => {
    const url =
      'https://nutritionix.app.link/q3?ufl=' +
      foodObj.id +
      '&s=' +
      foodObj.share_key;
    Share.share({
      url,
      message:
        'Log ' +
        foodObj.food_name.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) +
        ' on the Nutritionix Track app by tapping this link from your mobile phone: ' +
        `${url}`,
      title: 'Pick an app',
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      {foodObj ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          overScrollMode="never">
          {readOnly ? (
            <MealListItem
              foodObj={foodObj}
              withoutPhotoUploadIcon
              withoutBorder
              withCal
            />
          ) : (
            <FoodEditItem
              key={foodObj.food_name + foodObj.consumed_at}
              foodObj={foodObj}
              itemChangeCallback={handleChangeFood}
              withoutBorder
            />
          )}
          {!readOnly && (
            <WhenSection
              consumed_at={moment(foodObj.consumed_at).format('YYYY-MM-DD')}
              meal_type={foodObj.meal_type}
              onDateChange={onDateChange}
              onMealTypeChange={onMealTypeChange}
            />
          )}
          {(!readOnly || !!foodObj.note) && (
            <TouchableWithoutFeedback
              onPress={() => setShowNotes(!showNotes)}
              style={styles.flex1}>
              <View style={styles.hideContent}>
                <FontAwesome
                  name="sticky-note-o"
                  size={15}
                  style={styles.hideContentIcon}
                />
                <Text>Notes</Text>
                <FontAwesome
                  name={showNotes ? 'chevron-down' : 'chevron-right'}
                  size={15}
                  style={styles.hideContentIconRight}
                />
              </View>
            </TouchableWithoutFeedback>
          )}
          {showNotes && (
            <>
              {readOnly ? (
                <Text>{foodObj.note}</Text>
              ) : (
                <TextInput
                  multiline={true}
                  numberOfLines={5}
                  value={foodObj.note || ''}
                  onChangeText={handleNotesChange}
                  style={styles.textarea}
                />
              )}
            </>
          )}
          <View style={[styles.borderBottom, showNotes && styles.p10]} />
          <View style={styles.relativeContainer}>
            <TouchableWithoutFeedback
              onPress={() => setPhotoVisible(!photoVisible)}>
              <View style={styles.photoBtnContainer}>
                <View style={styles.photoBtn}>
                  <FontAwesome name="camera" color="#000" size={19} />
                  <Text style={styles.photoBtnText}>Photo</Text>
                  <FontAwesome
                    name={photoVisible ? 'chevron-down' : 'chevron-right'}
                    color="#000"
                    size={15}
                  />
                </View>
                {!readOnly && (
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
                      <Text style={styles.photoBtnText}>
                        {foodObj.photo?.is_user_uploaded
                          ? 'Change Photo'
                          : 'Add Photo'}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
              </View>
            </TouchableWithoutFeedback>
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
                {!image && !foodObj.photo?.highres && !foodObj.photo?.thumb ? (
                  <Text style={styles.noPhoto}>This food has no photo.</Text>
                ) : null}
                <View style={styles.imageContainer}>
                  {!!image && (
                    <>
                      <TouchableOpacity
                        style={styles.uploadBtn}
                        onPress={handleUploadImage}>
                        <Text style={styles.uploadBtnText}>Upload</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => {
                          setImage(null);
                          setPhotoError('');
                        }}>
                        <FontAwesome name="trash" color="#fff" size={15} />
                      </TouchableOpacity>
                    </>
                  )}
                  <Image
                    style={styles.image}
                    source={{
                      uri: image
                        ? image.uri
                        : foodObj.photo?.highres || foodObj.photo?.thumb || '',
                    }}
                    resizeMode="contain"
                  />
                </View>
                {!!photoError && (
                  <View style={styles.imageError}>
                    <Text style={styles.imageErrorText}>{photoError}</Text>
                  </View>
                )}
              </>
            )}
            {!readOnly && (
              <>
                <View
                  style={[styles.borderBottom, photoVisible && styles.p10]}
                />
                <View style={styles.mainButtons}>
                  <View style={[styles.flex1, styles.mr10]}>
                    <NixButton
                      title="Copy"
                      type="outline"
                      onPress={() => addItemToBasket()}
                      iconStyles={{
                        position: 'relative',
                        fontSize: 20,
                        color: '#000',
                      }}
                      iconName="copy"
                      iosIcon
                    />
                  </View>
                  <View style={styles.flex1}>
                    <NixButton
                      title="Delete"
                      type="outline"
                      iconName="trash"
                      iconStyles={{
                        position: 'relative',
                        fontSize: 20,
                        color: '#000',
                      }}
                      onPress={() => setShowDeleteModal(true)}
                      iosIcon
                    />
                  </View>
                </View>
              </>
            )}
          </View>
          <View style={styles.p10}>
            <NutritionLabel option={labelData!} />
          </View>
          {(!!net_carbs ||
            !!phosphorus ||
            !!labelData?.valueCaffeine ||
            !!labelData?.valuePotassium_2018) && (
            <View style={styles.listContainer}>
              {!!net_carbs && (
                <Text style={styles.text}>
                  Net Carbs**: {_.round(net_carbs || 0)} g
                </Text>
              )}
              {!!labelData?.valueVitaminD && (
                <Text style={styles.text}>
                  Vitamin D** : {_.round(labelData?.valueVitaminD || 0)} IU
                </Text>
              )}
              {!!phosphorus && (
                <Text style={styles.text}>
                  Phosphorus** : {_.round(phosphorus || 0)} mg
                </Text>
              )}
              {!!labelData?.valuePotassium_2018 && (
                <Text style={styles.text}>
                  Potassium** : {_.round(labelData?.valuePotassium_2018 || 0)}{' '}
                  mg
                </Text>
              )}
              {!!labelData?.valueCaffeine && (
                <Text style={styles.text}>
                  Caffeine** : {_.round(labelData?.valueCaffeine || 0)} mg
                </Text>
              )}
            </View>
          )}

          {!readOnly && (
            <View style={styles.p10}>
              <View style={styles.shareHeader}>
                <Text style={styles.share}>Share This Meal</Text>
                <TouchableOpacity onPress={handleShare}>
                  <Ionicons name="share-social" color="#000" size={25} />
                </TouchableOpacity>
              </View>
              <Text>
                Have a friend use the Track barcode scanner to scan this code
                and instantly copy this meal to their food log. You can also tap
                the share icon to share this meal via SMS or email.
              </Text>
              <View style={[styles.alignItemsCenter, styles.mt10, styles.mr10]}>
                <QRCode
                  size={270}
                  logo={require('assets/icon.png')}
                  logoSize={5}
                  value={`nutritionix.com/q3?ufl=${foodObj.id}&s=${foodObj.share_key}`}
                />
              </View>
            </View>
          )}
          {readOnly && (
            <View style={styles.backBtnContainer}>
              <NixButton
                title="Go Back"
                type="blue"
                width={100}
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
              />
            </View>
          )}
          {(!!foodObj.nf_p || !!foodObj.caffeine || !!foodObj.nf_potassium) && (
            <Text style={styles.p10}>
              ** Please note that our restaurant and branded grocery food
              database does not have these attributes available, and if your
              food log contains restaurant or branded grocery foods, these
              totals may be incorrect. The data from these attributes is for
              reference purposes only, and should not be used for any chronic
              disease management.
            </Text>
          )}
        </ScrollView>
      ) : null}
      <ChooseModal
        title="Delete Food"
        subtitle="Are you sure you wantto delete this food?"
        modalVisible={showDeleteModal}
        hideModal={() => setShowDeleteModal(false)}
        btns={[
          {
            type: 'gray',
            title: 'Cancel',
            onPress: () => setShowDeleteModal(false),
          },
          {
            type: 'primary',
            title: 'Yes',
            onPress: () => {
              setShowDeleteModal(false);
              deleteFromLog();
            },
          },
        ]}
      />
      {showSave && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          contentContainerStyle={{flex: 1}}
          style={styles.saveBtnContainer}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPressIn={() => {
              setShowSpinner(true);
              Keyboard.dismiss();
            }}
            onPress={() => {
              // need for use actual food object when save
              setTimeout(() => {
                setFoodObj(food => {
                  handleSave(food);
                  return food;
                });
              }, 1000);
            }}
            disabled={showSpinner}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}
      {!!showUnsavedPopup?.backAction && (
        <GoBackModal
          show={!!showUnsavedPopup}
          goBack={() => {
            navigation.dispatch(showUnsavedPopup?.backAction);
          }}
          disabled={showSpinner}
          save={() => {
            handleSave(foodObj, showUnsavedPopup?.backAction);
          }}
        />
      )}
    </SafeAreaView>
  );
};
