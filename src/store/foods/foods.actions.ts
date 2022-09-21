import userLogService from 'api/userLogService';
import {Dispatch} from 'redux';
import {foodsActionTypes} from './foods.types';
import {RootState} from '../index';
import baseService from 'api/baseService';
import autoCompleteService, {
  InstantQueryDataProps,
} from 'api/autoCompleteService';

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
    const response = await baseService.getSuggestedFood();

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

export const getGroceries = (data: InstantQueryDataProps) => {
  return async (dispatch: Dispatch) => {
    const response = await autoCompleteService.getTrackInstant(data);

    const result = response.data;
    if (__DEV__) {
      console.log('groceries', result.branded);
    }
    if (result.branded) {
      dispatch({
        type: foodsActionTypes.GET_GROCERIES,
        groceries: result.branded,
      });
    }
  };
};
export const getHistoryFoods = (data: InstantQueryDataProps) => {
  return async (dispatch: Dispatch) => {
    const response = await autoCompleteService.getTrackInstant(data);

    const result = response.data;
    if (__DEV__) {
      console.log('historyFoods', result.self);
    }
    if (result.self) {
      dispatch({
        type: foodsActionTypes.GET_HISTORY_FOODS,
        historyFoods: result.self,
      });
    }
  };
};
export const getRestorants = () => {
  return async (dispatch: Dispatch) => {
    const response = await baseService.getBrandRestorants();

    const result = response.data;
    if (__DEV__) {
      console.log('restaurants', result);
    }
    if (result) {
      dispatch({
        type: foodsActionTypes.GET_RESTORANTS,
        restaurants: result,
      });
    }
  };
};

export const getRestorantsWithCalc = () => {
  return async (dispatch: Dispatch) => {
    const response = await baseService.getRestorantsWithCalc();

    const result = response.data;
    if (__DEV__) {
      console.log('restaurants with calc', result);
    }
    if (result) {
      dispatch({
        type: foodsActionTypes.GET_RESTORANTS_WITH_CALC,
        restaurantsWithCalc: result,
      });
    }
  };
};
export const getRestorantsFoods = (data: InstantQueryDataProps) => {
  return async (dispatch: Dispatch) => {
    const response = await autoCompleteService.getTrackInstant(data);

    const result = response.data;
    if (__DEV__) {
      console.log('restaurants foods', result.branded);
    }
    if (result.branded && result.branded.length) {
      dispatch({
        type: foodsActionTypes.GET_RESTORANTS_FOODS,
        restaurantFoods: result.branded,
      });
    }
  };
};
