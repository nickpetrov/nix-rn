import {FoodProps} from 'store/userLog/userLog.types';
export enum basketActionTypes {
  ADD_FOOD_TO_BASKET = 'ADD_FOOD_TO_BASKET',
  DELETE_FOOD_FROM_BASKET = 'DELETE_FOOD_FROM_BASKET',
  MERGE_BASKET = 'MERGE_BASKET',
  MERGE_BASKET_FROM_STORAGE = 'MERGE_BASKET_FROM_STORAGE',
  UPDATE_BASKET_FOODS = 'UPDATE_BASKET_FOODS',
  RESET = 'RESET',
}

export enum mealTypes {
  Breakfast = 1,
  'AM Snack' = 2,
  Lunch = 3,
  'PM Snack' = 4,
  Dinner = 5,
  'Late Snack' = 6,
}

export interface BasketState {
  foods: Array<FoodProps>;
  isSingleFood: boolean;
  recipeName: string;
  servings: string;
  consumed_at: string;
  meal_type: mealTypes;
  recipeBrand: string;
  customPhoto: {
    full: string;
    thumb: string;
    is_user_uploaded: boolean;
  } | null;
}
