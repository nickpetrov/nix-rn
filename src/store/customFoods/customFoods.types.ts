import {FoodProps} from 'store/userLog/userLog.types';
import {NutrientProps} from '../userLog/userLog.types';

export enum customFoodsActionTypes {
  GET_ALL_CUSTOM_FOOD = 'GET_ALL_CUSTOM_FOOD',
  UPDATE_OR_CREATE_CUSTOM_FOOD = 'UPDATE_OR_CREATE_CUSTOM_FOOD',
  DELETE_CUSTOM_FOOD = 'DELETE_CUSTOM_FOOD',
  CUSTOM_FOODS_CLEAR = 'CUSTOM_FOODS_CLEAR',
}

export type UpdateCustomFoodProps = {
  id?: string;
  food_name: string;
  nf_vitamin_a_dv?: string | null;
  nf_vitamin_c_dv?: string | null;
  nf_vitamin_d_dv?: string | null;
  nf_calcium_dv?: string | null;
  nf_iron_dv?: string | null;
  nf_calories: string | null;
  nf_cholesterol: string | null;
  nf_dietary_fiber: string | null;
  nf_p: string | null;
  nf_potassium: string | null;
  nf_protein: string | null;
  nf_saturated_fat: string | null;
  nf_sodium: string | null;
  nf_sugars: string | null;
  nf_total_carbohydrate: string | null;
  nf_total_fat: string | null;
  serving_qty: number;
  serving_unit: string;
  source?: number;
  source_key?: string | null;
  nf_calcium_mg?: string | null;
  nf_iron_mg?: string | null;
  full_nutrients?: Array<NutrientProps>;
};

export interface CustomFoodsState {
  foods: Array<FoodProps>;
}

export type getAllCustomFoodsAction = {
  type: customFoodsActionTypes.GET_ALL_CUSTOM_FOOD;
  foods: FoodProps[];
};
export type updateOrCreateCustomFoodsAction = {
  type: customFoodsActionTypes.UPDATE_OR_CREATE_CUSTOM_FOOD;
  food: FoodProps;
};
export type deleteCustomFoodsAction = {
  type: customFoodsActionTypes.DELETE_CUSTOM_FOOD;
  payload: string;
};
export type clearCustomFoodsAction = {
  type: customFoodsActionTypes.CUSTOM_FOODS_CLEAR;
};

export type CustomFoodsActions =
  | getAllCustomFoodsAction
  | updateOrCreateCustomFoodsAction
  | deleteCustomFoodsAction
  | clearCustomFoodsAction;
