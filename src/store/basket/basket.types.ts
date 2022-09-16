import {PhotoProps} from '../autoComplete/autoComplete.types';
export enum basketActionTypes {
  ADD_FOOD_TO_BASKET = 'ADD_FOOD_TO_BASKET',
  CHANGE_LOGGING_TYPE = 'CHANGE_LOGGING_TYPE',
  CHANGE_RECIPE_NAME = 'CHANGE_RECIPE_NAME',
  CHANGE_RECIPE_SERVINGS = 'CHANGE_RECIPE_SERVINGS',
  CHANGE_RECIPE_BRAND = 'CHANGE_RECIPE_BRAND',
  CHANGE_CONSUMED_AT = 'CHANGE_CONSUMED_AT',
  CHANGE_MEAL_TYPE = 'CHANGE_MEAL_TYPE',
  MERGE_BASKET = 'MERGE_BASKET',
  UPDATE_BASKET_FOODS = 'UPDATE_BASKET_FOODS',
  RESET = 'RESET',
}

export enum mealTypes {
  Breakfast = 1,
  'AM Snack' = 2,
  Lunch = 3,
  'PM Snack' = 4,
  Dinner = 5,
  'Late Snack' = 6,
}

export interface MeasureProps {
  measure: string;
  qty: number;
  seq: number;
  serving_weight: number;
}

export interface NutrientProps {
  attr_id: number;
  value: number;
}

export interface TagProp {
  food_group: number;
  item: string;
  measure: MeasureProps | null;
  quantity: string;
  tag_id: number;
}

export interface BasketFoodProps {
  alt_measures: Array<MeasureProps>;
  brand_name: string | null;
  brick_code: string | null;
  class_code: string | null;
  consumed_at: string;
  food_name: string;
  full_nutrients: Array<NutrientProps>;
  lat: null;
  lng: null;
  meal_type: number;
  metadata: {
    is_raw_food: boolean;
  };
  ndb_no: number;
  nf_calories: number;
  nf_cholesterol: number;
  nf_dietary_fiber: number;
  nf_p: number;
  nf_potassium: number;
  nf_protein: number;
  nf_saturated_fat: number;
  nf_sodium: number;
  nf_sugars: number;
  nf_total_carbohydrate: number;
  nf_total_fat: number;
  nix_brand_id: number | null;
  nix_brand_name: string | null;
  nix_item_id: number | null;
  nix_item_name: string | null;
  serving_qty: number;
  serving_unit: string;
  serving_weight_grams: number;
  source: number;
  sub_recipe: null;
  tag_id: number | null;
  upc: null;
  tags: Array<TagProp>;
  photo: PhotoProps;
  uuid?: number | null;
  public_id?: number | null;
}

export interface BasketState {
  foods: Array<BasketFoodProps>;
  isSingleFood: boolean;
  recipeName: string;
  servings: string;
  consumed_at: string;
  meal_type: number;
}
