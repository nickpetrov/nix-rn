import recipesService from 'api/recipeService';
import {Dispatch} from 'redux';
import {recipesActionTypes} from './recipes.types';

export const getRecipes = () => {
  return async (dispatch: Dispatch) => {
    const limit = 50;
    const offset = 0;
    const response = await recipesService.getRecipes(limit, offset);

    const result = response.data;
    if (__DEV__) {
      console.log('recipes', result);
    }
    if (result.recipes) {
      dispatch({
        type: recipesActionTypes.GET_RECIPES,
        recipes: result.recipes || [],
      });
      return result.recipes;
    }
  };
};
