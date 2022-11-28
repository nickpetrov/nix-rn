import {FoodProps} from 'store/userLog/userLog.types';

export enum autoCompleteActionTypes {
  UPDATE_SEARCH_RESULTS = 'UPDATE_SEARCH_RESULTS',
  SHOW_SUGGESTED_FOODS = 'SHOW_SUGGESTED_FOODS',
  SET_SEARCH_VALUE = 'SET_SEARCH_VALUE',
  AUTOCOMPLETE_CLEAR = 'AUTOCOMPLETE_CLEAR',
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

export type updateSearchResultsAction = {
  type: autoCompleteActionTypes.UPDATE_SEARCH_RESULTS;
  payload: SearchResponse;
};

export type setSearchValueAcion = {
  type: autoCompleteActionTypes.SET_SEARCH_VALUE;
  payload: string;
};

export type showSuggestedFoodsAction = {
  type: autoCompleteActionTypes.SHOW_SUGGESTED_FOODS;
  payload: FoodProps[];
};

export type autocompleteClearAction = {
  type: autoCompleteActionTypes.AUTOCOMPLETE_CLEAR;
};

export type AutoCompleteActions =
  | updateSearchResultsAction
  | setSearchValueAcion
  | showSuggestedFoodsAction
  | autocompleteClearAction;
