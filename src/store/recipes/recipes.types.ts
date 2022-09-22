import {PhotoProps} from 'store/autoComplete/autoComplete.types';
import {NutrientProps} from 'store/basket/basket.types';
import {FoodProps} from 'store/userLog/userLog.types';

export enum recipesActionTypes {
  GET_RECIPES = 'GET_RECIPES',
  UPDATE_RECIPE = 'UPDATE_RECIPE',
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
}

export interface RecipesState {
  recipes: Array<RecipeProps>;
}
