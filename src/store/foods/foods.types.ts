import {FoodProps} from 'store/userLog/userLog.types';

export enum foodsActionTypes {
  GET_ALL_SUGGESTED_FOOD = 'GET_ALL_SUGGESTED_FOOD',
  GET_GROCERIES = 'GET_GROCERIES',
  GET_HISTORY_FOODS = 'GET_HISTORY_FOODS',
  GET_FOOD_BY_QR_CODE = 'GET_FOOD_BY_QR_CODE',
  CLEAR_SCANED_FOOD = 'CLEAR_SCANED_FOOD',
  GET_RESTORANTS = 'GET_RESTORANTS',
  GET_RESTORANTS_FOODS = 'GET_RESTORANTS_FOODS',
  GET_RESTORANTS_WITH_CALC = 'GET_RESTORANTS_WITH_CALC',
  SET_TRACK_TAB = 'SET_TRACK_TAB',
  GET_NIX_RESTORANTS_FOODS = 'GET_NIX_RESTORANTS_FOODS',
  CLEAR_RESTORANTS_FOODS = 'CLEAR_RESTORANTS_FOODS',
  CLEAR_GROCERY_FOODS = 'CLEAR_GROCERY_FOODS',
  CLEAR_HISTORY_FOODS = 'CLEAR_HISTORY_FOODS',
  SET_SELECTED_RESTAURANT = 'SET_SELECTED_RESTAURANT',
  SET_SEARCH_QUERY_RESTAURANT_FOODS = 'SET_SEARCH_QUERY_RESTAURANT_FOODS',
  CLEAR = 'CLEAR',
}

export interface SuggestedFoodProps {
  brand_name: string;
  created_at: string;
  created_by: string;
  created_by_name: string;
  description: string;
  id: string;
  image_thumb: string;
  item_name: string;
  updated_at: string | null;
  updated_by: string | null;
  updated_by_name: string | null;
  url: string;
}

export interface RestaurantsProps {
  id: string;
  logo: string;
  name: string;
}

export interface RestaurantsWithCalcProps {
  brand_id: string;
  brand_keywords: string;
  brand_logo: string;
  desktop_calculator_url: string | null;
  mobile_calculator_url: string | null;
  proper_brand_name: string;
}

export enum TrackTabs {
  FREEFORM = 'Freeform',
  RESTAURANTS = 'Restaurants',
  GROCERY = 'Grocery',
  HISTORY = 'History',
}

export type SelectedRestaurant =
  | RestaurantsProps
  | RestaurantsWithCalcProps
  | null;

export interface FoodsState {
  foodFindByQRcode:
    | FoodProps
    | {
        food_name: string;
        photo: {thumb: null};
      }
    | null;
  suggested_foods: Array<SuggestedFoodProps>;
  groceries: Array<FoodProps>;
  historyFoods: Array<FoodProps>;
  restaurants: Array<RestaurantsProps>;
  restaurantsWithCalc: Array<RestaurantsWithCalcProps>;
  restaurantFoods: Array<FoodProps>;
  currentTrackTab: TrackTabs;
  nixRestaurantFoodsTotal: number;
  selectedRestaurant: SelectedRestaurant;
  searchQueryRestaurantFoods: string;
}

export type getAllSuggestedFoodAction = {
  type: foodsActionTypes.GET_ALL_SUGGESTED_FOOD;
  suggested_foods: SuggestedFoodProps[];
};
export type getGroceriesAction = {
  type: foodsActionTypes.GET_GROCERIES;
  groceries: FoodProps[];
  addValues: boolean;
};
export type getHistoryFoodsAction = {
  type: foodsActionTypes.GET_HISTORY_FOODS;
  historyFoods: FoodProps[];
};
export type getFoodByQRCodeAction = {
  type: foodsActionTypes.GET_FOOD_BY_QR_CODE;
  foodFindByQRcode:
    | FoodProps
    | {
        food_name: string;
        photo: {thumb: null};
      };
};
export type clearScanedFoodAction = {
  type: foodsActionTypes.CLEAR_SCANED_FOOD;
};
export type getRestaurantsAction = {
  type: foodsActionTypes.GET_RESTORANTS;
  restaurants: Array<RestaurantsProps>;
};
export type getRestaurantFoodsAction = {
  type: foodsActionTypes.GET_RESTORANTS_FOODS;
  restaurantFoods: Array<FoodProps>;
};
export type getRestaurantsWithCalcAction = {
  type: foodsActionTypes.GET_RESTORANTS_WITH_CALC;
  restaurantsWithCalc: Array<RestaurantsWithCalcProps>;
};
export type setTrackTabAction = {
  type: foodsActionTypes.SET_TRACK_TAB;
  payload: TrackTabs;
};
export type getNixRestaurantsFoodsAction = {
  type: foodsActionTypes.GET_NIX_RESTORANTS_FOODS;
  restaurantFoods: FoodProps[];
  nixRestaurantFoodsTotal: number;
};
export type clearRestaurantsFoodsAction = {
  type: foodsActionTypes.CLEAR_RESTORANTS_FOODS;
};
export type clearGroceryFoodsAction = {
  type: foodsActionTypes.CLEAR_GROCERY_FOODS;
};
export type clearHistoryFoodsAction = {
  type: foodsActionTypes.CLEAR_HISTORY_FOODS;
};
export type setSelectedRestaurantAction = {
  type: foodsActionTypes.SET_SELECTED_RESTAURANT;
  payload: SelectedRestaurant;
};
export type setSearchQueryRestaurantFoodsAction = {
  type: foodsActionTypes.SET_SEARCH_QUERY_RESTAURANT_FOODS;
  payload: string;
};
export type clearFoodsAction = {
  type: foodsActionTypes.CLEAR;
  payload: string;
};

export type FoodsActions =
  | getAllSuggestedFoodAction
  | getGroceriesAction
  | getHistoryFoodsAction
  | getFoodByQRCodeAction
  | clearScanedFoodAction
  | getRestaurantsAction
  | getRestaurantsWithCalcAction
  | getRestaurantFoodsAction
  | setTrackTabAction
  | getNixRestaurantsFoodsAction
  | clearRestaurantsFoodsAction
  | clearGroceryFoodsAction
  | clearHistoryFoodsAction
  | setSelectedRestaurantAction
  | setSearchQueryRestaurantFoodsAction
  | clearFoodsAction;
