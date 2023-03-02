// utils
import React from 'react';

// components
import {View, Text, TouchableHighlight} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// types
import {FoodProps, NutrientProps} from 'store/userLog/userLog.types';

// styles
import {Colors} from 'constants/Colors';
import {styles} from './RestaurantFoodItem.styles';

interface RestaurantFoodItemProps {
  onPress: () => void;
  food: FoodProps;
}

const RestaurantFoodItem: React.FC<RestaurantFoodItemProps> = ({
  onPress,
  food,
}) => {
  return (
    <TouchableHighlight underlayColor={Colors.Highlight} onPress={onPress}>
      <View style={styles.root}>
        <View style={styles.left}>
          <View style={styles.imageContainer}>
            <FontAwesome name="plus-circle" size={30} color="#888" />
          </View>
          <View style={styles.textContainer}>
            <Text numberOfLines={2} style={styles.name}>
              {food.item_name || food.food_name}
            </Text>
            <Text numberOfLines={1} style={styles.brandName}>
              {food.brand_name}{' '}
              {(food.nf_serving_size_qty || food.serving_qty || 1)?.toFixed(2)}{' '}
              {food.nf_serving_size_unit || food.serving_unit}
            </Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text style={styles.caloriesValue}>
            {food.full_nutrients
              ? food.full_nutrients
                  .filter((item: NutrientProps) => item.attr_id === 208)[0]
                  .value?.toFixed(0)
              : food.nf_calories
              ? food.nf_calories?.toFixed(0)
              : food.nf_calories}
          </Text>
          <Text style={styles.textCal}>Cal</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default RestaurantFoodItem;
