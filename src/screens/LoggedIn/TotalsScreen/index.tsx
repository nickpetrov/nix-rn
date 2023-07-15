// utils
import React, {useEffect, useState, useLayoutEffect} from 'react';
import moment from 'moment-timezone';
import max from 'lodash/max';

// components
import {
  View,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  TextInput,
  Keyboard,
} from 'react-native';
import NutritionPieChart, {
  pieChartDataProps,
} from 'components/NutritionPieChart';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NixButton} from 'components/NixButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ChooseModal from 'components/ChooseModal';
import NutritionLabel from 'components/NutrionixLabel/NutritionLabel';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';
import useFoodLabel from '../FoodScreen/useFoodLabel';
import {filterNutrient, sumFoods} from 'helpers/filters';

// actions
import * as userActions from 'store/auth/auth.actions';
import * as logActions from 'store/userLog/userLog.actions';
import * as userLogActions from 'store/userLog/userLog.actions';
import {addExistFoodToBasket, mergeBasket} from 'store/basket/basket.actions';

// helpres
import getAttrValueById from 'helpers/getAttrValueById';
import {analyticTrackEvent} from 'helpers/analytics.ts';
import {guessMealTypeByTime} from 'helpers/foodLogHelpers';

// types
import {RouteProp} from '@react-navigation/native';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {FoodProps, TotalProps} from 'store/userLog/userLog.types';
import {User} from 'store/auth/auth.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// constants
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './TotalsScreen.styles';

interface TotalsScreenProps {
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Totals>;
  route: RouteProp<StackNavigatorParamList, Routes.Totals>;
}

