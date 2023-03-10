// utils
import React, {useState, useEffect} from 'react';
// @ts-ignore
import nutritionixApiDataUtilities from 'nutritionix-api-data-utilities';

// hooks
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'hooks/useRedux';

// components
import {TouchableWithoutFeedback, View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BlinkView from 'components/BlinkView';
import {CountUp} from 'use-count-up';

// types
import {FoodProps, NutrientProps} from 'store/userLog/userLog.types';

// helpres
// import NixHelpers from 'helpers/nixApiDataUtilites/nixApiDataUtilites';

// styles
import {styles} from './MealBuilder.styles';

// constants
import {Routes} from 'navigation/Routes';

const MealBuilder = () => {
  const navigation = useNavigation<any>();
  const basketFoods = useSelector(state => state.basket.foods);
  const [foodQty, setFoodQty] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);
  let totalCalories = 0;
  basketFoods.map((food: FoodProps) => {
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
  });

  useEffect(() => {
    setFoodQty(prev => {
      if (prev !== basketFoods.length) {
        setAnimated(true);
        return basketFoods.length;
      } else {
        return prev;
      }
    });
  }, [basketFoods.length]);

  return (
    <>
      {!!basketFoods.length && (
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate(Routes.Basket)}>
          <View>
            <BlinkView
              animated={animated}
              endCallback={() => setAnimated(false)}
              iterations={basketFoods.length === 1 ? 2 : undefined}
              duration={basketFoods.length === 1 ? 250 : 400}>
              <View style={styles.mealBuilder}>
                <Text style={styles.mealBuilderTilte}>
                  Review{' '}
                  <Text style={styles.mealBuilderQty}>
                    {basketFoods.length}
                  </Text>{' '}
                  Foods
                </Text>
                <View style={styles.mealBuilderRight}>
                  <Text style={styles.mealBuilderQty}>
                    <CountUp
                      isCounting
                      end={+totalCalories?.toFixed(0)}
                      duration={2}
                    />
                    <Text style={styles.mealBuilderCal}>cal</Text>
                  </Text>
                  <Ionicons name="chevron-forward" color="#fff" size={30} />
                </View>
              </View>
            </BlinkView>
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};

export default MealBuilder;
