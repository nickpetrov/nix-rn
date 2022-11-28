import {Dispatch} from 'redux';
import {
  clearGroceryFoodsAction,
  clearHistoryFoodsAction,
  clearRestaurantsFoodsAction,
  clearScanedFoodAction,
  foodsActionTypes,
  getAllSuggestedFoodAction,
  getFoodByQRCodeAction,
  getGroceriesAction,
  getHistoryFoodsAction,
  getNixRestaurantsFoodsAction,
  getRestaurantFoodsAction,
  getRestaurantsAction,
  getRestaurantsWithCalcAction,
  SelectedRestaurant,
  setSearchQueryRestaurantFoodsAction,
  setSelectedRestaurantAction,
  setTrackTabAction,
  TrackTabs,
} from './foods.types';
import baseService from 'api/baseService';
import autoCompleteService, {
  InstantQueryDataProps,
} from 'api/autoCompleteService';
import moment from 'moment-timezone';
import nixApiDataUtilites from 'helpers/nixApiDataUtilites/nixApiDataUtilites';
import {addExistFoodToBasket} from 'store/basket/basket.actions';
import {grocery_photo_upload} from 'config/index';
import nixService from 'api/nixService';
import {FoodProps} from 'store/userLog/userLog.types';
import {addFoodToBasketAction} from 'store/basket/basket.types';

export const getFoodByQRcode = (
  barcode: string,
  force_photo_upload?: boolean,
) => {
  return async (
    dispatch: Dispatch<getFoodByQRCodeAction | addFoodToBasketAction>,
  ) => {
    try {
      const response = await baseService.getFoodByQRcode(barcode);

      const foods = response.data.foods;

      if (foods && foods[0]) {
        dispatch({
          type: foodsActionTypes.GET_FOOD_BY_QR_CODE,
          foodFindByQRcode: foods[0],
        });

        foods[0].upc = barcode;
        if (!foods[0].alt_measures && !!foods[0].serving_weight_grams) {
          foods[0] = nixApiDataUtilites.addGramsToAltMeasures(foods[0]);
        } else if (!!foods[0].alt_measures && !!foods[0].serving_weight_grams) {
          let temp = {
            serving_weight: foods[0].serving_weight_grams,
            seq: null,
            measure: foods[0].serving_unit,
            qty: foods[0].serving_qty,
          };
          foods[0].alt_measures.unshift(temp);
          foods[0] = nixApiDataUtilites.addGramsToAltMeasures(foods[0]);
        }

        // if barcode scanned from 'report' popup - don't add food to the basket.
        if (!force_photo_upload) {
          dispatch<any>(addExistFoodToBasket(foods));
        }

        // check if enough time passed to ask user/agent to update food

        let foodNeedsUpdate;
        if (foods[0] && foods[0].updated_at) {
          foodNeedsUpdate = moment(foods[0].updated_at)
            .add(
              grocery_photo_upload.food_update_time.quantity,
              grocery_photo_upload.food_update_time.unit,
            )
            .isBefore(moment());
        }

        if (force_photo_upload) {
          foodNeedsUpdate = true;
        }

        if (!foodNeedsUpdate) {
          return null;
        } else {
          return foods;
        }
      }
    } catch (error: any) {
      if (error.status === 404) {
        dispatch({
          type: foodsActionTypes.GET_FOOD_BY_QR_CODE,
          foodFindByQRcode: {
            food_name: `Unrecognised food barcode: ${barcode}`,
            photo: {thumb: null},
          },
        });
        throw error;
      }
    }
  };
};

export const clearSnanedFood = (): clearScanedFoodAction => {
  return {type: foodsActionTypes.CLEAR_SCANED_FOOD};
};

export const getSuggestedFoods = () => {
  return async (dispatch: Dispatch<getAllSuggestedFoodAction>) => {
    try {
      const response = await baseService.getSuggestedFood();

      const result = response.data;
      // if (__DEV__) {
      //   console.log('all suggested foods', result.products);
      // }
      if (result.products) {
        dispatch({
          type: foodsActionTypes.GET_ALL_SUGGESTED_FOOD,
          suggested_foods: result.products,
        });
      }
    } catch (error) {
      throw error;
    }
  };
};

