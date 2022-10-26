import recipesService from 'api/recipeService';
import {Dispatch} from 'redux';
import {recipesActionTypes, UpdateRecipeProps} from './recipes.types';
import {RootState} from '../index';

export const getRecipes = ({
  newLimit,
  newOffset,
}: {
  newLimit?: number;
  newOffset?: number;
}) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const {limit, offset} = useState().recipes;
    const optionLimit = newLimit || limit;
    const optionOffset = newOffset || offset;
    const response = await recipesService.getRecipes(optionLimit, optionOffset);

    const result = response.data;
    // if (__DEV__) {
    //   console.log('recipes', result);
    // }
    if (result.recipes) {
      dispatch({
        type: recipesActionTypes.GET_RECIPES,
        payload: {recipes: result.recipes || [], offset: optionOffset},
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

export const copyRecipe = (
  recipe: UpdateRecipeProps,
  clonedRecipeIndex: number,
) => {
  return async (dispatch: Dispatch) => {
    const response = await recipesService.createRecipe(recipe);

    const result = response.data;
    // if (__DEV__) {
    //   console.log('update or create recipes', result);
    // }
    if (result.name) {
      dispatch({
        type: recipesActionTypes.COPY_RECIPE,
        payload: result,
        clonedRecipeIndex,
      });
    }
    return result;
  };
};

export const deleteRecipe = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    const response = await recipesService.deleteRecipe(id);

    if (response.status === 200) {
      dispatch({
        type: recipesActionTypes.DELETE_RECIPE,
        payload: id,
      });
    }
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

export const reset = () => {
  return async (dispatch: Dispatch) => {
    dispatch({type: recipesActionTypes.CLEAR});
  };
};
