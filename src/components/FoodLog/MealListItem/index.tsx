// utils
import React from 'react';

// components
import {View, Text, Image, TouchableHighlight} from 'react-native';

// types
import {mealTypes} from 'store/basket/basket.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// styles
import {styles} from './MealListItem.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {FoodProps, mealNameProps} from 'store/userLog/userLog.types';
import {StackNavigatorParamList} from 'navigation/navigation.types';

interface MealListItemProps {
  foodObj: FoodProps;
  mealName?: mealNameProps;
  navigation?: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Autocomplete | Routes.Dashboard | Routes.Totals
  >;
  onTap?: () => void;
}

const MealListItem: React.FC<MealListItemProps> = props => {
  const {foodObj, mealName} = props;
  return (
    <TouchableHighlight
      onPress={() =>
        props.navigation
          ? props.navigation.navigate(Routes.FoodEdit, {
              foodObj: foodObj,
              mealType: mealName
                ? mealTypes[mealName as keyof typeof mealTypes]
                : undefined,
            })
          : props.onTap && props.onTap()
      }>
      <View style={styles.foodItem}>
        <Image
          style={styles.foodThumb}
          source={{uri: foodObj.photo.thumb}}
          resizeMode="contain"
        />
        <View style={styles.flex1}>
          <Text style={styles.foodName}>{foodObj.food_name}</Text>
          <Text style={styles.qty}>
            {`${foodObj.brand_name ? `${foodObj.brand_name} ` : ''}${
              foodObj.serving_qty
            } ${foodObj.serving_unit}`}
          </Text>
        </View>
        <Text style={styles.calories}>
          {' '}
          {foodObj?.nf_calories ? foodObj.nf_calories.toFixed(0) : ''}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export default MealListItem;
