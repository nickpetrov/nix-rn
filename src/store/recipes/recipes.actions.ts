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
    try {
      const response = await recipesService.getRecipes(
        optionLimit,
        optionOffset,
      );

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
    } catch (error) {
      throw error;
    }
  };
};

export const getRecipeById = (id: string) => {
  return async () => {
    try {
      const response = await recipesService.getRecipeById(id);

      const result = response.data;

      if (result) {
        return result;
      }
    } catch (error) {
      throw error;
    }
  };
};

export const updateRecipe = (recipe: UpdateRecipeProps) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await recipesService.updateRecipe(recipe);
      const result = response.data;
      if (result.name) {
        dispatch({
          type: recipesActionTypes.UPDATE_OR_CREATE_RECIPE,
          recipe: result,
        });
        return result;
      }
    } catch (err) {
      throw err;
    }
  };
};

export const createRecipe = (recipe: UpdateRecipeProps) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await recipesService.createRecipe(recipe);

      const result = response.data;

      if (result.name) {
        dispatch({
          type: recipesActionTypes.CREATE_RECIPE,
          payload: result,
        });
        return result;
      }
    } catch (error) {
      throw error;
    }
  };
};
export const copyRecipe = (
  recipe: UpdateRecipeProps,
  clonedRecipeIndex: number,
) => {
  return async (dispatch: Dispatch) => {
    try {
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
        return result;
      }
    } catch (err: any) {
      throw err;
    }
  };
};

export const deleteRecipe = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await recipesService.deleteRecipe(id);

      if (response.status === 200) {
        dispatch({
          type: recipesActionTypes.DELETE_RECIPE,
          payload: id,
        });
      }
    } catch (error) {
      throw error;
    }
  };
};

export const getIngridientsForUpdate = async ({
  query,
  line_delimited,
  use_raw_foods,
}: {
  query: string;
  line_delimited?: boolean;
  use_raw_foods?: boolean;
}) => {
  try {
    const response = await recipesService.getIngridients({
      query,
      line_delimited,
      use_raw_foods,
    });

    const result = response.data;
    // if (__DEV__) {
    //   console.log('get ingridients for update', result);
    // }
    if (result) {
      return result;
    }
  } catch (error) {
    throw error;
  }
};

export const reset = () => {
  return async (dispatch: Dispatch) => {
    dispatch({type: recipesActionTypes.CLEAR});
  };
};
