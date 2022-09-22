import {Dispatch} from 'redux';
import {customFoodsActionTypes} from './customFoods.types';
import customFoodsService from 'api/customFoodsService';

export const getCustomFoods = () => {
  return async (dispatch: Dispatch) => {
    const limit = 50;
    const offset = 0;
    const response = await customFoodsService.getCustomFoods(limit, offset);

    const result = response.data;
    if (__DEV__) {
      console.log('custom foods', result.custom_foods);
    }
    if (result.custom_foods && result.custom_foods.length) {
      dispatch({
        type: customFoodsActionTypes.GET_ALL_CUSTOM_FOOD,
        foods: result.custom_foods,
      });
    }
  };
};
