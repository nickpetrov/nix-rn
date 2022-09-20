import {FoodProps} from 'store/userLog/userLog.types';

export enum foodsActionTypes {
  GET_FOOD_INFO = 'GET_FOOD_INFO',
  GET_ALL_CUSTOM_FOOD = 'GET_ALL_CUSTOM_FOOD',
  GET_FOOD_BY_QR_CODE = 'GET_FOOD_BY_QR_CODE',
  CLEAR_SCANED_FOOD = 'CLEAR_SCANED_FOOD',
  CLEAR = 'CLEAR',
}

export interface FoodsState {
  foodInfo: FoodProps | null;
  foodFindByQRcode: FoodProps | null;
  custom_foods: Array<FoodProps>;
}
