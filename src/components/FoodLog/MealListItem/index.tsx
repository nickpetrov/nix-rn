// utils
import React from 'react';

// components
import {View, Text, Image, TouchableHighlight} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

// types
import {mealTypes} from 'store/basket/basket.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FoodProps, mealNameProps} from 'store/userLog/userLog.types';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// styles
import {styles} from './MealListItem.styles';

// constants
import {Routes} from 'navigation/Routes';
import {Colors} from 'constants/Colors';

interface MealListItemProps {
  foodObj: FoodProps;
  mealName?: mealNameProps;
  navigation?: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Autocomplete | Routes.Dashboard | Routes.Totals
  >;
  onTap?: () => void;
  withArrow?: boolean;
  withoutPhotoUploadIcon?: boolean;
  withoutBorder?: boolean;
  withCal?: boolean;
}
const MealListItem: React.FC<MealListItemProps> = props => {
  const {foodObj, mealName, withoutPhotoUploadIcon, withCal} = props;

  return (
    <TouchableHighlight
      onPress={() =>
        props.navigation
          ? props.navigation.navigate(Routes.Food, {
              foodObj: foodObj,
              mealType: mealName
                ? mealTypes[mealName as keyof typeof mealTypes]
                : undefined,
            })
          : props.onTap && props.onTap()
      }>
      <View
        style={[styles.foodItem, props.withoutBorder && styles.withoutBorder]}>
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
        <View style={styles.right}>
          {foodObj.photo.is_user_uploaded && !withoutPhotoUploadIcon && (
            <FontAwesome
              style={styles.icon}
              name="camera"
              color={Colors.Blue}
              size={20}
            />
          )}
          <View style={styles.caloriesContainer}>
            <Text style={styles.calories}>
              {foodObj?.nf_calories ? foodObj.nf_calories.toFixed(0) : ''}
            </Text>
            {withCal && <Text style={styles.caloriesSub}>Cal</Text>}
          </View>
          {props.withArrow && (
            <Ionicons
              style={styles.chevron}
              name="chevron-forward"
              color={Colors.Gray}
              size={20}
            />
          )}
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default MealListItem;
