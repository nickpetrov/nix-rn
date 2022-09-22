// utils
import React, {useEffect, useState} from 'react';

// components
import {
  View,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  TextInput,
} from 'react-native';
import FoodLabel from 'components/FoodLabel';
import NutritionPieChart, {
  pieChartDataProps,
} from 'components/NutritionPieChart';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NixButton} from 'components/NixButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// actions
import * as userActions from 'store/auth/auth.actions';
import * as logActions from 'store/userLog/userLog.actions';

// helpres
import getAttrValueById from 'helpers/getAttrValueById';

// types
import {RouteProp} from '@react-navigation/native';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {FoodProps, TotalProps} from 'store/userLog/userLog.types';
import {User} from 'store/auth/auth.types';

// constants
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './TotalsScreen.styles';

interface TotalsScreenProps {
  route: RouteProp<StackNavigatorParamList, Routes.Totals>;
}

export const TotalsScreen: React.FC<TotalsScreenProps> = ({route}) => {
  const foods = route.params?.foods;
  const type = route.params?.type;
  const userData = useSelector(state => state.auth.userData);
  const {totals, selectedDate} = useSelector(state => state.userLog);

  const [pieChartData, setPieChartData] = useState<pieChartDataProps>();
  const [showMoreNutrients, setShowMoreNutrients] = useState(false);
  const [dailyKcal, setDailyKcal] = useState(userData.daily_kcal);
  const [dayNote, setDayNote] = useState(totals.length ? totals[0].note : '');

  const dispatch = useDispatch();
  const [foodsArray, setFoodsArray] = useState<Array<FoodProps>>([]);

  useEffect(() => {
    let newFoodsArray: Array<FoodProps> = [];

    if (type?.length) {
      newFoodsArray = foods;
    }
    /*
    need investigation for what it needed
    else {
      foods.map(day => {
        if (!!day.foods && day.foods.length) {
          newFoodsArray = newFoodsArray.concat(day.foods);
        }
      });
    }*/
    setFoodsArray(newFoodsArray);
  }, [foods, type]);

  useEffect(() => {
    if (totals.length) {
      const selectedDayTotals = totals.filter(
        (item: TotalProps) => item.date === selectedDate,
      )[0];
      if (selectedDayTotals) {
        setDailyKcal(selectedDayTotals.daily_kcal_limit);
        setDayNote(selectedDayTotals.notes);
      }
    }
  }, [selectedDate, totals]);

  const [total, setTotal] = useState<Record<string, any>>({
    item_name: 'Total',
    brand_name: 'Nutritionix',
    full_nutrients: [],
    metric_qty: 0,
    calories: 0,
    total_fat: 0,
    nf_saturated_fat: 0,
    nf_cholesterol: 0,
    nf_sodium: 0,
    nf_total_carbohydrate: 0,
    nf_dietary_fiber: 0,
    nf_sugars: 0,
    nf_protein: 0,
    nf_potassium: 0,
    nf_vitamin_a_dv: 0,
    nf_vitamin_c_dv: 0,
    nf_calcium_dv: 0,
    nf_iron_dv: 0,
    nf_p: 0,
    caffeine: 0,
    alcohol: 0,
    vitamin_d: 0,
    vitamin_e: 0,
    vitamin_k: 0,
    thiamine: 0,
    riboflavin: 0,
    niacin: 0,
    pantothenic_acid: 0,
    vitamin_b6: 0,
    vitamin_b12: 0,
    folic_acid: 0,
    folate: 0,
    zinc: 0,
    magnesium: 0,
    net_carbs: 0,
  });

  useEffect(() => {
    setTotal(prev => {
      const newTotal: Record<string, any> = {...prev};

      foodsArray.map(food => {
        newTotal.metric_qty += food.serving_weight_grams;
        newTotal.total_fat += food.nf_total_fat;
        newTotal.nf_saturated_fat += food.nf_saturated_fat;
        newTotal.nf_cholesterol += food.nf_cholesterol;
        newTotal.nf_sodium += food.nf_sodium;
        newTotal.nf_total_carbohydrate += food.nf_total_carbohydrate;
        newTotal.nf_dietary_fiber += food.nf_dietary_fiber;
        newTotal.nf_sugars += food.nf_sugars;
        newTotal.nf_protein += food.nf_protein;
        newTotal.nf_potassium += food.nf_potassium;
        newTotal.nf_p += food.nf_p;
        newTotal.caffeine += getAttrValueById(food.full_nutrients, 262) || 0;
        newTotal.vitamin_d += getAttrValueById(food.full_nutrients, 324) || 0;
        newTotal.vitamin_e += getAttrValueById(food.full_nutrients, 323) || 0;
        newTotal.vitamin_k += getAttrValueById(food.full_nutrients, 430) || 0;
        newTotal.thiamine += getAttrValueById(food.full_nutrients, 404) || 0;
        newTotal.riboflavin += getAttrValueById(food.full_nutrients, 405) || 0;
        newTotal.niacin += getAttrValueById(food.full_nutrients, 406) || 0;
        newTotal.pantothenic_acid +=
          getAttrValueById(food.full_nutrients, 410) || 0;
        newTotal.vitamin_b6 += getAttrValueById(food.full_nutrients, 415) || 0;
        newTotal.vitamin_b12 += getAttrValueById(food.full_nutrients, 418) || 0;
        newTotal.folic_acid += getAttrValueById(food.full_nutrients, 431) || 0;
        newTotal.folate += getAttrValueById(food.full_nutrients, 641705) || 0;
        newTotal.zinc += getAttrValueById(food.full_nutrients, 309) || 0;
        newTotal.magnesium += getAttrValueById(food.full_nutrients, 304) || 0;

        if (
          food.nf_total_carbohydrate !== 0 &&
          food.nf_total_carbohydrate - food.nf_dietary_fiber <= 0
        ) {
          newTotal.net_carbs +=
            food.nf_total_carbohydrate - food.nf_dietary_fiber;
        }
      });
      for (const key in newTotal) {
        newTotal[key] = Math.round(newTotal[key] * 10) / 10;
      }
      return newTotal;
    });

    const newPieChartData: pieChartDataProps = {
      totalFatCalories: 0,
      totalCarbohydratesCalories: 0,
      totalProteinCalories: 0,
      totalAlcoholCalories: 0,
    };

    foodsArray.map(foodObj => {
      newPieChartData.totalFatCalories +=
        (foodObj
          ? foodObj.nf_total_fat ||
            getAttrValueById(foodObj.full_nutrients, 204)
          : 0) * 9;
      newPieChartData.totalCarbohydratesCalories +=
        (foodObj
          ? foodObj.nf_total_carbohydrate ||
            getAttrValueById(foodObj.full_nutrients, 205)
          : 0) * 4;
      newPieChartData.totalProteinCalories +=
        (foodObj
          ? foodObj.nf_protein || getAttrValueById(foodObj.full_nutrients, 203)
          : 0) * 4;
      if (newPieChartData.totalAlcoholCalories) {
        newPieChartData.totalAlcoholCalories +=
          (foodObj && foodObj.full_nutrients
            ? getAttrValueById(foodObj.full_nutrients, 221)
            : 0) * 7;
      }
    });

    if (newPieChartData.totalAlcoholCalories === 0) {
      delete newPieChartData.totalAlcoholCalories;
    }

    setPieChartData(newPieChartData);
  }, [foodsArray]);

  const updateCalorieLimit = () => {
    dispatch(userActions.updateUserData({daily_kcal: dailyKcal} as User));
  };

  const saveDayNote = () => {
    dispatch(logActions.setDayNotes(selectedDate, dayNote));
  };

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <Text>Meal totals</Text>

          <View style={styles.mb10}>
            {/* before was data={foodsArray}, but it's not working this way */}
            <FoodLabel data={foods} />
          </View>

          <View style={styles.mb10}>
            <Text>Net Carbs ** : {total.net_carbs || 0} g</Text>
            <Text>Phosphorus ** : {total.nf_p || 0} mg</Text>
            <Text>Potassium ** : {total.nf_potassium || 0} mg</Text>
            <Text>Caffeine ** : {total.caffeine || 0} mg</Text>

            <View style={styles.hideContainer}>
              <TouchableWithoutFeedback
                onPress={() => setShowMoreNutrients(!showMoreNutrients)}
                style={{flex: 1}}>
                <View style={styles.hideContent}>
                  <Text>
                    {showMoreNutrients ? 'Hide' : 'View'} more micronutrients{' '}
                  </Text>
                  <FontAwesome
                    name={showMoreNutrients ? 'angle-down' : 'angle-right'}
                    size={24}
                  />
                </View>
              </TouchableWithoutFeedback>
              {showMoreNutrients ? (
                <View style={{paddingHorizontal: 10, paddingBottom: 10}}>
                  <Text>Vitamin D**: {total.vitamin_d || 0} IU</Text>
                  <Text>Vitamin E**: {total.vitamin_e || 0} IU</Text>
                  <Text>Vitamin K**: {total.vitamin_k || 0} µg</Text>
                  <Text>Thiamine**: {total.thiamine || 0} mg</Text>
                  <Text>Riboflavin**: {total.riboflavin || 0} mg</Text>
                  <Text>Niacin**: {total.niacin || 0} mg</Text>
                  <Text>
                    Pantothenic Acid**: {total.pantothenic_acid || 0} mg
                  </Text>
                  <Text>Vitamin B-6**: {total.vitamin_b6 || 0} mg</Text>
                  <Text>Folate**: {total.folate || 0} µg</Text>
                  <Text>Vitamin B-12**: {total.vitamin_b12 || 0} µg</Text>
                  <Text>Folic Acid**: {total.folic_acid || 0} µg</Text>
                  <Text>Zinc**: {total.zinc || 0} mg</Text>
                  <Text>Magnesium**: {total.magnesium || 0} mg</Text>
                </View>
              ) : null}
            </View>
          </View>

          {foods.length && pieChartData ? (
            <View style={{marginBottom: 10}}>
              <NutritionPieChart data={pieChartData} />
            </View>
          ) : null}

          {type === 'daily' ? (
            <>
              <View
                style={{
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 10,
                }}>
                <Text>Daily Calorie Limit</Text>
                <View
                  style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                  <TextInput
                    value={dailyKcal + ''}
                    onChangeText={text => setDailyKcal(parseInt(text))}
                    keyboardType="number-pad"
                    style={{
                      borderWidth: 1,
                      padding: 9,
                      flex: 1,
                      marginTop: 8,
                      marginRight: 8,
                    }}
                  />
                  <View style={{flex: 1}}>
                    <NixButton
                      type="primary"
                      disabled={userData.daily_kcal == dailyKcal ? true : false}
                      title="Save"
                      onPress={() => updateCalorieLimit()}
                    />
                  </View>
                </View>
              </View>

              <View style={{marginBottom: 10}}>
                <Text style={{marginBottom: 8}}>Notes for this day:</Text>
                <TextInput
                  multiline
                  numberOfLines={5}
                  style={{
                    height: 180,
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 10,
                  }}
                  value={dayNote}
                  onChangeText={text => setDayNote(text)}
                />
                <View
                  style={{
                    position: 'absolute',
                    right: 10,
                    bottom: 10,
                    width: 100,
                  }}>
                  <NixButton
                    type="primary"
                    disabled={
                      totals.length && totals[0].notes == dayNote ? true : false
                    }
                    title="Save"
                    onPress={() => saveDayNote()}
                  />
                </View>
              </View>
            </>
          ) : null}

          <Text>
            ** Please note that our restaurant and branded grocery food database
            does not have these attributes available, and if your food log
            contains restaurant or branded grocery foods, these totals may be
            incorrect. The data from these these attributes is for reference
            purpose only, and should not be used for any chronic disease
            management.
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
