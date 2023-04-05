// utils
import React, {useEffect, useState} from 'react';
import {ParamListBase, useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment-timezone';

// components
import {View, Text, TouchableOpacity} from 'react-native';
import TooltipView from 'components/TooltipView';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// actions
import {mergeWidget} from 'store/widget/widget.actions';

// constants
import {Colors} from 'constants/Colors';
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './FoodLogStats.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FoodProps} from 'store/userLog/userLog.types';

interface FoodLogStatsProps {
  caloriesLimit: number;
  caloriesBurned: number;
  foods: Array<FoodProps>;
  withoutNavigate?: boolean;
  withArrow?: boolean;
  clientId?: string;
  clientSelectedDate?: string;
}

const FoodLogStats: React.FC<FoodLogStatsProps> = ({
  caloriesLimit,
  caloriesBurned,
  foods,
  withoutNavigate,
  withArrow,
  clientId,
  clientSelectedDate,
}) => {
  const route = useRoute();
  const dispatch = useDispatch();
  const selectedDate = useSelector(state => state.userLog.selectedDate);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [total, setTotal] = useState<Record<string, any>>({
    caloriesIntake: 0,
    nf_protein: 0,
    nf_total_carbohydrate: 0,
    nf_total_fat: 0,
  });
  const [progressBarColor, setProgressBarColor] = useState<string>(
    Colors.Primary,
  );

  useEffect(() => {
    setTotal(() => {
      const newTotal: Record<string, any> = {
        caloriesIntake: 0,
        nf_protein: 0,
        nf_total_carbohydrate: 0,
        nf_total_fat: 0,
      };

      foods.forEach(food => {
        newTotal.caloriesIntake += food.nf_calories;
        newTotal.nf_total_fat += food.nf_total_fat;
        newTotal.nf_total_carbohydrate += food.nf_total_carbohydrate;
        newTotal.nf_protein += food.nf_protein;
      });

      return newTotal;
    });
  }, [foods]);
  let progressValue = total.caloriesIntake
    ? ((total.caloriesIntake - caloriesBurned) / caloriesLimit) * 100
    : 0;
  let progressBarCurrent = {
    width: (progressValue > 0 ? progressValue.toFixed(0) : 0) + '%',
  };
  let remaining_calories = +(
    caloriesLimit -
    Math.round(total.caloriesIntake || 0) +
    Math.round(caloriesBurned || 0)
  )?.toFixed(0);
  let remaining_calories_text = 'remaining';

  if (remaining_calories < 0) {
    remaining_calories *= -1;
    remaining_calories_text = 'Over';
  }
  useEffect(() => {
    setProgressBarColor(() => {
      if (progressValue > 100) {
        return '#ef4e3a';
      } else if (progressValue >= 85 && progressValue !== 100) {
        return '#f0b840';
      } else {
        return Colors.Primary;
      }
    });
  }, [progressValue]);

  // update widget
  useEffect(() => {
    if (selectedDate === moment().format('YYYY-MM-DD')) {
      dispatch(
        mergeWidget({
          limit: caloriesLimit,
          consumed: total.caloriesIntake,
          burned: caloriesBurned,
          date: selectedDate,
        }),
      );
    }
  }, [
    dispatch,
    caloriesLimit,
    total.caloriesIntake,
    caloriesBurned,
    selectedDate,
  ]);

  const content = (
    <>
      <View
        style={
          // props.scrollDirection === 'down'
          //   ? styles.hide
          //   :
          styles.caloriesProgress
        }>
        <View style={styles.caloriesProgressLabel}>
          <Text style={styles.caloriesProgressLabelText}>
            {total.caloriesIntake?.toFixed(0)} cal intake
          </Text>
        </View>
        <View style={styles.caloriesProgressLabel}>
          <Text style={styles.caloriesProgressLabelText}>
            {caloriesBurned?.toFixed(0)} cal burned
          </Text>
        </View>
        <View style={styles.caloriesProgressLabel}>
          <Text style={styles.caloriesProgressLabelText}>
            {remaining_calories_text} {remaining_calories}
          </Text>
        </View>
      </View>
      <View style={styles.progressBarWrapper}>
        <View style={styles.progressBar}>
          <View
            style={{
              ...styles.progressBarColor,
              ...progressBarCurrent,
              ...{backgroundColor: progressBarColor},
            }}>
            <View style={styles.progressBarColorShadow} />
          </View>
        </View>
      </View>
      <View style={styles.macroTotals}>
        <View style={styles.macroTotalsTile}>
          <Text style={styles.macroValue}>{total.nf_protein?.toFixed(0)}g</Text>
          <Text style={styles.macroTitle}>Protein</Text>
        </View>
        <View style={styles.macroTotalsTile}>
          <Text style={styles.macroValue}>
            {total.nf_total_carbohydrate?.toFixed(0)}g
          </Text>
          <Text style={styles.macroTitle}>Carb</Text>
        </View>
        <View style={styles.macroTotalsTile}>
          <Text style={styles.macroValue}>
            {total.nf_total_fat?.toFixed(0)}g
          </Text>
          <Text style={styles.macroTitle}>Fat</Text>
        </View>
      </View>
    </>
  );

  return (
    <TooltipView
      doNotDisplay={route.name !== Routes.Dashboard}
      eventName="firstFoodAddedToFoodLog"
      step={0}
      childrenWrapperStyle={{
        backgroundColor: '#fff',
        alignItems: 'stretch',
        height: 'auto',
      }}>
      <TouchableOpacity
        disabled={withoutNavigate}
        onPress={() =>
          navigation.navigate(Routes.Totals, {
            type: 'daily',
            foods: foods,
            clientId,
            date: clientSelectedDate,
            readOnly: !!clientId,
          })
        }>
        {withArrow ? (
          <View style={styles.row}>
            <View style={styles.main}>{content}</View>
            {withArrow && (
              <View style={styles.arrow}>
                <FontAwesome name="angle-right" color="#888" size={30} />
              </View>
            )}
          </View>
        ) : (
          <View>{content}</View>
        )}
      </TouchableOpacity>
    </TooltipView>
  );
};

export default FoodLogStats;
