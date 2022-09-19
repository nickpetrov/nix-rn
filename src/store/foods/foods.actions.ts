import userLogService from 'api/userLogService';
import {Dispatch} from 'redux';
import {foodsActionTypes} from './foods.types';
import {RootState} from '../index';

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
