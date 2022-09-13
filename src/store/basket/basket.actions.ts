// utils
import AsyncStorage from '@react-native-async-storage/async-storage';
import basketService from 'api/basketService';

// types
import {Dispatch} from 'redux';
import {basketActionTypes} from './basket.types';

const saveBasketToStorage = (basket: any) => {
  AsyncStorage.getItem('basket').then(data => {
    let prevData = data ? JSON.parse(data) : {};
    let newFoods = prevData?.foods ? [...prevData?.foods] : [];
    if (typeof basket?.foods == 'object') {
      newFoods = newFoods.concat(basket.foods);
    } else {
      newFoods.push(basket.foods);
    }

    AsyncStorage.setItem('basket', JSON.stringify({...prevData, ...basket}));
  });
};

const resetBasketStorage = () => {
  AsyncStorage.removeItem('basket');
};

export const addFoodToBasket = (query: string) => {
  return async (dispatch: Dispatch) => {
    const response = await basketService.getFoodForBasket(query);

    if (response.status === 400) {
      throw new Error(response.status.toString());
    }

    const foods = response.data;

    saveBasketToStorage({foods});
    dispatch({type: basketActionTypes.ADD_FOOD_TO_BASKET, foods});
  };
};

export const changeLoggingType = (isSingleFood: boolean) => {
  saveBasketToStorage({isSingleFood});
  return {type: basketActionTypes.CHANGE_LOGGING_TYPE, isSingleFood};
};

export const changeRecipeName = (newName: string) => {
  saveBasketToStorage({newName});
  return {type: basketActionTypes.CHANGE_RECIPE_NAME, newName};
};

export const changeRecipeServings = (servings: string) => {
  saveBasketToStorage({servings});
  return {type: basketActionTypes.CHANGE_RECIPE_SERVINGS, servings};
};

export const changeRecipeBrand = (recipeBrand: string) => {
  saveBasketToStorage({recipeBrand});
  return {type: basketActionTypes.CHANGE_RECIPE_BRAND, recipeBrand};
};

export const changeConsumedAt = (consumed_at: string) => {
  saveBasketToStorage({consumed_at});
  return {type: basketActionTypes.CHANGE_CONSUMED_AT, consumed_at};
};

export const changeMealType = (newMealType: string) => {
  saveBasketToStorage({newMealType});
  return {type: basketActionTypes.CHANGE_MEAL_TYPE, newMealType};
};

export const mergeBasket = (basket: any) => {
  return {type: basketActionTypes.MERGE_BASKET, basket};
};

export const updateFoodAtBasket = (foodObj: any, index: number) => {
  return async (dispatch: Dispatch, useState: any) => {
    const oldFoods = useState().basket.foods;
    const newFoods = [...oldFoods];
    newFoods[index] = foodObj;
    dispatch({type: basketActionTypes.UPDATE_BASKET_FOODS, foods: newFoods});
  };
};

export const reset = () => {
  resetBasketStorage();
  return {type: basketActionTypes.RESET};
};
