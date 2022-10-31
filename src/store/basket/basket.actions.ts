// utils
import AsyncStorage from '@react-native-async-storage/async-storage';
import {v4 as uuidv4} from 'uuid';
import _ from 'lodash';
import moment from 'moment-timezone';

// api services
import basketService from 'api/basketService';
import autoCompleteService from 'api/autoCompleteService';

// helpers
import {multiply} from 'helpers/multiply';
import nixApiDataUtilites, {
  addGramsToAltMeasures,
} from 'helpers/nixApiDataUtilites/nixApiDataUtilites';

// types
import {Dispatch} from 'redux';
import {basketActionTypes, BasketState} from './basket.types';
import {RootState} from '../index';
import {FoodProps} from 'store/userLog/userLog.types';
import recipesService from 'api/recipeService';
import baseService from 'api/baseService';

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

// add by name
export const addFoodToBasket = (query: string) => {
  return async (dispatch: Dispatch) => {
    const response = await basketService.getFoodForBasket(query);

    if (response.status === 400 || response.status === 404) {
      throw response;
    } else {
      const result = response.data;
      const foods = result.foods.map((item: FoodProps) => {
        if (item.alt_measures) {
          const temp = {
            serving_weight: item.serving_weight_grams,
            seq: null,
            measure: item.serving_unit,
            qty: item.serving_qty,
          };
          item.alt_measures.unshift(temp);
          item = addGramsToAltMeasures(item);
        }
        return {
          ...item,
          basketId: uuidv4(),
        };
      });
      saveBasketToStorage({foods: foods});
      dispatch({type: basketActionTypes.ADD_FOOD_TO_BASKET, foods: foods});
      return foods;
    }
  };
};

// add by id
export const addFoodToBasketById = (id: string) => {
  return async (dispatch: Dispatch) => {
    const response = await autoCompleteService.getFoodById(id);

    if (response.status === 400 || response.status === 404) {
      throw response;
    } else {
      const food = response.data.foods[0];
      if (food.id) {
        delete food.id;
      }
      if (food.note) {
        delete food.note;
      }
      food.consumed_at = moment().format();
      food.basketId = uuidv4();
      saveBasketToStorage({foods: [food]});
      dispatch({type: basketActionTypes.ADD_FOOD_TO_BASKET, foods: [food]});
      return [food];
    }
  };
};

// add exist food
export const addExistFoodToBasket = (foods: Array<Partial<FoodProps>>) => {
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
    return newFoods;
  };
};

// add custom food to basket
export const addCustomFoodToBasket = (foods: Array<Partial<FoodProps>>) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const timezone = useState().auth.userData.timezone;
    const newFoods = foods.map(item => {
      const serving_qty = item.serving_qty || 1;
      const foodToLog = _.cloneDeep(item);
      delete foodToLog.id;
      //remove public id because the log endpoint not accepting this property.
      delete foodToLog.public_id;

      // need to do this for top level
      const nf = nixApiDataUtilites.convertFullNutrientsToNfAttributes(
        foodToLog.full_nutrients,
      );
      const accepted = [
        'nf_calories',
        'nf_total_fat',
        'nf_saturated_fat',
        'nf_cholesterol',
        'nf_sodium',
        'nf_total_carbohydrate',
        'nf_dietary_fiber',
        'nf_sugars',
        'nf_protein',
        'nf_potassium',
        'nf_p',
      ];
      const keep = _.pick(nf, accepted);
      _.extend(foodToLog, keep);
      const scaled_food = multiply(foodToLog, 1 / serving_qty, 1);
      return {
        ...scaled_food,
        consumed_at:
          moment().format('YYYY-MM-DDTHH:mm:ss') +
          moment.tz(timezone).format('Z'),
        basketId: uuidv4(),
      };
    });
    dispatch({type: basketActionTypes.ADD_FOOD_TO_BASKET, foods: newFoods});
    return newFoods;
  };
};

// add exist food
export const addRecipeToBasket = (id: string) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const response = await recipesService.getRecipeById(id);
    const recipe = response.data;
    if (recipe) {
      _.forEach(recipe.ingredients, function (foodObj) {
        if (foodObj.alt_measures) {
          const temp = {
            serving_weight: foodObj.serving_weight_grams,
            seq: null,
            measure: foodObj.serving_unit,
            qty: foodObj.serving_qty,
          };
          foodObj.alt_measures.unshift(temp);
        }
      });

      const serving_qty = recipe.serving_qty;

      const recipeToLog = _.cloneDeep(recipe);

      // need to do this for top level as well as each ingredient
      const nf = nixApiDataUtilites.convertFullNutrientsToNfAttributes(
        recipeToLog.full_nutrients,
      );
      const accepted = [
        'nf_calories',
        'nf_total_fat',
        'nf_saturated_fat',
        'nf_cholesterol',
        'nf_sodium',
        'nf_total_carbohydrate',
        'nf_dietary_fiber',
        'nf_sugars',
        'nf_protein',
        'nf_potassium',
        'nf_p',
      ];
      const keep = _.pick(nf, accepted);
      _.extend(recipeToLog, keep);

      _.forEach(recipeToLog.ingredients, function (ingredient) {
        const ing_nf = nixApiDataUtilites.convertFullNutrientsToNfAttributes(
          ingredient.full_nutrients,
        );
        const ing_keep = _.pick(ing_nf, accepted);
        _.extend(ingredient, ing_keep);
      });

      //only want to log 1 serving
      const scaled_recipe = multiply(recipeToLog, 1 / serving_qty, 1);
      const timezone = useState().auth.userData.timezone;
      const newFoods = scaled_recipe.ingredients.map((item: FoodProps) => ({
        ...item,
        consumed_at:
          moment().format('YYYY-MM-DDTHH:mm:ss') +
          moment.tz(timezone).format('Z'),
        basketId: uuidv4(),
      }));
      dispatch({type: basketActionTypes.ADD_FOOD_TO_BASKET, foods: newFoods});
      return scaled_recipe;
    } else {
      throw response;
    }
  };
};

// add branded food
export const addBrandedFoodToBasket = (id: string) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const response = await baseService.getBrandedFoodsById(id);
    let food = response.data.foods[0];
    if (food) {
      if (!food.alt_measures && food.serving_weight_grams) {
        food.alt_measures = [
          {
            measure: food.serving_unit,
            qty: food.serving_qty,
            seq: null,
            serving_weight: food.serving_weight_grams,
          },
        ];
        food = addGramsToAltMeasures(food);
      }
      const timezone = useState().auth.userData.timezone;
      food = {
        ...food,
        consumed_at:
          moment().format('YYYY-MM-DDTHH:mm:ss') +
          moment.tz(timezone).format('Z'),
        basketId: uuidv4(),
      };
      dispatch({type: basketActionTypes.ADD_FOOD_TO_BASKET, foods: [food]});
      return food;
    }
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
  return async (dispatch: Dispatch) => {
    resetBasketStorage();
    dispatch({type: basketActionTypes.RESET});
  };
};