export const getGroceries = (query: string, start?: number, end?: number) => {
  return async (dispatch: Dispatch<getGroceriesAction>) => {
    try {
      const response = await nixService.getgetGroceryFoods(query, start, end);

      const result = response.data;
      // if (__DEV__) {
      //   console.log('groceries', result.branded);
      // }
      if (result) {
        dispatch({
          type: foodsActionTypes.GET_GROCERIES,
          groceries: result.hits.map(
            (item: {fields: FoodProps}) => item.fields,
          ),
          addValues: !!start,
        });
      }
    } catch (error) {
      throw error;
    }
  };
};
export const getHistoryFoods = (data: InstantQueryDataProps) => {
  return async (dispatch: Dispatch<getHistoryFoodsAction>) => {
    try {
      const response = await autoCompleteService.getTrackInstant(data);

      const result = response.data;
      // if (__DEV__) {
      //   console.log('historyFoods', result.self);
      // }
      if (result.self) {
        dispatch({
          type: foodsActionTypes.GET_HISTORY_FOODS,
          // bug where serving_qty in db is null in self foods. filter out these results first
          historyFoods: result.self.filter(item => item.serving_qty),
        });
      }
    } catch (error) {
      throw error;
    }
  };
};
export const getRestorants = () => {
  return async (dispatch: Dispatch<getRestaurantsAction>) => {
    try {
      const response = await baseService.getBrandRestorants();

      const result = response.data;
      // if (__DEV__) {
      //   console.log('restaurants', result);
      // }
      if (result) {
        dispatch({
          type: foodsActionTypes.GET_RESTORANTS,
          restaurants: result.filter(item => item.name),
        });
      }
    } catch (error) {
      throw error;
    }
  };
};

export const getRestorantsWithCalc = () => {
  return async (dispatch: Dispatch<getRestaurantsWithCalcAction>) => {
    try {
      const response = await baseService.getRestorantsWithCalc();

      const result = response.data;
      // if (__DEV__) {
      //   console.log('restaurants with calc', result);
      // }
      if (result) {
        dispatch({
          type: foodsActionTypes.GET_RESTORANTS_WITH_CALC,
          restaurantsWithCalc: result.filter(item => item.proper_brand_name),
        });
      }
    } catch (error) {
      throw error;
    }
  };
};
export const getRestorantsFoods = (data: InstantQueryDataProps) => {
  return async (dispatch: Dispatch<getRestaurantFoodsAction>) => {
    try {
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
    } catch (error) {
      throw error;
    }
  };
};
export const getNixRestorantsFoods = (
  query: string,
  brand_id: string,
  start?: number,
  step?: number,
) => {
  return async (dispatch: Dispatch<getNixRestaurantsFoodsAction>) => {
    try {
      const response = await nixService.getRestaurantFoods(
        query,
        brand_id,
        start,
        step,
      );

      const result = response.data;
      if (__DEV__) {
        console.log('nix restaurants foods', result);
      }
      if (result && result.hits && result.hits.length) {
        dispatch({
          type: foodsActionTypes.GET_NIX_RESTORANTS_FOODS,
          restaurantFoods: result.hits.map(
            (item: {fields: FoodProps}) => item.fields,
          ),
          nixRestaurantFoodsTotal: result.total,
        });
      }
    } catch (error) {
      throw error;
    }
  };
};

export const setTrackTab = (tab: TrackTabs): setTrackTabAction => {
  return {
    type: foodsActionTypes.SET_TRACK_TAB,
    payload: tab,
  };
};
export const clearRestaurantsFoods = (): clearRestaurantsFoodsAction => {
  return {
    type: foodsActionTypes.CLEAR_RESTORANTS_FOODS,
  };
};
export const clearGroceryFoods = (): clearGroceryFoodsAction => {
  return {
    type: foodsActionTypes.CLEAR_GROCERY_FOODS,
  };
};
export const clearHistoryFoods = (): clearHistoryFoodsAction => {
  return {
    type: foodsActionTypes.CLEAR_HISTORY_FOODS,
  };
};
export const setSearchQueryRestaurant = (
  query: string,
): setSearchQueryRestaurantFoodsAction => {
  return {
    type: foodsActionTypes.SET_SEARCH_QUERY_RESTAURANT_FOODS,
    payload: query,
  };
};
export const setSelectedRestaurant = (
  restaurant: SelectedRestaurant,
): setSelectedRestaurantAction => {
  return {
    type: foodsActionTypes.SET_SELECTED_RESTAURANT,
    payload: restaurant,
  };
};
