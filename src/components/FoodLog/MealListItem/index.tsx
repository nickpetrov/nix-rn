// utils
import React from 'react';

// components
import {View, Text, Image, TouchableHighlight} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HighlightText from 'components/HighlightText';

// types
import {mealTypes} from 'store/basket/basket.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FoodProps, mealNameProps} from 'store/userLog/userLog.types';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {RecipeProps} from 'store/recipes/recipes.types';

// styles
import {styles} from './MealListItem.styles';

// constants
import {Routes} from 'navigation/Routes';
import {Colors} from 'constants/Colors';

// helpers
import getAttrValueById from 'helpers/getAttrValueById';
import {capitalize} from 'helpers/foodLogHelpers';
import moment from 'moment-timezone';

interface MealListItemProps {
  foodObj: FoodProps | RecipeProps;
  recipe?: boolean;
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
  smallImage?: boolean;
  reverse?: boolean;
  withNewLabel?: boolean;
  searchValue?: string;
  historyTab?: boolean;
  readOnly?: boolean;
}
const MealListItem: React.FC<MealListItemProps> = props => {
  const {
    foodObj,
    mealName,
    withoutPhotoUploadIcon,
    withCal,
    smallImage,
    recipe,
    searchValue,
    reverse,
    withNewLabel,
    historyTab,
    readOnly,
  } = props;

  //reverse - use at recipe screen; display alwayes 1 serving

  const name = recipe
    ? (foodObj as RecipeProps).name
    : (foodObj as FoodProps).food_name;
  const calories = recipe
    ? getAttrValueById((foodObj as RecipeProps).full_nutrients, 208) /
      (foodObj as RecipeProps).serving_qty
    : (foodObj as FoodProps).nf_calories;
  return (
    <TouchableHighlight
      disabled={!props.navigation && !props.onTap}
      onPress={() =>
        props.navigation
          ? props.navigation.navigate(Routes.Food, {
              foodObj: foodObj as FoodProps,
              mealType: mealName
                ? mealTypes[mealName as keyof typeof mealTypes]
                : undefined,
              readOnly,
            })
          : props.onTap && props.onTap()
      }>
      <View
        style={[styles.foodItem, props.withoutBorder && styles.withoutBorder]}>
        {withNewLabel &&
          moment(foodObj.created_at).isAfter(moment().subtract('5', 'day')) && (
            <View style={styles.new}>
              <Text style={styles.newText}>NEW</Text>
            </View>
          )}
        <Image
          style={[styles.foodThumb, smallImage && styles.smallImage]}
          source={
            foodObj.photo.thumb
              ? {uri: foodObj.photo.thumb}
              : require('assets/gray_nix_apple_small.png')
          }
          resizeMode={'contain'}
        />
        <View style={[styles.flex1, reverse && styles.columnReverse]}>
          <HighlightText
            searchWords={[searchValue || '']}
            textToHighlight={capitalize(name)}
            style={styles.foodName}
            highlightStyle={{fontWeight: '600'}}
            numberOfLines={1}
            ellipsizeMode="tail"
          />
          <HighlightText
            searchWords={[searchValue || '']}
            textToHighlight={
              reverse
                ? recipe
                  ? `${foodObj.serving_qty || 1} Serving`
                  : `${foodObj.serving_qty || 1} ${foodObj.serving_unit}`
                : capitalize(
                    `${foodObj.brand_name ? `${foodObj.brand_name} ` : ''}${
                      historyTab && !foodObj.brand_name ? 'Common Food, ' : ''
                    }${foodObj.serving_qty} ${foodObj.serving_unit}`,
                  )
            }
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.qty}
            highlightStyle={{fontWeight: '600'}}
          />
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
              {calories ? calories.toFixed(0) : ''}
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
