// utils
import React, {useState, useEffect, useLayoutEffect} from 'react';
import _ from 'lodash';

// hooks
import {useDispatch} from 'hooks/useRedux';

// components
import {View, Text, TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {NixButton} from 'components/NixButton';
import {NavigationHeader} from 'components/NavigationHeader';
import {NixInput} from 'components/NixInput';
import ShakeView from 'components/ShakeView';

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
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
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
      header: (props: any) => (
        <NavigationHeader
          {...props}
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

  return (
    <>
      {showPreloader && (
        <View style={styles.preloader}>
          <Text style={styles.preloaderText}>Loading. Please wait.</Text>
        </View>
      )}
      <KeyboardAwareScrollView
        style={styles.root}
        enableOnAndroid={true}
        enableAutomaticScroll={true}>
        <NixInput
          label="Food Name"
          required
          style={styles.input}
          value={(foodObj.food_name || '') + ''}
          onChangeText={value => updateTextField('food_name', value)}
          placeholder="Food Name"
        />
        <NixInput
          label="Serving Info"
          required
          style={styles.input}
          value={(foodObj.serving_qty || '') + ''}
          onChangeText={value => updateTextField('serving_qty', value)}
          keyboardType="numeric"
          placeholder="Quantity"
        />
        <NixInput
          label=""
          style={styles.input}
          value={foodObj.serving_unit || 'Serving'}
          onChangeText={value => updateTextField('serving_unit', value)}
          placeholder="Serving Unit"
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
        />
        <NixInput
          label="Fat"
          style={styles.input}
          value={(foodObj.nf_total_fat || '') + ''}
          unit="g"
          onChangeText={value => updateCustomField('nf_total_fat', value)}
          keyboardType="numeric"
          placeholder="0"
        />
        <NixInput
          label="Saturated Fat"
          style={styles.input}
          value={(foodObj.nf_saturated_fat || '') + ''}
          unit=""
          onChangeText={value => updateCustomField('nf_saturated_fat', value)}
          keyboardType="numeric"
          placeholder="0"
        />
        <NixInput
          label="Cholesterol"
          style={styles.input}
          value={(foodObj.nf_cholesterol || '') + ''}
          unit="mg"
          onChangeText={value => updateCustomField('nf_cholesterol', value)}
          keyboardType="numeric"
          placeholder="0"
        />
        <NixInput
          label="Sodium"
          style={styles.input}
          value={(foodObj.nf_sodium || '') + ''}
          unit="mg"
          onChangeText={value => updateCustomField('nf_sodium', value)}
          keyboardType="numeric"
          placeholder="0"
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
        />
        <NixInput
          label="Dietary Fiber"
          style={styles.input}
          value={(foodObj.nf_dietary_fiber || '') + ''}
          unit="g"
          onChangeText={value => updateCustomField('nf_dietary_fiber', value)}
          keyboardType="numeric"
          placeholder="0"
        />
        <NixInput
          label="Sugars"
          style={styles.input}
          value={(foodObj.nf_sugars || '') + ''}
          unit="g"
          onChangeText={value => updateCustomField('nf_sugars', value)}
          keyboardType="numeric"
          placeholder="0"
        />
        <NixInput
          label="Protein"
          style={styles.input}
          value={(foodObj.nf_protein || '') + ''}
          unit="g"
          onChangeText={value => updateCustomField('nf_protein', value)}
          keyboardType="numeric"
          placeholder="0"
        />
        <NixInput
          label="Vitamin A"
          style={styles.input}
          value={(foodObj.nf_vitamin_a_dv || '') + ''}
          unit="%dv"
          onChangeText={value => updateCustomField('nf_vitamin_a_dv', value)}
          keyboardType="numeric"
          placeholder="0"
        />
        <NixInput
          label="Vitamin C"
          style={styles.input}
          value={(foodObj.nf_vitamin_c_dv || '') + ''}
          unit="%dv"
          onChangeText={value => updateCustomField('nf_vitamin_c_dv', value)}
          keyboardType="numeric"
          placeholder="0"
        />
        <NixInput
          label="Vitamin D"
          style={styles.input}
          value={(foodObj.nf_vitamin_d_dv || '') + ''}
          unit="%dv"
          onChangeText={value => updateCustomField('nf_vitamin_d_dv', value)}
          keyboardType="numeric"
          placeholder="0"
        />
        <NixInput
          label="Calcium"
          style={styles.input}
          value={(foodObj.nf_calcium_dv || '') + ''}
          unit="%dv"
          onChangeText={value => updateCustomField('nf_calcium_dv', value)}
          keyboardType="numeric"
          placeholder="0"
        />
        <NixInput
          label="Iron"
          style={styles.input}
          value={(foodObj.nf_iron_dv || '') + ''}
          unit="%dv"
          onChangeText={value => updateCustomField('nf_iron_dv', value)}
          keyboardType="numeric"
          placeholder="0"
        />
        <NixInput
          label="Phosphorus"
          style={styles.input}
          value={(foodObj.nf_p || '') + ''}
          unit="mg"
          onChangeText={value => updateCustomField('nf_p', value)}
          keyboardType="numeric"
          placeholder="0"
        />
        <NixInput
          label="Potassium"
          style={styles.input}
          value={(foodObj.nf_potassium || '') + ''}
          unit="mg"
          onChangeText={value => updateCustomField('nf_potassium', value)}
          keyboardType="numeric"
          placeholder="0"
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
    </>
  );
};
