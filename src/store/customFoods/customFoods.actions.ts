import {Dispatch} from 'redux';
import {
  customFoodsActionTypes,
  UpdateCustomFoodProps,
} from './customFoods.types';
import customFoodsService from 'api/customFoodsService';

export const getCustomFoods = (limit?: number, offset?: number) => {
  return async (dispatch: Dispatch) => {
    const optionLimit = limit || 300;
    const optionOffset = offset || 0;
    const response = await customFoodsService.getCustomFoods(
      optionLimit,
      optionOffset,
    );

    const result = response.data;
    // if (__DEV__) {
    //   console.log('custom foods', result.custom_foods);
    // }
    if (result.custom_foods && result.custom_foods.length) {
      dispatch({
        type: customFoodsActionTypes.GET_ALL_CUSTOM_FOOD,
        foods: result.custom_foods,
      });
    }
  };
};

export const updateOrCreateCustomFood = (food: UpdateCustomFoodProps) => {
  return async (dispatch: Dispatch) => {
    const response = await customFoodsService.updateOrCreateCustomFoods(food);

    const result = response.data;
    // if (__DEV__) {
    //   console.log('update or create custom food', result);
    // }
    if (result.food_name) {
      dispatch({
        type: customFoodsActionTypes.UPDATE_OR_CREATE_CUSTOM_FOOD,
        food: result,
      });
    }
    return result;
  };
};

export const deleteCustomFood = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    const response = await customFoodsService.deleteCustomFood(id);

    if (response.status === 200) {
      dispatch({
        type: customFoodsActionTypes.DELETE_CUSTOM_FOOD,
        payload: id,
      });
    }
  };
};
