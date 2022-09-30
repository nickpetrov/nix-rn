// utils
import AsyncStorage from '@react-native-async-storage/async-storage';
import basketService from 'api/basketService';
import {v4 as uuidv4} from 'uuid';

// types
import {Dispatch} from 'redux';
import {basketActionTypes, BasketState} from './basket.types';
import {RootState} from '../index';
import {FoodProps} from 'store/userLog/userLog.types';

const saveBasketToStorage = (basket: Partial<BasketState>) => {
  AsyncStorage.getItem('basket').then(data => {
    let prevData = data ? JSON.parse(data) : {};
    let newFoods = prevData?.foods ? [...prevData?.foods] : [];

    //TODO check when we will have time case when foods not array(if it possible left it if not -> refactoring)
    if (typeof basket?.foods === 'object') {
      newFoods = newFoods.concat(basket.foods);
    } else if (basket.foods) {
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

    const result = response.data;
    const foods = result.foods.map((item: FoodProps) => ({
      ...item,
      basketId: uuidv4(),
    }));
    console.log('add food to basket', foods);
    saveBasketToStorage({foods: foods});
    dispatch({type: basketActionTypes.ADD_FOOD_TO_BASKET, foods: foods});
    return foods;
  };
};

export const addExistFoodToBasket = (food: FoodProps) => {
  return {type: basketActionTypes.ADD_FOOD_TO_BASKET, foods: [food]};
};

export const changeLoggingType = (isSingleFood: boolean) => {
  saveBasketToStorage({isSingleFood});
  return {type: basketActionTypes.CHANGE_LOGGING_TYPE, isSingleFood};
};

export const changeRecipeName = (newName: string) => {
  saveBasketToStorage({recipeName: newName});
  return {type: basketActionTypes.CHANGE_RECIPE_NAME, newName};
};

export const changeRecipeServings = (servings: string) => {
  saveBasketToStorage({servings});
  return {type: basketActionTypes.CHANGE_RECIPE_SERVINGS, servings};
};

// export const changeRecipeBrand = (recipeBrand: string) => {
//   saveBasketToStorage({recipeBrand});
//   return {type: basketActionTypes.CHANGE_RECIPE_BRAND, recipeBrand};
// };

export const changeConsumedAt = (consumed_at: string) => {
  saveBasketToStorage({consumed_at});
  return {type: basketActionTypes.CHANGE_CONSUMED_AT, consumed_at};
};

export const changeMealType = (newMealType: number) => {
  saveBasketToStorage({meal_type: newMealType});
  return {type: basketActionTypes.CHANGE_MEAL_TYPE, newMealType};
};

export const deleteFoodFromBasket = (id: string) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const oldFoods = useState().basket.foods;
    let newFoods = [...oldFoods];
    console.log(newFoods);
    console.log(id);
    newFoods = newFoods.filter(item => item.id !== id);
    saveBasketToStorage({foods: newFoods});
    dispatch({type: basketActionTypes.DELETE_FOOD_FROM_BASKET, id});
  };
};
export const mergeBasket = (basket: BasketState) => {
  return {type: basketActionTypes.MERGE_BASKET, basket};
};

export const updateFoodAtBasket = (foodObj: FoodProps, index: number) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const oldFoods = useState().basket.foods;
    const newFoods = [...oldFoods];
    newFoods[index] = foodObj;
    saveBasketToStorage({foods: newFoods});
    dispatch({type: basketActionTypes.UPDATE_BASKET_FOODS, foods: newFoods});
  };
};

export const reset = () => {
  resetBasketStorage();
  return {type: basketActionTypes.RESET};
};
