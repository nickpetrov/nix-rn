import {FoodProps} from 'store/userLog/userLog.types';

export enum autoCompleteActionTypes {
  UPDATE_SEARCH_RESULTS = 'UPDATE_SEARCH_RESULTS',
  SHOW_SUGGESTED_FOODS = 'SHOW_SUGGESTED_FOODS',
  SET_SEARCH_VALUE = 'SET_SEARCH_VALUE',
  CLEAR = 'CLEAR',
}

export enum searchSections {
  ALL = 'ALL',
  YOUR_FOODS = 'YOUR FOODS',
  RECIPES = 'RECIPES',
  SELF = 'SELF',
  COMMON = 'COMMON FOODS',
  BRANDED = 'BRANDED FOODS',
  HISTORY = 'HISTORY',
  SUGGESTED = 'SUGGESTED',
  FREEFORM = 'FREEFORM',
}

export interface PhotoProps {
  thumb: string;
  is_user_uploaded: boolean;
  highres: string | null;
}

// export interface AutoCompleteFoodProps {
//   id: number;
//   food_name: string;
//   locale: string;
//   photo: PhotoProps;
//   region: number;
//   serving_qty: number;
//   serving_unit: string;
//   brand_name?: string | null;
//   brand_name_item_name?: string;
//   brand_type?: number;
//   nf_calories?: number;
//   nix_brand_id?: string | null;
//   nix_item_id?: string | null;
//   uuid?: string;
//   common_type?: string | null;
//   tag_id?: string;
//   tag_name?: string;
//   consumed_at?: string;
// }

export type SearchResponse = {
  self: Array<FoodProps>;
  common: Array<FoodProps>;
  branded: Array<FoodProps>;
  suggested: Array<FoodProps>;
};

export interface AutoCompleteState extends SearchResponse {
  searchValue: string;
}

export type updateSearchResultsActionType = {
  type: autoCompleteActionTypes.UPDATE_SEARCH_RESULTS;
  payload: SearchResponse;
};

export type setSearchValueAcionType = {
  type: autoCompleteActionTypes.SET_SEARCH_VALUE;
  payload: string;
};

export type showSuggestedFoodsActionType = {
  type: autoCompleteActionTypes.SHOW_SUGGESTED_FOODS;
  payload: FoodProps[];
};

export type autocompleteClearActionType = {
  type: autoCompleteActionTypes.CLEAR;
};

export type AutoCompleteActionTypes =
  | updateSearchResultsActionType
  | setSearchValueAcionType
  | showSuggestedFoodsActionType
  | autocompleteClearActionType;
