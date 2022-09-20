import {FoodProps} from 'store/userLog/userLog.types';

export enum foodsActionTypes {
  GET_FOOD_INFO = 'GET_FOOD_INFO',
  GET_ALL_CUSTOM_FOOD = 'GET_ALL_CUSTOM_FOOD',
  GET_ALL_SUGGESTED_FOOD = 'GET_ALL_SUGGESTED_FOOD',
  GET_FOOD_BY_QR_CODE = 'GET_FOOD_BY_QR_CODE',
  CLEAR_SCANED_FOOD = 'CLEAR_SCANED_FOOD',
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

export interface FoodsState {
  foodInfo: FoodProps | null;
  foodFindByQRcode: FoodProps | null;
  custom_foods: Array<FoodProps>;
  suggested_foods: Array<SuggestedFoodProps>;
}
