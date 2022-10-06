// utils
import React, {useEffect, useState} from 'react';
import {ParamListBase, useNavigation} from '@react-navigation/native';

// components
import {View, Text, TouchableOpacity} from 'react-native';

// constants
import {Colors} from 'constants/Colors';
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './FoodLogStats.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SortedFoodProps} from 'store/userLog/userLog.types';

interface FoodLogStatsProps {
  caloriesLimit: number;
  caloriesBurned: number;
  caloriesIntake: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  // scrollDirection: 'up' | 'down';
  foods: Array<SortedFoodProps>;
}

const FoodLogStats: React.FC<FoodLogStatsProps> = props => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [progressBarColor, setProgressBarColor] = useState<string>(
    Colors.Primary,
  );
  const {
    caloriesLimit,
    caloriesBurned,
    caloriesIntake,
    protein,
    carbohydrates,
    fat,
  } = props;
  let progressValue = caloriesIntake
    ? ((caloriesIntake - caloriesBurned) / caloriesLimit) * 100
    : 0;
  let progressBarCurrent = {
    width: (progressValue > 0 ? progressValue.toFixed(0) : 0) + '%',
  };
  let remaining_calories = +(
    caloriesLimit -
    caloriesIntake +
    caloriesBurned
  ).toFixed(0);
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

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(Routes.Totals, {
          type: 'daily',
          foods: props.foods || [],
        })
      }>
      <View>
        <View
          style={
            // props.scrollDirection === 'down'
            //   ? styles.hide
            //   :
            styles.caloriesProgress
          }>
          <View style={styles.caloriesProgressLabel}>
            <Text style={styles.caloriesProgressLabelText}>
              {caloriesIntake.toFixed(0)} cal intake
            </Text>
          </View>
          <View style={styles.caloriesProgressLabel}>
            <Text style={styles.caloriesProgressLabelText}>
              {caloriesBurned.toFixed(0)} cal burned
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
            <Text style={styles.macroValue}>{protein.toFixed(0)}g</Text>
            <Text style={styles.macroTitle}>Protein</Text>
          </View>
          <View style={styles.macroTotalsTile}>
            <Text style={styles.macroValue}>{carbohydrates.toFixed(0)}g</Text>
            <Text style={styles.macroTitle}>Carb</Text>
          </View>
          <View style={styles.macroTotalsTile}>
            <Text style={styles.macroValue}>{fat.toFixed(0)}g</Text>
            <Text style={styles.macroTitle}>Fat</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FoodLogStats;
