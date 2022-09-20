import userLogService from 'api/userLogService';
import {Dispatch} from 'redux';
import {foodsActionTypes} from './foods.types';
import {RootState} from '../index';
import baseService from 'api/baseService';

export const getFoodInfo = (beginDate: string, endDate: string) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const timezone = useState().auth.userData.timezone;

    const response = await userLogService.getTotals({
      beginDate,
      endDate,
      timezone,
    });

    const data = response.data;
    if (__DEV__) {
      console.log('foodInfo', data);
    }
    if (data) {
      dispatch({
        type: foodsActionTypes.GET_FOOD_INFO,
        foodInfo: data || null,
      });
    }
  };
};

export const getFoodByQRcode = (searchValue: string) => {
  return async (dispatch: Dispatch) => {
    const response = await baseService.getFoodByQRcode(searchValue);

    if (response.status === 404) {
      dispatch({
        type: foodsActionTypes.GET_FOOD_BY_QR_CODE,
        foodFindByQRcode: {
          food_name: `Unrecognised food barcode: ${searchValue}`,
          photo: {thumb: null},
        },
      });
    } else {
      const data = response.data;

      if (__DEV__) {
        console.log('foodInfo', data);
      }
      if (data.foods && data.foods[0]) {
        dispatch({
          type: foodsActionTypes.GET_FOOD_BY_QR_CODE,
          foodFindByQRcode: data.foods[0],
        });
      }
    }
  };
};

export const clearSnanedFood = () => {
  return {type: foodsActionTypes.CLEAR_SCANED_FOOD};
};

export const getAllCustomFoods = () => {
  return async (dispatch: Dispatch) => {
    const response = await userLogService.getUserWeightlog({});

    const result = response.data;
    if (__DEV__) {
      console.log('all custom foods', result.custom_foods);
    }
    if (result.custom_foods) {
      dispatch({
        type: foodsActionTypes.GET_ALL_CUSTOM_FOOD,
        custom_foods: result.custom_foods,
      });
    }
  };
};

export const getSuggestedFoods = () => {
  return async (dispatch: Dispatch) => {
    const response = await userLogService.getSuggestedFood();

    const result = response.data;
    if (__DEV__) {
      console.log('all suggested foods', result.products);
    }
    if (result.products) {
      dispatch({
        type: foodsActionTypes.GET_ALL_SUGGESTED_FOOD,
        suggested_foods: result.products,
      });
    }
  };
};
