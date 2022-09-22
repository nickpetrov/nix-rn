import {mealTypes} from 'store/basket/basket.types';
import {PhotoProps} from '../autoComplete/autoComplete.types';

export enum userLogActionTypes {
  GET_USER_FOODLOG = 'GET_USER_FOODLOG',
  ADD_FOOD_TO_LOG = 'ADD_FOOD_TO_LOG',
  GET_DAY_TOTALS = 'GET_DAY_TOTALS',
  CHANGE_SELECTED_DATE = 'CHANGE_SELECTED_DATE',
  SET_DAY_NOTES = 'SET_DAY_TOTALS',
  DELETE_FOOD_FROM_LOG = 'DELETE_FOOD_FROM_LOG',
  GET_USER_WEIGHT_LOG = 'GET_USER_WEIGHT_LOG',
  ADD_WEIGHT_LOG = 'ADD_WEIGHT_LOG',
  UPDATE_WEIGHT_LOG = 'UPDATE_WEIGHT_LOG',
  GET_USER_EXERCISES_LOG = 'GET_USER_EXERCISES_LOG',
  ADD_USER_EXERCISES_LOG = 'ADD_USER_EXERCISES_LOG',
  UPDATE_USER_EXERCISES_LOG = 'UPDATE_USER_EXERCISES_LOG',
}

export interface loggingOptionsProps {
  aggregate: string;
  single: boolean;
  meal_type: number;
  serving_qty: number;
  consumed_at: string;
}

export interface ExerciseProps {
  compendium_code: number;
  duration_min: number;
  id: string;
  met: number;
  name: string;
  nf_calories: number;
  photo: PhotoProps;
  share_key: string;
  tag_id: number;
  timestamp: string;
  user_input: string;
}

export interface WeightProps {
  id: string;
  kg: number;
  timestamp: string;
}

export interface TotalProps {
  avg_weight_kg: number;
  daily_carbs_pct: number;
  daily_fat_pct: number;
  daily_kcal_limit: number;
  daily_protein_pct: number;
  date: string;
  exercises_logged: null;
  foods_logged: number;
  notes: null;
  total_cal: number;
  total_cal_burned: number;
  total_carbs: number;
  total_fat: number;
  total_proteins: number;
  total_sodium: number;
  water_consumed_liter: null;
  weights_logged: number;
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

export interface FoodProps {
  alt_measures: Array<MeasureProps>;
  brand_name: string | null;
  consumed_at: string;
  food_name: string;
  full_nutrients: Array<NutrientProps>;
  id: string;
  lat: null;
  lng: null;
  meal_type: number;
  metadata: {is_raw_food: boolean};
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
  nix_brand_id: string | null;
  nix_brand_name: string | null;
  nix_item_id: string | null;
  nix_item_name: string | null;
  note: string | null;
  photo: PhotoProps;
  serving_qty: number;
  serving_unit: string;
  serving_weight_grams: number;
  share_key: string;
  source: number;
  tags: Array<TagProp>;
  upc: null;
  net_carbs: number;
  vitamin_d: number;
  caffeine: number;
  notes: string;
  locale: string;
  region: number;
  brand_name_item_name?: string;
  brand_type?: number;
  uuid?: string;
  common_type?: string | null;
  tag_id?: string;
  tag_name?: string;
  brick_code?: string;
  class_code?: string;
  sub_recipe?: string;
  public_id?: number | null;
}

export interface UserLogState {
  foods: Array<FoodProps>;
  totals: Array<TotalProps>;
  weights: Array<WeightProps>;
  exercises: Array<ExerciseProps>;
  selectedDate: string;
}

export type mealNameProps =
  | keyof typeof mealTypes
  | 'Snack'
  | 'Excercise'
  | 'Weigh-in'
  | 'Water';

export interface SortedFoodProps {
  mealName: mealNameProps;
  foods?: Array<FoodProps>;
  exercises?: Array<ExerciseProps>;
  weights?: Array<WeightProps>;
  water?: Array<any>;
  consumed_at?: string;
}
