import {PhotoProps} from 'store/autoComplete/autoComplete.types';
import {FoodProps, NutrientProps} from 'store/userLog/userLog.types';

export enum recipesActionTypes {
  GET_RECIPES = 'GET_RECIPES',
  UPDATE_OR_CREATE_RECIPE = 'UPDATE_OR_CREATE_RECIPE',
  COPY_RECIPE = 'COPY_RECIPE',
  CREATE_RECIPE = 'CREATE_RECIPE',
  DELETE_RECIPE = 'DELETE_RECIPE',
  RECIPES_CLEAR = 'RECIPES_CLEAR',
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
  | 'directions'
> &
  Partial<RecipeProps>;

export interface RecipesState {
  recipes: Array<RecipeProps>;
  limit: number;
  offset: number;
  showMore: boolean;
}

export type getRecipesAction = {
  type: recipesActionTypes.GET_RECIPES;
  payload: {
    recipes: Array<RecipeProps>;
    offset: number;
  };
};
export type updateOrCreateRecipesAction = {
  type: recipesActionTypes.UPDATE_OR_CREATE_RECIPE;
  recipe: RecipeProps;
};
export type copyRecipeAction = {
  type: recipesActionTypes.COPY_RECIPE;
  payload: RecipeProps;
  clonedRecipeIndex: number;
};
export type createRecipeAction = {
  type: recipesActionTypes.CREATE_RECIPE;
  payload: RecipeProps;
};
export type deleteRecipeAction = {
  type: recipesActionTypes.DELETE_RECIPE;
  payload: string;
};
export type clearRecipeAction = {
  type: recipesActionTypes.RECIPES_CLEAR;
};

export type RecipesActions =
  | getRecipesAction
  | updateOrCreateRecipesAction
  | copyRecipeAction
  | createRecipeAction
  | deleteRecipeAction
  | clearRecipeAction;
