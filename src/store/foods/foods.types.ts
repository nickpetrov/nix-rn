import {FoodProps} from 'store/userLog/userLog.types';

export enum foodsActionTypes {
  GET_FOOD_INFO = 'GET_FOOD_INFO',
  GET_ALL_CUSTOM_FOOD = 'GET_ALL_CUSTOM_FOOD',
  CLEAR = 'CLEAR',
}

export interface FoodsState {
  foodInfo: FoodProps | null;
  custom_foods: Array<FoodProps>;
}
