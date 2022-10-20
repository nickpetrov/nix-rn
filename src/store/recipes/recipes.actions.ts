import recipesService from 'api/recipeService';
import {Dispatch} from 'redux';
import {recipesActionTypes, UpdateRecipeProps} from './recipes.types';

export const getRecipes = (limit?: number, offset?: number) => {
  return async (dispatch: Dispatch) => {
    const optionLimit = limit || 300;
    const optionOffset = offset || 0;
    const response = await recipesService.getRecipes(optionLimit, optionOffset);

    const result = response.data;
    // if (__DEV__) {
    //   console.log('recipes', result);
    // }
    if (result.recipes) {
      dispatch({
        type: recipesActionTypes.GET_RECIPES,
        recipes: result.recipes || [],
      });
      return result.recipes;
    }
  };
};

export const updateOrCreateRecipe = (recipe: UpdateRecipeProps) => {
  return async (dispatch: Dispatch) => {
    const response = await recipesService.updateRecipe(recipe);

    const result = response.data;
    // if (__DEV__) {
    //   console.log('update or create recipes', result);
    // }
    if (result.name) {
      dispatch({
        type: recipesActionTypes.UPDATE_OR_CREATE_RECIPE,
        recipe: result,
      });
    }
    return result;
  };
};

export const getIngridientsForUpdate = async (query: string) => {
  const response = await recipesService.getIngridients(query);

  const result = response.data;
  // if (__DEV__) {
  //   console.log('get ingridients for update', result);
  // }
  return result;
};
