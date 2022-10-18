// utils
import AsyncStorage from '@react-native-async-storage/async-storage';
import basketService from 'api/basketService';
import {v4 as uuidv4} from 'uuid';

// types
import {Dispatch} from 'redux';
import {basketActionTypes, BasketState} from './basket.types';
import {RootState} from '../index';
import {FoodProps} from 'store/userLog/userLog.types';
import moment from 'moment-timezone';

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
    saveBasketToStorage({foods: foods});
    dispatch({type: basketActionTypes.ADD_FOOD_TO_BASKET, foods: foods});
    return foods;
  };
};

export const addExistFoodToBasket = (foods: Array<FoodProps>) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const timezone = useState().auth.userData.timezone;
    const newFoods = foods.map(item => ({
      ...item,
      consumed_at:
        moment().format('YYYY-MM-DDTHH:mm:ss') +
        moment.tz(timezone).format('Z'),
      basketId: uuidv4(),
    }));
    dispatch({type: basketActionTypes.ADD_FOOD_TO_BASKET, foods: newFoods});
  };
};

export const deleteFoodFromBasket = (id: string) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const oldFoods = useState().basket.foods;
    let newFoods = [...oldFoods];
    newFoods = newFoods.filter(item => item.basketId !== id);
    let newBasket;
    if (newFoods.length === 1) {
      newBasket = {
        foods: newFoods,
        recipeName: '',
        servings: '1',
        isSingleFood: false,
        recipeBrand: '',
      };
      dispatch({
        type: basketActionTypes.MERGE_BASKET,
        payload: {
          recipeName: '',
          servings: '1',
          isSingleFood: false,
          recipeBrand: '',
        },
      });
    } else {
      newBasket = {foods: newFoods};
    }
    saveBasketToStorage(newBasket);
    dispatch({type: basketActionTypes.DELETE_FOOD_FROM_BASKET, id});
  };
};
export const mergeBasket = (basket: Partial<BasketState>) => {
  saveBasketToStorage(basket);
  return {type: basketActionTypes.MERGE_BASKET, payload: basket};
};
export const mergeBasketFromStorage = (basket: BasketState) => {
  return {type: basketActionTypes.MERGE_BASKET_FROM_STORAGE, basket};
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
