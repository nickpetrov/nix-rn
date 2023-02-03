// utils
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';
import _ from 'lodash';

// hooks
import {useDispatch} from 'hooks/useRedux';

// components
import {View, Text, TouchableOpacity, TextInput, Keyboard} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {NixButton} from 'components/NixButton';
import {NavigationHeader} from 'components/NavigationHeader';
import {NixInput} from 'components/NixInput';
import ShakeView from 'components/ShakeView';
import LoadIndicator from 'components/LoadIndicator';

// actions
import {
  getCustomFoodById,
  updateOrCreateCustomFood,
} from 'store/customFoods/customFoods.actions';
import {setInfoMessage} from 'store/base/base.actions';
import {addExistFoodToBasket, mergeBasket} from 'store/basket/basket.actions';

// constants
import {Routes} from 'navigation/Routes';

// helpres
import {RouteProp} from '@react-navigation/native';
import nixApiDataUtilites from 'helpers/nixApiDataUtilites/nixApiDataUtilites';
import {
  NativeStackHeaderProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {UpdateCustomFoodProps} from 'store/customFoods/customFoods.types';

// styles
import {styles} from './CustomFoodEditScreen.styles';
import {FoodProps} from 'store/userLog/userLog.types';

interface CustomFoodEditScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.CustomFoodEdit
  >;
  route: RouteProp<StackNavigatorParamList, Routes.CustomFoodEdit>;
}

