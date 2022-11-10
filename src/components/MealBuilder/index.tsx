// utils
import React from 'react';

// hooks
import {useSelector} from 'hooks/useRedux';

// components
import {TouchableWithoutFeedback, View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// types
import {FoodProps, NutrientProps} from 'store/userLog/userLog.types';

// helpres
import NixHelpers from 'helpers/nixApiDataUtilites/nixApiDataUtilites';
import {styles} from './MealBuilder.styles';
import {Routes} from 'navigation/Routes';
import {useNavigation} from '@react-navigation/native';

const MealBuilder = () => {
  const navigation = useNavigation<any>();
  const basketFoods = useSelector(state => state.basket.foods);
  let totalCalories = 0;
  basketFoods.map((food: FoodProps) => {
    food = {
      ...food,
      ...NixHelpers.convertFullNutrientsToNfAttributes(food?.full_nutrients),
    };

    totalCalories +=
      food.nf_calories ||
      food?.full_nutrients?.filter(
        (item: NutrientProps) => item.attr_id === 208,
      )[0].value;
  });
  return (
    <>
      {!!basketFoods.length && (
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate(Routes.Basket)}>
          <View style={styles.mealBuilder}>
            <Text style={styles.mealBuilderTilte}>
              Review{' '}
              <Text style={styles.mealBuilderQty}>{basketFoods.length}</Text>{' '}
              Foods
            </Text>
            <View style={styles.mealBuilderRight}>
              <Text style={styles.mealBuilderQty}>
                {totalCalories.toFixed(0)}
                <Text style={styles.mealBuilderCal}>cal</Text>
              </Text>
              <Ionicons name="chevron-forward" color="#fff" size={30} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};

export default MealBuilder;
