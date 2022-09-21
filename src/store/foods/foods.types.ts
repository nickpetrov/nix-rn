import {FoodProps} from 'store/userLog/userLog.types';

export enum foodsActionTypes {
  GET_FOOD_INFO = 'GET_FOOD_INFO',
  GET_ALL_CUSTOM_FOOD = 'GET_ALL_CUSTOM_FOOD',
  GET_ALL_SUGGESTED_FOOD = 'GET_ALL_SUGGESTED_FOOD',
  GET_GROCERIES = 'GET_GROCERIES',
  GET_HISTORY_FOODS = 'GET_HISTORY_FOODS',
  GET_FOOD_BY_QR_CODE = 'GET_FOOD_BY_QR_CODE',
  CLEAR_SCANED_FOOD = 'CLEAR_SCANED_FOOD',
  GET_RESTORANTS = 'GET_RESTORANTS',
  GET_RESTORANTS_FOODS = 'GET_RESTORANTS_FOODS',
  GET_RESTORANTS_WITH_CALC = 'GET_RESTORANTS_WITH_CALC',
  CLEAR = 'CLEAR',
}

export interface SuggestedFoodProps {
  brand_name: string;
  created_at: string;
  created_by: string;
  created_by_name: string;
  description: string;
  id: string;
  image_thumb: string;
  item_name: string;
  updated_at: string | null;
  updated_by: string | null;
  updated_by_name: string | null;
  url: string;
}

export interface RestaurantsProps {
  id: string;
  logo: string;
  name: string;
  proper_brand_name: string;
  brand_id: string;
  brand_logo: string;
}

export interface RestaurantsWithCalcProps extends RestaurantsProps {
  brand_keywords: string;
  desktop_calculator_url: string;
  mobile_calculator_url: string;
}

export interface FoodsState {
  foodInfo: FoodProps | null;
  foodFindByQRcode: FoodProps | null;
  custom_foods: Array<FoodProps>;
  suggested_foods: Array<SuggestedFoodProps>;
  groceries: Array<FoodProps>;
  historyFoods: Array<FoodProps>;
  restaurants: Array<RestaurantsProps>;
  restaurantsWithCalc: Array<RestaurantsWithCalcProps>;
  restaurantFoods: Array<FoodProps>;
}
