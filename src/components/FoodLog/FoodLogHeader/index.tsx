// utils
import React from 'react';

// componetns
import {View} from 'react-native';
import FoodLogNavigation from './FoodLogNavigation';
import FoodLogStats from './FoodLogStats';

// styles
import {styles} from './FoodLogHeader.styles';

// types
import {SortedFoodProps} from 'store/userLog/userLog.types';

interface FoodLogHeaderProps {
  caloriesLimit: number;
  caloriesBurned: number;
  caloriesIntake: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  scrollDirection: 'up' | 'down';
  foods: Array<SortedFoodProps>;
}

const FoodLogHeader: React.FC<FoodLogHeaderProps> = props => {
  return (
    <View style={styles.foodLogHeader}>
      <FoodLogNavigation scrollDirection={props.scrollDirection} />
      <FoodLogStats {...props} scrollDirection={props.scrollDirection} />
    </View>
  );
};

export default FoodLogHeader;
