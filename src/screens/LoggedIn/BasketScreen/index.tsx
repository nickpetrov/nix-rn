// utils
import React, {useCallback} from 'react';

// helpers
import {multiply} from 'helpers/multiply';
import NixHelpers from 'helpers/nixApiDataUtilites/nixApiDataUtilites';

// components
import BasketButton from 'components/BasketButton';
import {Header} from 'components/Header';
import {
  Dimensions,
  Text,
  View,
  SafeAreaView,
  Button,
  Switch,
  ScrollView,
} from 'react-native';
import {NixButton} from 'components/NixButton';
import Totals from 'components/Totals';
import {FloatingLabelInput} from 'react-native-floating-label-input';
import FoodItem from 'components/FoodItem';
import WhenSection from 'components/WhenSection';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import * as basketActions from 'store/basket/basket.actions';
import * as userLogActions from 'store/userLog/userLog.actions';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  FoodProps,
  loggingOptionsProps,
  NutrientProps,
} from 'store/userLog/userLog.types';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// constants
import {Routes} from 'navigation/Routes';
import {Colors} from 'constants/Colors';

// styles
import {styles} from './BasketScreen.styles';

interface BasketScreenProps {
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Basket>;
}

export const BasketScreen: React.FC<BasketScreenProps> = ({navigation}) => {
  const {foods, isSingleFood, servings, recipeName, consumed_at, meal_type} =
    useSelector(state => state.basket);
  const dispatch = useDispatch();
  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarb = 0;

  foods.map((food: FoodProps) => {
    food = {
      ...food,
      ...NixHelpers.convertFullNutrientsToNfAttributes(food.full_nutrients),
    };

    totalCalories +=
      food.nf_calories ||
      food?.full_nutrients?.filter(
        (item: NutrientProps) => item.attr_id === 208,
      )[0].value;
    totalProtein += food.nf_protein;
    totalFat += food.nf_total_fat;
    totalCarb += food.nf_total_carbohydrate;
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: undefined,
      headerTitle: (props: {
        children: string;
        tintColor?: string | undefined;
      }) => (
        <View style={{width: Dimensions.get('window').width - 110}}>
          <Header {...props} navigation={navigation} />
        </View>
      ),
      headerRight: () => (
        <BasketButton icon="times" onPress={() => navigation.goBack()} />
      ),
    });
  }, [navigation]);

  const logFoods = () => {
    let loggingOptions: Partial<loggingOptionsProps> = {};

    let adjustedFoods = foods;
    console.log('adjustedFoods', adjustedFoods);
    if (isSingleFood) {
      if (servings > 1) {
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
    }

    loggingOptions.meal_type = meal_type;
    loggingOptions.consumed_at = consumed_at;
    console.log('adjustedFoods1', adjustedFoods);
    dispatch(userLogActions.addFoodToLog(adjustedFoods, loggingOptions)).then(
      () => {
        dispatch(basketActions.reset());
        navigation.navigate(Routes.Dashboard);
      },
    );
  };

  const clearBasket = () => {
    // TODO - add confirmation popup
    dispatch(basketActions.reset());
  };

  const toggleSingleFood = () => {
    dispatch(basketActions.changeLoggingType(!isSingleFood));
  };

  const handleSingleFoodNameChange = (newValue: string) => {
    dispatch(basketActions.changeRecipeName(newValue));
  };

  const handleSingleFoodServingsChange = (qty: string) => {
    dispatch(basketActions.changeRecipeServings(qty));
  };

  const onDateChange = (newDate: string) => {
    dispatch(basketActions.changeConsumedAt(newDate));
  };

  const onMealTypeChange = (newMealType: number) => {
    dispatch(basketActions.changeMealType(newMealType));
  };

  const changeFoodAtBasket = useCallback(
    (foodObj: FoodProps, index: number) => {
      dispatch(basketActions.updateFoodAtBasket(foodObj, index));
    },
    [dispatch],
  );

  const foodsList = foods.map((food: FoodProps, index: number) => {
    return (
      <FoodItem
        key={food.food_name + food.consumed_at}
        itemIndex={index}
        foodObj={food}
        itemChangeCallback={changeFoodAtBasket}
      />
    );
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <KeyboardAwareScrollView
        style={{flex: 1, width: '100%', height: '100%'}}
        alwaysBounceVertical={false}>
        <ScrollView>
          {foodsList}

          {foods.length ? (
            <View style={{backgroundColor: ''}}>
              <Totals
                totalCalories={totalCalories}
                protein={totalProtein}
                carbohydrates={totalCarb}
                fat={totalFat}
              />
              <View>
                {foods.length > 1 ? (
                  <View>
                    <Text style={{textAlign: 'center', marginVertical: 10}}>
                      Appear on food log as:
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          width: '40%',
                          textAlign: 'center',
                          opacity: isSingleFood ? 0.5 : 1,
                        }}>
                        Multiple foods
                      </Text>
                      <View
                        style={{
                          width: '20%',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Switch
                          trackColor={{true: Colors.Primary}}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={() => toggleSingleFood()}
                          value={isSingleFood}
                          style={{}}
                        />
                      </View>
                      <Text
                        style={{
                          width: '40%',
                          textAlign: 'center',
                          opacity: !isSingleFood ? 0.5 : 1,
                        }}>
                        Single Food(Recipe)
                      </Text>
                    </View>
                  </View>
                ) : null}
                {isSingleFood ? (
                  <View>
                    <FloatingLabelInput
                      label="Meal Name"
                      style={styles.input}
                      value={recipeName}
                      onChangeText={(value: string) =>
                        handleSingleFoodNameChange(value)
                      }
                      autoCapitalize="none"
                    />
                    <FloatingLabelInput
                      label="Servings"
                      style={styles.input}
                      value={servings}
                      onChangeText={(value: string) =>
                        handleSingleFoodServingsChange(value)
                      }
                      autoCapitalize="none"
                      keyboardType="numeric"
                    />
                  </View>
                ) : null}
              </View>
              <View>
                <WhenSection
                  consumed_at={consumed_at}
                  meal_type={meal_type}
                  onDateChange={onDateChange}
                  onMealTypeChange={onMealTypeChange}
                />
              </View>
              <View style={{marginBottom: 20}}>
                <NixButton
                  title="Log Foods"
                  onPress={logFoods}
                  type="primary"
                />
              </View>
              <View>
                <NixButton
                  title="Clear Basket"
                  onPress={clearBasket}
                  type="assertive"
                />
              </View>
            </View>
          ) : (
            <View>
              <Text
                style={{padding: 10, textAlign: 'center', marginBottom: 20}}>
                Your Basket is Empty.
              </Text>
              <Button
                onPress={() => navigation.goBack()}
                title="Back to Food Log"
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
