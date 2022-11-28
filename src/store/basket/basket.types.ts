import {FoodProps} from 'store/userLog/userLog.types';
export enum basketActionTypes {
  ADD_FOOD_TO_BASKET = 'ADD_FOOD_TO_BASKET',
  DELETE_FOOD_FROM_BASKET = 'DELETE_FOOD_FROM_BASKET',
  MERGE_BASKET = 'MERGE_BASKET',
  UPDATE_BASKET_FOODS = 'UPDATE_BASKET_FOODS',
  BASKET_RESET = 'BASKET_RESET',
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

export type addFoodToBasketAction = {
  type: basketActionTypes.ADD_FOOD_TO_BASKET;
  foods: FoodProps[];
};
export type deleteFoodFromBasketAction = {
  type: basketActionTypes.DELETE_FOOD_FROM_BASKET;
  id: string;
};
export type mergeBasketAction = {
  type: basketActionTypes.MERGE_BASKET;
  payload: Partial<BasketState>;
};
export type updateBasketFoodAction = {
  type: basketActionTypes.UPDATE_BASKET_FOODS;
  foods: FoodProps[];
};
export type resetBasketAction = {
  type: basketActionTypes.BASKET_RESET;
};

export type BasketActions =
  | addFoodToBasketAction
  | deleteFoodFromBasketAction
  | mergeBasketAction
  | updateBasketFoodAction
  | resetBasketAction;
