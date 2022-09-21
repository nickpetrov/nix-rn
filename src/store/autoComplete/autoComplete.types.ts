import {FoodProps} from 'store/userLog/userLog.types';

export enum autoCompleteActionTypes {
  UPDATE_SEARCH_RESULTS = 'UPDATE_SEARCH_RESULTS',
  SHOW_SUGGESTED_FOODS = 'SHOW_SUGGESTED_FOODS',
  CLEAR = 'CLEAR',
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

export interface AutoCompleteState {
  self: Array<FoodProps>;
  common: Array<FoodProps>;
  branded: Array<FoodProps>;
  suggested: Array<FoodProps>;
}