export const CustomFoodEditScreen: React.FC<CustomFoodEditScreenProps> = ({
  navigation,
  route,
}) => {
  const scrollRef = useRef<Element>();
  const inputRefs = useRef<{[key: string]: TextInput | null}>({});
  const [invalid, setInvalid] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [isProcessingFood, setIsProcessingFood] = useState(false);
  const logAfterSubmit = route.params?.logAfterSubmit;
  const dispatch = useDispatch();
  const [foodObj, setFoodObj] = useState<UpdateCustomFoodProps>({
    food_name: '',
    nf_vitamin_a_dv: null,
    nf_vitamin_c_dv: null,
    nf_vitamin_d_dv: null,
    nf_calcium_dv: null,
    nf_iron_dv: null,
    nf_calories: null,
    nf_cholesterol: null,
    nf_dietary_fiber: null,
    nf_p: null,
    nf_potassium: null,
    nf_protein: null,
    nf_saturated_fat: null,
    nf_sodium: null,
    nf_sugars: null,
    nf_total_carbohydrate: null,
    nf_total_fat: null,
    serving_qty: 1,
    serving_unit: 'Serving',
    source: 9,
    source_key: null,
    full_nutrients: [],
  });

  useEffect(() => {
    if (route.params?.food) {
      setShowPreloader(true);
      dispatch(getCustomFoodById(route.params?.food.id))
        .then((resp: FoodProps) => {
          setFoodObj(prevFood => {
            return {
              ...prevFood,
              ...resp,
              ...nixApiDataUtilites.convertFullNutrientsToNfAttributes(
                resp?.full_nutrients || [],
              ),
            };
          });
          setShowPreloader(false);
        })
        .catch(err => {
          console.log(err);
          setShowPreloader(false);
        });
    }
  }, [route.params?.food, dispatch]);

  useEffect(() => {
    if (invalid) {
      setTimeout(() => {
        setInvalid(false);
      }, 500);
    }
  }, [invalid]);

  const invalidForm = () => {
    let invalidF = false;

    if (
      !foodObj.food_name ||
      !foodObj.nf_calories ||
      +foodObj.nf_calories < 0 ||
      !foodObj.serving_qty ||
      !foodObj.serving_unit
    ) {
      invalidF = true;
    }

    return invalidF;
  };

  const logFood = () => {
    let foodToLog = _.omitBy(foodObj, function (normalizedCustomFood, e) {
      return '_dv' === e.substr(-3);
    }) as Partial<FoodProps>;
    foodToLog.full_nutrients =
      nixApiDataUtilites.buildFullNutrientsArray(foodToLog);
    const nf = nixApiDataUtilites.convertFullNutrientsToNfAttributes(
      foodToLog.full_nutrients,
    );
    _.extend(foodToLog, nf);
    foodToLog = nixApiDataUtilites.convertV1ItemToTrackFood(foodToLog);

    dispatch(addExistFoodToBasket([foodToLog])).then(() => {
      if (route.params?.mealType) {
        dispatch(
          mergeBasket({
            meal_type: route.params?.mealType,
          }),
        );
      }
      navigation.navigate(Routes.Basket);
    });
  };

  const saveCustomFood = (log?: boolean) => {
    Keyboard.dismiss();
    if (invalidForm()) {
      setInvalid(true);
      return;
    }
    setIsProcessingFood(true);
    const clonedFood = _.omitBy(foodObj, function (normalizedCustomFood, e) {
      return '_dv' === e.substr(-3);
    }) as UpdateCustomFoodProps;
    clonedFood.full_nutrients =
      nixApiDataUtilites.buildFullNutrientsArray(foodObj);

    delete clonedFood.source;
    delete clonedFood.source_key;

    dispatch(updateOrCreateCustomFood(clonedFood))
      .then(result => {
        if (result && result.food_name) {
          if (logAfterSubmit || log) {
            logFood();
          } else {
            navigation.navigate(Routes.CustomFoods, {
              showSavedFoodMessage: true,
            });
          }
        }
        setIsProcessingFood(false);
      })
      .catch(err => {
        setIsProcessingFood(false);
        if (err.status === 409) {
          dispatch(
            setInfoMessage({
              title: 'Custom Food with that name already exists',
              text: 'Please Enter New Custom Food Name',
            }),
          );
        } else {
          throw err;
        }
      });
  };

  let updateCustomField = (
    fieldName: keyof UpdateCustomFoodProps,
    newValue: string,
  ) => {
    setFoodObj(prev => {
      const clonedFoodObj = {...prev};
      clonedFoodObj[fieldName] = newValue as never;
      return clonedFoodObj;
    });
  };

  let updateTextField = (
    fieldName: keyof UpdateCustomFoodProps,
    newValue: string,
  ) => {
    setFoodObj(prev => {
      const clonedFoodObj = {...prev};
      clonedFoodObj[fieldName] = newValue as never;
      return clonedFoodObj;
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <NavigationHeader
          {...props}
          navigation={navigation}
          headerTitle={
            route.params?.food ? 'Edit Custom Food' : 'Create Custom Food'
          }
          headerRight={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.headerBtn}>Cancel</Text>
            </TouchableOpacity>
          }
        />
      ),
    });
  }, [navigation, route]);

  const scrollToInput = useCallback((view: TextInput | null) => {
    if (view && scrollRef.current) {
      view.measureLayout(
        // @ts-ignores
        scrollRef.current,
        (left: number, top: number) => {
          // @ts-ignore
          scrollRef.current?.scrollTo({y: top, animated: true});
        },
        () => {
          console.log('fail scroll');
        },
      );
    }
  }, []);

  return (
    <>
      {showPreloader && (
        <View style={styles.preloader}>
          <Text style={styles.preloaderText}>Loading. Please wait.</Text>
        </View>
      )}
      <KeyboardAwareScrollView
        innerRef={ref => {
          scrollRef.current = ref;
        }}
        style={styles.root}
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        scrollEnabled={true}>
        <NixInput
          label="Food Name"
          required
          style={styles.input}
          value={(foodObj.food_name || '') + ''}
          onChangeText={value => updateTextField('food_name', value)}
          placeholder="Food Name"
          returnKeyType="next"
          ref={ref => (inputRefs.current.food_name = ref)}
          onSubmitEditing={() => {
            const nextRef = inputRefs.current.serving_qty;
            if (nextRef) {
              nextRef?.focus();
            }
          }}
          blurOnSubmit={false}
          onFocus={() => {
            scrollToInput(inputRefs.current.food_name);
          }}
        />
        <NixInput
          label="Serving Info"
          required
          style={styles.input}
          value={(foodObj.serving_qty || '') + ''}
          onChangeText={value => updateTextField('serving_qty', value)}
          keyboardType="numeric"
          placeholder="Quantity"
          returnKeyType="next"
          ref={ref => (inputRefs.current.serving_qty = ref)}
          onSubmitEditing={() => {
            const nextRef = inputRefs.current.serving_unit;
            if (nextRef) {
              nextRef?.focus();
            }
          }}
          blurOnSubmit={false}
          onFocus={() => {
            scrollToInput(inputRefs.current.serving_qty);
          }}
        />
        <NixInput
          label=""
          style={styles.input}
          value={foodObj.serving_unit || ''}
          onChangeText={value => updateTextField('serving_unit', value)}
          placeholder="Serving Unit"
          returnKeyType="next"
          ref={ref => (inputRefs.current.serving_unit = ref)}
          onSubmitEditing={() => {
            const nextRef = inputRefs.current.nf_calories;
            if (nextRef) {
              nextRef?.focus();
            }
          }}
          blurOnSubmit={false}
          onFocus={() => {
            scrollToInput(inputRefs.current.serving_unit);
          }}
        />
        <NixInput
          label="Calories"
          required
          style={styles.input}
          value={(foodObj.nf_calories || '') + ''}
          unit="kcal"
          onChangeText={value => updateCustomField('nf_calories', value)}
          keyboardType="numeric"
          placeholder="0"
          returnKeyType="next"
          ref={ref => (inputRefs.current.nf_calories = ref)}
          onSubmitEditing={() => {
            const nextRef = inputRefs.current.nf_total_fat;
            if (nextRef) {
              nextRef?.focus();
            }
          }}
          blurOnSubmit={false}
          onFocus={() => {
            scrollToInput(inputRefs.current.nf_calories);
          }}
        />
        <NixInput
          label="Fat"
          style={styles.input}
          value={(foodObj.nf_total_fat || '') + ''}
          unit="g"
          onChangeText={value => updateCustomField('nf_total_fat', value)}
          keyboardType="numeric"
          placeholder="0"
          returnKeyType="next"
          ref={ref => (inputRefs.current.nf_total_fat = ref)}
          onSubmitEditing={() => {
            const nextRef = inputRefs.current.nf_saturated_fat;
            if (nextRef) {
              nextRef?.focus();
            }
          }}
          blurOnSubmit={false}
          onFocus={() => {
            scrollToInput(inputRefs.current.nf_total_fat);
          }}
        />
        <NixInput
          label="Saturated Fat"
          style={styles.input}
          value={(foodObj.nf_saturated_fat || '') + ''}
          unit=""
          onChangeText={value => updateCustomField('nf_saturated_fat', value)}
          keyboardType="numeric"
          placeholder="0"
          returnKeyType="next"
          ref={ref => (inputRefs.current.nf_saturated_fat = ref)}
          onSubmitEditing={() => {
            const nextRef = inputRefs.current.nf_cholesterol;
            if (nextRef) {
              nextRef?.focus();
            }
          }}
          blurOnSubmit={false}
          onFocus={() => {
            scrollToInput(inputRefs.current.nf_saturated_fat);
          }}
        />
        <NixInput
          label="Cholesterol"
          style={styles.input}
          value={(foodObj.nf_cholesterol || '') + ''}
          unit="mg"
          onChangeText={value => updateCustomField('nf_cholesterol', value)}
          keyboardType="numeric"
          placeholder="0"
          returnKeyType="next"
          ref={ref => (inputRefs.current.nf_cholesterol = ref)}
          onSubmitEditing={() => {
            const nextRef = inputRefs.current.nf_sodium;
            if (nextRef) {
              nextRef?.focus();
            }
          }}
          blurOnSubmit={false}
          onFocus={() => {
            scrollToInput(inputRefs.current.nf_cholesterol);
          }}
        />
        <NixInput
          label="Sodium"
          style={styles.input}
          value={(foodObj.nf_sodium || '') + ''}
          unit="mg"
          onChangeText={value => updateCustomField('nf_sodium', value)}
          keyboardType="numeric"
          placeholder="0"
          returnKeyType="next"
          ref={ref => (inputRefs.current.nf_sodium = ref)}
          onSubmitEditing={() => {
            const nextRef = inputRefs.current.nf_total_carbohydrate;
            if (nextRef) {
              nextRef?.focus();
            }
          }}
          blurOnSubmit={false}
          onFocus={() => {
            scrollToInput(inputRefs.current.nf_sodium);
          }}
        />
        <NixInput
          label="Total Carbohydrate"
          style={styles.input}
          value={(foodObj.nf_total_carbohydrate || '') + ''}
          unit="g"
          onChangeText={value =>
            updateCustomField('nf_total_carbohydrate', value)
          }
          keyboardType="numeric"
          placeholder="0"
          returnKeyType="next"
          ref={ref => (inputRefs.current.nf_total_carbohydrate = ref)}
          onSubmitEditing={() => {
            const nextRef = inputRefs.current.nf_dietary_fiber;
            if (nextRef) {
              nextRef?.focus();
            }
          }}
          blurOnSubmit={false}
          onFocus={() => {
            scrollToInput(inputRefs.current.nf_total_carbohydrate);
          }}
        />
        <NixInput
          label="Dietary Fiber"
          style={styles.input}
          value={(foodObj.nf_dietary_fiber || '') + ''}
          unit="g"
          onChangeText={value => updateCustomField('nf_dietary_fiber', value)}
          keyboardType="numeric"
          placeholder="0"
          returnKeyType="next"
          ref={ref => (inputRefs.current.nf_dietary_fiber = ref)}
          onSubmitEditing={() => {
            const nextRef = inputRefs.current.nf_sugars;
            if (nextRef) {
              nextRef?.focus();
            }
          }}
          blurOnSubmit={false}
          onFocus={() => {
            scrollToInput(inputRefs.current.nf_dietary_fiber);
          }}
        />
        <NixInput
          label="Sugars"
          style={styles.input}
          value={(foodObj.nf_sugars || '') + ''}
          unit="g"
          onChangeText={value => updateCustomField('nf_sugars', value)}
          keyboardType="numeric"
          placeholder="0"
          returnKeyType="next"
          ref={ref => (inputRefs.current.nf_sugars = ref)}
          onSubmitEditing={() => {
            const nextRef = inputRefs.current.nf_protein;
            if (nextRef) {
              nextRef?.focus();
            }
          }}
          blurOnSubmit={false}
          onFocus={() => {
            scrollToInput(inputRefs.current.nf_sugars);
          }}
        />
        <NixInput
          label="Protein"
          style={styles.input}
          value={(foodObj.nf_protein || '') + ''}
          unit="g"
          onChangeText={value => updateCustomField('nf_protein', value)}
          keyboardType="numeric"
          placeholder="0"
          returnKeyType="next"
          ref={ref => (inputRefs.current.nf_protein = ref)}
          onSubmitEditing={() => {
            const nextRef = inputRefs.current.nf_vitamin_a_dv;
            if (nextRef) {
              nextRef?.focus();
            }
          }}
          blurOnSubmit={false}
          onFocus={() => {
            scrollToInput(inputRefs.current.nf_protein);
          }}
        />
        <NixInput
          label="Vitamin A"
          style={styles.input}
          value={(foodObj.nf_vitamin_a_dv || '') + ''}
          unit="%dv"
          onChangeText={value => updateCustomField('nf_vitamin_a_dv', value)}
          keyboardType="numeric"
          placeholder="0"
          returnKeyType="next"
          ref={ref => (inputRefs.current.nf_vitamin_a_dv = ref)}
          onSubmitEditing={() => {
            const nextRef = inputRefs.current.nf_vitamin_c_dv;
            if (nextRef) {
              nextRef?.focus();
            }
          }}
          blurOnSubmit={false}
          onFocus={() => {
            scrollToInput(inputRefs.current.nf_vitamin_a_dv);
          }}
        />
        <NixInput
          label="Vitamin C"
          style={styles.input}
          value={(foodObj.nf_vitamin_c_dv || '') + ''}
          unit="%dv"
          onChangeText={value => updateCustomField('nf_vitamin_c_dv', value)}
          keyboardType="numeric"
          placeholder="0"
          returnKeyType="next"
          ref={ref => (inputRefs.current.nf_vitamin_c_dv = ref)}
          onSubmitEditing={() => {
            const nextRef = inputRefs.current.nf_vitamin_d_dv;
            if (nextRef) {
              nextRef?.focus();
            }
          }}
          blurOnSubmit={false}
          onFocus={() => {
            scrollToInput(inputRefs.current.nf_vitamin_c_dv);
          }}
        />
        <NixInput
          label="Vitamin D"
          style={styles.input}
          value={(foodObj.nf_vitamin_d_dv || '') + ''}
          unit="%dv"
          onChangeText={value => updateCustomField('nf_vitamin_d_dv', value)}
          keyboardType="numeric"
          placeholder="0"
          returnKeyType="next"
          ref={ref => (inputRefs.current.nf_vitamin_d_dv = ref)}
          onSubmitEditing={() => {
            const nextRef = inputRefs.current.nf_calcium_dv;
            if (nextRef) {
              nextRef?.focus();
            }
          }}
          blurOnSubmit={false}
          onFocus={() => {
            scrollToInput(inputRefs.current.nf_vitamin_d_dv);
          }}
        />
        <NixInput
          label="Calcium"
          style={styles.input}
          value={(foodObj.nf_calcium_dv || '') + ''}
          unit="%dv"
          onChangeText={value => updateCustomField('nf_calcium_dv', value)}
          keyboardType="numeric"
          placeholder="0"
          returnKeyType="next"
          ref={ref => (inputRefs.current.nf_calcium_dv = ref)}
          onSubmitEditing={() => {
            const nextRef = inputRefs.current.nf_iron_dv;
            if (nextRef) {
              nextRef?.focus();
            }
          }}
          blurOnSubmit={false}
          onFocus={() => {
            scrollToInput(inputRefs.current.nf_calcium_dv);
          }}
        />
        <NixInput
          label="Iron"
          style={styles.input}
          value={(foodObj.nf_iron_dv || '') + ''}
          unit="%dv"
          onChangeText={value => updateCustomField('nf_iron_dv', value)}
          keyboardType="numeric"
          placeholder="0"
          returnKeyType="next"
          ref={ref => (inputRefs.current.nf_iron_dv = ref)}
          onSubmitEditing={() => {
            const nextRef = inputRefs.current.nf_p;
            if (nextRef) {
              nextRef?.focus();
            }
          }}
          blurOnSubmit={false}
          onFocus={() => {
            scrollToInput(inputRefs.current.nf_iron_dv);
          }}
        />
        <NixInput
          label="Phosphorus"
          style={styles.input}
          value={(foodObj.nf_p || '') + ''}
          unit="mg"
          onChangeText={value => updateCustomField('nf_p', value)}
          keyboardType="numeric"
          placeholder="0"
          returnKeyType="next"
          ref={ref => (inputRefs.current.nf_p = ref)}
          onSubmitEditing={() => {
            const nextRef = inputRefs.current.nf_potassium;
            if (nextRef) {
              nextRef?.focus();
            }
          }}
          blurOnSubmit={false}
          onFocus={() => {
            scrollToInput(inputRefs.current.nf_p);
          }}
        />
        <NixInput
          label="Potassium"
          style={styles.input}
          value={(foodObj.nf_potassium || '') + ''}
          unit="mg"
          onChangeText={value => updateCustomField('nf_potassium', value)}
          keyboardType="numeric"
          placeholder="0"
          ref={ref => (inputRefs.current.nf_potassium = ref)}
          onFocus={() => {
            scrollToInput(inputRefs.current.nf_potassium);
          }}
        />

        <View style={styles.footer}>
          <Text style={styles.note}>
            <Text style={styles.red}>*</Text>
            denotes required fields
          </Text>
          <View style={[styles.flex1]}>
            <ShakeView animated={invalid}>
              <NixButton
                title={
                  route.params?.food
                    ? 'Update'
                    : logAfterSubmit
                    ? 'Save and add to Log'
                    : 'Submit'
                }
                type="primary"
                onPress={() => saveCustomFood()}
                disabled={isProcessingFood}
              />
            </ShakeView>
          </View>
          {route.params?.food && (
            <View style={[styles.flex1, styles.mt20]}>
              <NixButton
                title="Log this food"
                type="primary"
                iconName="ios-add-circle-outline"
                iosIcon
                iconStyles={styles.logIcon}
                disabled={isProcessingFood}
                onPress={() => saveCustomFood(true)}
              />
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
      {isProcessingFood && <LoadIndicator withShadow />}
    </>
  );
};
