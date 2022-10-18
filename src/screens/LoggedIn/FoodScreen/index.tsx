// utils
import React, {useEffect, useState, useCallback, useLayoutEffect} from 'react';
import moment from 'moment-timezone';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import _ from 'lodash';
import {Easing} from 'react-native-reanimated';

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
} from 'react-native';
import FoodEditItem from 'components/FoodEditItem';
import WhenSection from 'components/WhenSection';
import {NixButton} from 'components/NixButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import FoodLabel from 'components/FoodLabel';
import DeleteModal from 'components/DeleteModal';
// @ts-ignore
import QRCode from 'react-native-qrcode-svg';
import {NavigationHeader} from 'components/NavigationHeader';
import MealListItem from 'components/FoodLog/MealListItem';
import GoBackModal from 'components/GoBackModal';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import * as basketActions from 'store/basket/basket.actions';
import {
  deleteFoodFromLog,
  updateFoodFromlog,
  uploadImage,
} from 'store/userLog/userLog.actions';
import {showAgreementPopup} from 'store/base/base.actions';

// constants
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {FoodProps} from 'store/userLog/userLog.types';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {mealTypes} from 'store/basket/basket.types';
import {MediaType, Asset} from 'react-native-image-picker/lib/typescript/types';

// styles
import {styles} from './FoodScreen.styles';
import requestCameraPermission from 'helpers/cameraPermision';

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
  const {selectedDate} = useSelector(state => state.userLog);
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
  }, [route]);

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
      header: (props: any) => (
        <NavigationHeader
          {...props}
          headerTitle={readOnly ? 'View Food' : 'Edit Food'}
          headerRight={getRightIcon()}
        />
      ),
    });
  }, [navigation, readOnly, showSpinner, showCheck, spin]);

  const deleteFromLog = () => {
    dispatch(deleteFoodFromLog([{id: foodObj?.id || '-1'}])).then(() => {
      setShowDeleteModal(false);
      navigation.navigate(Routes.Dashboard);
    });
  };

  const addItemToBasket = async () => {
    dispatch(basketActions.addFoodToBasket(foodObj?.food_name || '')).then(
      () => {
        dispatch(
          basketActions.mergeBasket(
            route.params?.mealType
              ? {
                  consumed_at: selectedDate,
                  meal_type: route.params?.mealType,
                }
              : {
                  consumed_at: selectedDate,
                },
          ),
        );
        navigation.replace('Basket');
      },
    );
  };

  const onMealTypeChange = (newMealType: mealTypes) => {
    setFoodObj((prev: FoodProps) => ({...prev, meal_type: newMealType}));
  };

  const handleNotesChange = (note: string) => {
    setFoodObj((prev: FoodProps) => ({...prev, note: note ? note : null}));
  };

  const onDateChange = (date: string) => {
    const newDate =
      moment(date).format('YYYY-MM-DDTHH:mm:ss') + moment.tz().format('Z');
    setFoodObj((prev: FoodProps) => ({...prev, consumed_at: newDate}));
  };

  const handleChangeFood = useCallback(
    (food: Partial<FoodProps> | FoodProps) => {
      setFoodObj((prev: FoodProps) => ({
        ...prev,
        ...food,
      }));
    },
    [],
  );

  const lauchImageFromGallery = () => {
    setShowChooseGetPhoto(!showChooseGetPhoto);
    setPhotoError('');
    const options = {
      mediaType: 'photo' as MediaType,
      noData: true,
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
    uploadImage(
      'foods',
      moment(foodObj.consumed_at).format('YYYY-MM-DD'),
      image,
    ).then(result => {
      if (result.error) {
        setPhotoError(result.error);
      } else {
        console.log(result);
        handleChangeFood({
          photo: {
            highres: result.full,
            thumb: result.thumb,
            is_user_uploaded: true,
          },
        });
      }
    });
  };

  const handleSave = async (
    backAction?: Readonly<{
      type: string;
      payload?: object | undefined;
      source?: string | undefined;
      target?: string | undefined;
    }>,
  ) => {
    setShowSpinner(true);
    dispatch(updateFoodFromlog([foodObj]))
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
    Share.share({
      url:
        'https://nutritionix.app.link/q3?ufl=' +
        foodObj.id +
        '&s=' +
        foodObj.share_key,
      message:
        'Log ' +
        foodObj.food_name.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) +
        ' on the Nutritionix Track app by tapping this link from your mobile phone: ',
      title: 'Pick an app',
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      {foodObj ? (
        <ScrollView>
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
                        {foodObj.photo.is_user_uploaded
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
                {!image && !foodObj.photo.highres && !foodObj.photo.thumb ? (
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
                        : foodObj.photo.highres || foodObj.photo.thumb || '',
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
                      iconStyles={{position: 'relative', fontSize: 20}}
                      iconName="copy"
                      iosIcon
                    />
                  </View>
                  <View style={styles.flex1}>
                    <NixButton
                      title="Delete"
                      type="outline"
                      iconName="trash"
                      iconStyles={{position: 'relative', fontSize: 20}}
                      onPress={() => setShowDeleteModal(true)}
                      iosIcon
                    />
                  </View>
                </View>
              </>
            )}
          </View>
          {/* <View style={styles.p10}>
            <FoodLabel data={foodObj} />
          </View> */}
          {(!!net_carbs ||
            !!foodObj.nf_p ||
            !!foodObj.caffeine ||
            !!foodObj.nf_potassium) && (
            <View style={styles.listContainer}>
              {!!net_carbs && (
                <Text style={styles.text}>
                  Net Carbs**: {(net_carbs || 0).toFixed(1)} g
                </Text>
              )}
              {!!foodObj.vitamin_d && (
                <Text style={styles.text}>
                  Vitamin D** : {(foodObj.vitamin_d || 0).toFixed(1)} IU
                </Text>
              )}
              {!!foodObj.nf_p && (
                <Text style={styles.text}>
                  Phosphorus** : {(foodObj.nf_p || 0).toFixed(1)} mg
                </Text>
              )}
              {!!foodObj.nf_potassium && (
                <Text style={styles.text}>
                  Potassium** : {(foodObj.nf_potassium || 0).toFixed(1)} mg
                </Text>
              )}
              {!!foodObj.caffeine && (
                <Text style={styles.text}>
                  Caffeine** : {(foodObj.caffeine || 0).toFixed(1)} mg
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
      <DeleteModal
        title="Delete Food"
        text="Are you sure you wantto delete this food?"
        modalVisible={showDeleteModal}
        setModalVisible={setShowDeleteModal}
        delete={deleteFromLog}
      />
      {showSave && (
        <View style={styles.saveBtnContainer}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => handleSave()}
            disabled={showSpinner}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
      {!!showUnsavedPopup?.backAction && (
        <GoBackModal
          show={!!showUnsavedPopup}
          goBack={() => {
            navigation.dispatch(showUnsavedPopup?.backAction);
          }}
          disabled={showSpinner}
          save={() => {
            handleSave(showUnsavedPopup?.backAction);
          }}
        />
      )}
    </SafeAreaView>
  );
};
