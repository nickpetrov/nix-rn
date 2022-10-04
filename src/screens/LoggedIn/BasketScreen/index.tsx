// utils
import React, {useCallback} from 'react';

// helpers
import {multiply} from 'helpers/multiply';
import NixHelpers from 'helpers/nixApiDataUtilites/nixApiDataUtilites';

// components
import BasketButton from 'components/BasketButton';
import {Text, View, SafeAreaView, Button, Switch} from 'react-native';
import {NixButton} from 'components/NixButton';
import Totals from 'components/Totals';
import {FloatingLabelInput} from 'react-native-floating-label-input';
import FoodItem from 'components/FoodItem';
import WhenSection from 'components/WhenSection';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {NavigationHeader} from 'components/NavigationHeader';
import SwipeView from 'components/SwipeView';

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
    totalProtein += food.nf_protein || 0;
    totalFat += food.nf_total_fat || 0;
    totalCarb += food.nf_total_carbohydrate || 0;
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: any) => (
        <NavigationHeader
          {...props}
          headerRight={
            <BasketButton icon="times" onPress={() => navigation.goBack()} />
          }
        />
      ),
    });
  }, [navigation]);

  const logFoods = () => {
    let loggingOptions: Partial<loggingOptionsProps> = {};

    let adjustedFoods = foods;

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

    // delete temp basketId
    adjustedFoods.forEach((item: FoodProps) => {
      delete item.basketId;
    });

    dispatch(userLogActions.addFoodToLog(adjustedFoods, loggingOptions)).then(
      () => {
        dispatch(basketActions.reset());
        navigation.replace(Routes.Dashboard);
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

  const foodsList = (
    <SwipeView
      data={foods}
      buttons={[
        {
          type: 'delete',
          keyId: 'basketId',
          onPress: (id: string) => {
            dispatch(basketActions.deleteFoodFromBasket(id || '-1'));
          },
        },
      ]}
      renderItem={data => (
        <FoodItem
          key={data.item.basketId}
          itemIndex={data.index}
          foodObj={data.item}
          itemChangeCallback={changeFoodAtBasket}
          withInfo
        />
      )}
    />
  );

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAwareScrollView
        style={styles.keyboardView}
        enableOnAndroid={true}
        enableAutomaticScroll={true}>
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
                <View>
                  <Text style={styles.title}>Appear on food log as:</Text>
                  <View style={styles.content}>
                    <Text
                      style={{
                        width: '40%',
                        textAlign: 'center',
                        opacity: isSingleFood ? 0.5 : 1,
                      }}>
                      Multiple foods
                    </Text>
                    <View style={styles.switchContainer}>
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
            <View style={styles.mb20}>
              <NixButton title="Log Foods" onPress={logFoods} type="primary" />
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
            <Text style={styles.emptyText}>Your Basket is Empty.</Text>
            <Button
              onPress={() => navigation.goBack()}
              title="Back to Food Log"
            />
          </View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
