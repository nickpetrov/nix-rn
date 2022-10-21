import {PhotoProps} from 'store/autoComplete/autoComplete.types';
import {FoodProps, NutrientProps} from 'store/userLog/userLog.types';

export enum recipesActionTypes {
  GET_RECIPES = 'GET_RECIPES',
  UPDATE_OR_CREATE_RECIPE = 'UPDATE_OR_CREATE_RECIPE',
  CLEAR = 'CLEAR',
}

export interface RecipeProps {
  cook_time_min: number | null;
  created_at: string;
  directions: string | null;
  full_nutrients: Array<NutrientProps>;
  id: string;
  ingredients: Array<FoodProps>;
  is_public: number;
  name: string;
  photo: PhotoProps;
  prep_time_min: number | null;
  public_id: string | null;
  sections: [];
  serving_qty: number;
  serving_unit: string;
  serving_weight_grams: number;
  source: number;
  updated_at: string;
  user_id: string;
  brand_name?: string;
}

export type UpdateRecipeProps = Omit<
  RecipeProps,
  | 'id'
  | 'updated_at'
  | 'created_at'
  | 'full_nutrients'
  | 'is_public'
  | 'photo'
  | 'public_id'
  | 'sections'
  | 'serving_weight_grams'
  | 'source'
  | 'user_id'
> &
  Partial<RecipeProps>;

export interface RecipesState {
  recipes: Array<RecipeProps>;
}
