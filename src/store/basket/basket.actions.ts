// utils
import {v4 as uuidv4} from 'uuid';
import _ from 'lodash';
import moment from 'moment-timezone';
import {captureException} from '@sentry/react-native';
// @ts-ignore
import nutritionixApiDataUtilities from 'nutritionix-api-data-utilities';

// api services
import basketService from 'api/basketService';
import autoCompleteService from 'api/autoCompleteService';

// helpers
import {multiply} from 'helpers/multiply';
import {addGramsToAltMeasures} from 'helpers/nixApiDataUtilites/nixApiDataUtilites';

// types
import {Dispatch} from 'redux';
import {
  addFoodToBasketAction,
  basketActionTypes,
  BasketState,
  deleteFoodFromBasketAction,
  mergeBasketAction,
  resetBasketAction,
  updateBasketFoodAction,
} from './basket.types';
import {RootState} from '../index';
import {FoodProps} from 'store/userLog/userLog.types';
import recipesService from 'api/recipeService';
import baseService from 'api/baseService';

// add by name
export const addFoodToBasket = (query: string) => {
  return async (
    dispatch: Dispatch<addFoodToBasketAction>,
    useState: () => RootState,
  ) => {
    const timezone = useState().auth.userData.timezone;
    try {
      const response = await basketService.getFoodForBasket(query);

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
          consumed_at:
            moment().format('YYYY-MM-DDTHH:mm:ss') +
            moment.tz(timezone).format('Z'),
          basketId: uuidv4(),
        };
      });
      dispatch({type: basketActionTypes.ADD_FOOD_TO_BASKET, foods: foods});
      return foods;
    } catch (err: any) {
      if (err?.status !== 404 && err?.status !== 0) {
        captureException(err);
      }
      throw err;
    }
  };
};

// add by id
export const addFoodToBasketById = (id: string) => {
  return async (
    dispatch: Dispatch<addFoodToBasketAction>,
    useState: () => RootState,
  ) => {
    const timezone = useState().auth.userData.timezone;
    try {
      const response = await autoCompleteService.getFoodById(id);

      const food = response.data.foods[0];

      if (food) {
        if (food?.id) {
          delete food.id;
        }
        if (food?.note) {
          delete food.note;
        }
        food.consumed_at =
          moment().format('YYYY-MM-DDTHH:mm:ss') +
          moment.tz(timezone).format('Z');
        food.basketId = uuidv4();
        dispatch({type: basketActionTypes.ADD_FOOD_TO_BASKET, foods: [food]});
        return [food];
      } else {
        throw new Error("Can't find food by this id");
      }
    } catch (err: any) {
      if (err?.message !== "Can't find food by this id") {
        captureException(err);
      }
      throw err;
    }
  };
};

// add exist food
export const addExistFoodToBasket = (foods: Array<Partial<FoodProps>>) => {
  return async (
    dispatch: Dispatch<addFoodToBasketAction>,
    useState: () => RootState,
  ) => {
    const timezone = useState().auth.userData.timezone;
    const clonedFoods = _.cloneDeep(foods);
    const newFoods = clonedFoods.map(item => {
      if (!item.full_nutrients && !item.alt_measures) {
        item = nutritionixApiDataUtilities.convertV1ItemToTrackFood(item);
        if (!item.alt_measures) {
          if (item.serving_weight_grams) {
            item.alt_measures = [
              {
                measure: item.serving_unit as string,
                qty: item.serving_qty as number,
                seq: null,
                serving_weight: item.serving_weight_grams,
              },
              {
                measure: 'g',
                qty: 1,
                seq: 104,
                serving_weight: 1,
              },
            ];
          }
        }
      } else {
        delete item.id;
      }

      if (!item.serving_qty) {
        item.serving_qty = 1;
      } else {
        item.serving_qty = _.round(+item.serving_qty, 2);
      }

      if (!item.serving_unit) {
        item.serving_unit = 'Serving';
      }

      return {
        ...item,
        consumed_at:
          moment().format('YYYY-MM-DDTHH:mm:ss') +
          moment.tz(timezone).format('Z'),
        basketId: uuidv4(),
      };
    });
    dispatch({
      type: basketActionTypes.ADD_FOOD_TO_BASKET,
      foods: newFoods as FoodProps[],
    });
    return newFoods;
  };
};

// add custom food to basket
export const addCustomFoodToBasket = (foods: Array<Partial<FoodProps>>) => {
  return async (
    dispatch: Dispatch<addFoodToBasketAction>,
    useState: () => RootState,
  ) => {
    const timezone = useState().auth.userData.timezone;
    const newFoods = foods.map(item => {
      const serving_qty = item.serving_qty || 1;
      const foodToLog = _.cloneDeep(item);
      delete foodToLog.id;
      //remove public id because the log endpoint not accepting this property.
      delete foodToLog.public_id;

      // need to do this for top level
      const nf = nutritionixApiDataUtilities.convertFullNutrientsToNfAttributes(
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
      const foodToLogWithNeedField = _.pick(foodToLog, [
        'food_name',
        'full_nutrients',
        'photo',
        'serving_qty',
        'serving_unit',
        'serving_weight_grams',
      ]);
      _.extend(foodToLogWithNeedField, keep);
      const scaled_food = multiply(foodToLogWithNeedField, 1 / serving_qty, 1);
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
  return async (
    dispatch: Dispatch<addFoodToBasketAction>,
    useState: () => RootState,
  ) => {
    try {
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
        const nf =
          nutritionixApiDataUtilities.convertFullNutrientsToNfAttributes(
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
          const ing_nf =
            nutritionixApiDataUtilities.convertFullNutrientsToNfAttributes(
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
      }
    } catch (err: any) {
      if (err?.status !== 0) {
        captureException(err);
      }
      throw err;
    }
  };
};

// add branded food
export const addBrandedFoodToBasket = (id: string) => {
  return async (
    dispatch: Dispatch<addFoodToBasketAction>,
    useState: () => RootState,
  ) => {
    try {
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
    } catch (err: any) {
      if (err?.status !== 0) {
        captureException(err);
      }
      console.log(err);
    }
  };
};

export const deleteFoodFromBasket = (id: string) => {
  return async (dispatch: Dispatch<deleteFoodFromBasketAction>) => {
    dispatch({type: basketActionTypes.DELETE_FOOD_FROM_BASKET, id});
  };
};
export const mergeBasket = (
  basket: Partial<BasketState>,
): mergeBasketAction => {
  return {type: basketActionTypes.MERGE_BASKET, payload: basket};
};

export const updateFoodAtBasket = (foodObj: FoodProps, index: number) => {
  return async (
    dispatch: Dispatch<updateBasketFoodAction>,
    useState: () => RootState,
  ) => {
    const oldFoods = useState().basket.foods;
    const newFoods = [...oldFoods];
    newFoods[index] = foodObj;
    dispatch({type: basketActionTypes.UPDATE_BASKET_FOODS, foods: newFoods});
  };
};

export const reset = () => {
  return async (dispatch: Dispatch<resetBasketAction>) => {
    dispatch({type: basketActionTypes.BASKET_RESET});
  };
};

export const clearBasket = (): resetBasketAction => {
  return {type: basketActionTypes.BASKET_RESET};
};
