// utils
import React from 'react';

// components
import {View, Text, TouchableOpacity, Image} from 'react-native';

// types
import {mealTypes} from 'store/basket/basket.types';
import {FoodProps} from 'store/autoComplete/autoComplete.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// styles
import {styles} from './MealListItem.styles';

interface MealListItemProps {
  foodObj: FoodProps;
  mealName?: keyof typeof mealTypes;
  navigation?: NativeStackNavigationProp<any>;
  onTap: () => void;
}

const MealListItem: React.FC<MealListItemProps> = props => {
  const {foodObj, mealName} = props;
  return (
    <TouchableOpacity
      onPress={() =>
        props.navigation
          ? props.navigation.navigate('FoodInfo', {
              foodObj: foodObj,
              mealType: mealName ? mealTypes[mealName] : undefined,
            })
          : props.onTap()
      }>
      <View style={styles.foodItem}>
        <Image
          style={styles.foodThumb}
          source={{uri: foodObj.photo.thumb}}
          resizeMode="contain"
        />
        <View style={{flex: 1}}>
          <Text style={styles.foodName}>{foodObj.food_name}</Text>
          <Text>
            {foodObj.serving_qty} {foodObj.serving_unit}
          </Text>
        </View>
        <Text>
          {' '}
          {foodObj?.nf_calories ? foodObj.nf_calories.toFixed(0) : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MealListItem;
