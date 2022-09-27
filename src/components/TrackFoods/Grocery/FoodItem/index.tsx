// utils
import React from 'react';

// components
import {View, Text, TouchableWithoutFeedback, Image} from 'react-native';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';

// types
import {NutrientProps} from 'store/userLog/userLog.types';

// styles
import {styles} from './FoodItem.styles';

interface FoodItemProps {
  onPress: () => void;
  foodObj: any;
}

const FoodItem: React.FC<FoodItemProps> = ({onPress, foodObj}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.root}>
        <View style={styles.imageContainer}>
          {/* <FontAwesome name="plus-circle" size={30} color="#666" /> */}
          {foodObj.photo ? (
            <Image
              style={styles.foodThumb}
              source={{uri: foodObj.photo.thumb}}
              resizeMode="contain"
            />
          ) : (
            <Image
              style={styles.foodThumb}
              source={require('../../../../assets/gray_nix_apple_small.png')}
              resizeMode="contain"
            />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {foodObj.food_name}
          </Text>
        </View>
        <View>
          <Text style={styles.caloriesValue}>
            {foodObj.full_nutrients
              ? foodObj.full_nutrients
                  .filter((item: NutrientProps) => item.attr_id === 208)[0]
                  .value.toFixed(0)
              : foodObj.nf_calories}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default FoodItem;
