import {FoodProps} from 'store/userLog/userLog.types';

export enum customFoodsActionTypes {
  GET_ALL_CUSTOM_FOOD = 'GET_ALL_CUSTOM_FOOD',
  CLEAR = 'CLEAR',
}

export interface CustomFoodsState {
  foods: Array<FoodProps>;
}
