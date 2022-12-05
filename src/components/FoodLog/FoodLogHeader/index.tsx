// utils
import React from 'react';

// componetns
import {View} from 'react-native';
import FoodLogNavigation from './FoodLogNavigation';
import FoodLogStats from './FoodLogStats';

// styles
import {styles} from './FoodLogHeader.styles';

// types
import {FoodProps} from 'store/userLog/userLog.types';

interface FoodLogHeaderProps {
  caloriesLimit: number;
  caloriesBurned: number;
  foods: Array<FoodProps>;
}

const FoodLogHeader: React.FC<FoodLogHeaderProps> = props => {
  return (
    <View style={styles.foodLogHeader}>
      <FoodLogNavigation foods={props.foods} />
      <FoodLogStats {...props} />
    </View>
  );
};

export default FoodLogHeader;