export const TotalsScreen: React.FC<TotalsScreenProps> = ({
  navigation,
  route,
}) => {
  const foods = route.params.foods;
  const mealType = route.params.type;
  const readOnly = route.params.readOnly;
  const date = route.params.date;
  // const clientId = route.params.clientId;
  const emptyBasket = useSelector(state => state.basket.foods.length === 0);
  const userData = useSelector(state => state.auth.userData);
  const {totals, selectedDate} = useSelector(state => state.userLog);
  const clientTotals = useSelector(state => state.coach.clientTotals);
  const followDate = date || selectedDate;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pieChartData, setPieChartData] = useState<pieChartDataProps>();
  const [showMoreNutrients, setShowMoreNutrients] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [dailyKcal, setDailyKcal] = useState(userData.daily_kcal);
  const [dayNote, setDayNote] = useState(
    totals.length && totals[0].notes ? totals[0].notes : '',
  );

  const labelData = useFoodLabel(foods);
  const summedFoodsData = sumFoods(foods);
  const netCarbs = summedFoodsData.nf_total_carbohydrate > 0 ?
    (Math.round((summedFoodsData.nf_total_carbohydrate - (summedFoodsData.nf_dietary_fiber || filterNutrient(summedFoodsData.full_nutrients, 291, 'value')) || 0) * 100)/100) :
    0;

  const [total, setTotal] = useState<Record<string, any> | null>({
    totalCalForPieChart: 0,
  });
  const [caloriesInputFocused, setCaloriesInputFocuses] = useState(false);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle:
        mealType === 'daily'
          ? `Summary of ${moment(followDate).format('dddd, MM/DD')}`
          : `${mealType} - ${moment(followDate).format('ddd, MM/DD')}`,
    });
  }, [navigation, mealType, followDate]);

  useEffect(() => {
    if (clientTotals.length) {
      if (clientTotals[0].daily_kcal_limit) {
        setDailyKcal(clientTotals[0].daily_kcal_limit);
      }
    } else if (totals.length) {
      const selectedDayTotals = totals.filter(
        (item: TotalProps) => item.date === followDate,
      )[0];
      if (selectedDayTotals) {
        if (selectedDayTotals.daily_kcal_limit) {
          setDailyKcal(selectedDayTotals.daily_kcal_limit);
        }
        if (selectedDayTotals.notes) {
          setDayNote(selectedDayTotals.notes);
        }
      }
    }
  }, [followDate, totals, clientTotals]);

  useEffect(() => {
    setTotal(prev => {
      const newTotal: Record<string, any> = {...prev};

      foods.forEach(food => {
        let foodCalories;
        var totalMacroCalories =
          (food.nf_protein || 0) * 4 +
          (food.nf_total_carbohydrate || 0) * 4 +
          (food.nf_total_fat || 0) * 9;

        if (!(newTotal.alcohol > 0 || newTotal.alcohol === 0)) {
          foodCalories = max([newTotal.calories, totalMacroCalories]);

          if (foodCalories - totalMacroCalories >= (foodCalories / 100) * 15) {
            newTotal.alcohol = (foodCalories - totalMacroCalories) / 7;
          } else {
            foodCalories = totalMacroCalories;
          }
        } else {
          foodCalories = totalMacroCalories + newTotal.alcohol * 7;
        }

        newTotal.totalCalForPieChart += foodCalories;
      });

      return newTotal;
    });

    const newPieChartData: pieChartDataProps = {
      totalFatCalories: 0,
      totalCarbohydratesCalories: 0,
      totalProteinCalories: 0,
      totalAlcoholCalories: 0,
    };

    foods.map(foodObj => {
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

      newPieChartData.totalAlcoholCalories =
        ((foodObj && foodObj.full_nutrients
          ? getAttrValueById(foodObj.full_nutrients, 221)
          : 0) * 7 || 0) + (newPieChartData.totalAlcoholCalories || 0);
    });

    if (newPieChartData.totalAlcoholCalories === 0) {
      newPieChartData.totalAlcoholCalories = null;
    }

    setPieChartData(newPieChartData);
  }, [foods]);

  const updateCalorieLimit = () => {
    Keyboard.dismiss();
    if (dailyKcal) {
      if (followDate === moment().format('YYYY-MM-DD')) {
        if (userData.daily_kcal !== dailyKcal) {
          dispatch(userActions.updateUserData({daily_kcal: dailyKcal} as User))
            .then(() => {
              analyticTrackEvent(
                'changedCalorieLimit',
                'From ' + userData.daily_kcal + ' to ' + dailyKcal,
              );
            })
            .catch(err => console.log(err));
        }
      } else {
        dispatch(logActions.setDayCalorieLimit(followDate, dailyKcal))
          .then(() => {
            analyticTrackEvent(
              'retroactiveChangeCalorieLimit',
              ' to ' + dailyKcal,
            );
          })
          .catch(err => console.log(err));
      }
    }
  };

  const saveDayNote = () => {
    dispatch(logActions.setDayNotes(selectedDate, dayNote));
  };

  const handleCopyMeal = () => {
    dispatch(addExistFoodToBasket(foods)).then(() => {
      analyticTrackEvent('Copy_From_Summary', ' ');
      dispatch(
        mergeBasket({
          consumed_at: moment().format('YYYY-MM-DD'),
          meal_type: emptyBasket
            ? guessMealTypeByTime(moment().hours())
            : undefined,
        }),
      );
      navigation.navigate(Routes.Basket);
    });
  };
  const handleClearMeal = () =>
    dispatch(
      userLogActions.deleteFoodFromLog(
        foods.map((item: FoodProps) => ({
          id: item.id,
        })),
      ),
    ).then(() => {
      analyticTrackEvent('Delete_From_Summary', ' ');
      navigation.goBack();
    });

  return (
    <SafeAreaView style={styles.root}>
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        style={{flex: 1}}
        accessible={false}>
        <KeyboardAwareScrollView
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          extraScrollHeight={showNotes && !caloriesInputFocused ? 200 : 0}
          enableAutomaticScroll={true}>
          <View style={styles.mb10}>
            <NutritionLabel option={labelData} />
          </View>

          <View style={styles.container}>
            <Text>
              <Text style={styles.boldText}>Net Carbs: </Text>{(netCarbs || 0).toFixed(1)} g
            </Text>
            <Text>
              Phosphorus ** : {(labelData?.phosphorus || 0).toFixed(1)} mg
            </Text>
            <Text>
              Caffeine ** : {(labelData?.caffeine || 0).toFixed(1)} mg
            </Text>

            <View style={styles.hideContainer}>
              <TouchableWithoutFeedback
                onPress={() => setShowMoreNutrients(!showMoreNutrients)}
                style={styles.flex1}>
                <View style={styles.hideContent}>
                  <FontAwesome
                    name={showMoreNutrients ? 'chevron-down' : 'chevron-right'}
                    size={12}
                    style={styles.hideContentIcon}
                  />
                  <Text style={styles.boldText}>
                    {showMoreNutrients ? 'Hide' : 'View'} more micronutrients{' '}
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              {showMoreNutrients ? (
                <View style={styles.vitaminContainer}>
                  <Text>
                    Vitamin D**: {(labelData?.vitamin_d || 0).toFixed(1)} IU
                  </Text>
                  <Text>
                    Vitamin E**: {(labelData?.vitamin_e || 0).toFixed(1)} IU
                  </Text>
                  <Text>
                    Vitamin K**: {(labelData?.vitamin_k || 0).toFixed(1)} µg
                  </Text>
                  <Text>
                    Thiamine**: {(labelData?.thiamine || 0).toFixed(1)} mg
                  </Text>
                  <Text>
                    Riboflavin**: {(labelData?.riboflavin || 0).toFixed(1)} mg
                  </Text>
                  <Text>
                    Niacin**: {(labelData?.niacin || 0).toFixed(1)} mg
                  </Text>
                  <Text>
                    Pantothenic Acid**: {(labelData?.pantothenic_acid || 0).toFixed(1)} mg
                  </Text>
                  <Text>
                    Vitamin B-6**: {(labelData?.vitamin_b6 || 0).toFixed(1)} mg
                  </Text>
                  <Text>
                    Folate**: {(labelData?.folate || 0).toFixed(1)} µg
                  </Text>
                  <Text>
                    Vitamin B-12**: {(labelData?.vitamin_b12 || 0).toFixed(1)} µg
                  </Text>
                  <Text>
                    Folic Acid**: {(labelData?.folic_acid || 0).toFixed(1)} µg
                  </Text>
                  <Text>
                    Zinc**: {(labelData?.zinc || 0).toFixed(1)} mg
                  </Text>
                  <Text>
                    Magnesium**: {(labelData?.magnesium || 0).toFixed(1)} mg
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.container}>
            {mealType === 'daily' && !readOnly && (
              <View style={styles.dailyContainer}>
                <Text style={styles.dailyText}>Daily Calorie Limit:</Text>
                <TextInput
                  selectTextOnFocus
                  value={dailyKcal ? dailyKcal + '' : ''}
                  onFocus={() => setCaloriesInputFocuses(true)}
                  onBlur={() => setCaloriesInputFocuses(false)}
                  onChangeText={text => setDailyKcal(parseInt(text))}
                  keyboardType="number-pad"
                  style={styles.dailyInput}
                />
                <View style={styles.dailyBtnContainer}>
                  <NixButton
                    type="primary"
                    title="Save"
                    onPress={() => updateCalorieLimit()}
                    style={styles.dailyBtn}
                  />
                </View>
              </View>
            )}

            {foods.length && pieChartData ? (
              <View style={styles.mb10}>
                <NutritionPieChart
                  data={pieChartData}
                  totalCalForPieChart={total?.totalCalForPieChart}
                  clientTotals={clientTotals}
                />
              </View>
            ) : null}

            {mealType === 'daily' && !readOnly && (
              <>
                <TouchableWithoutFeedback
                  onPress={() => setShowNotes(!showNotes)}
                  style={styles.flex1}>
                  <View style={styles.hideContent}>
                    <FontAwesome
                      name="sticky-note-o"
                      size={12}
                      style={styles.hideContentIcon}
                    />
                    <Text>Notes</Text>
                    <FontAwesome
                      name={showNotes ? 'chevron-down' : 'chevron-right'}
                      size={12}
                      style={styles.hideContentIconRight}
                    />
                  </View>
                </TouchableWithoutFeedback>
                {showNotes ? (
                  <TextInput
                    multiline
                    numberOfLines={5}
                    style={styles.noteInput}
                    value={dayNote}
                    onChangeText={text => setDayNote(text)}
                    onBlur={() => {
                      if (totals.length && totals[0].notes !== dayNote) {
                        saveDayNote();
                      }
                    }}
                  />
                ) : null}
              </>
            )}

            <Text style={styles.noteText}>
              ** Please note that our restaurant and branded grocery food
              database does not have these attributes available, and if your
              food log contains restaurant or branded grocery foods, these
              totals may be incorrect. The data from these these attributes is
              for reference purpose only, and should not be used for any chronic
              disease management.
            </Text>
          </View>
          {mealType !== 'daily' && !readOnly && (
            <View style={styles.btnsContainer}>
              <NixButton
                style={styles.btn}
                title="Copy Meal"
                type="energized"
                onPress={handleCopyMeal}
              />
              <NixButton
                style={styles.btn}
                title="Clear Meal"
                type="red"
                onPress={() => setShowDeleteModal(!showDeleteModal)}
              />
            </View>
          )}
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
      <ChooseModal
        modalVisible={showDeleteModal}
        hideModal={() => setShowDeleteModal(false)}
        title="Delete Foods"
        subtitle={`Are you shure you want to delete all of your ${mealType} items?`}
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
              handleClearMeal();
            },
          },
        ]}
      />
    </SafeAreaView>
  );
};
