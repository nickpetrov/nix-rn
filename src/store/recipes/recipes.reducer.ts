//types
import {recipesActionTypes, RecipesState} from './recipes.types';
import {AnyAction} from 'redux';

const initialState: RecipesState = {
  recipes: [],
};

export default (state: RecipesState = initialState, action: AnyAction) => {
  switch (action.type) {
    case recipesActionTypes.GET_RECIPES:
      const stateWithTotals = {...state, recipes: action.recipes};
      return stateWithTotals;
    case recipesActionTypes.UPDATE_OR_CREATE_RECIPE:
      const newRecipes = [...state.recipes];
      const recipeIndex = newRecipes.findIndex(
        item => item.id === action.recipe.id,
      );
      if (recipeIndex !== -1) {
        newRecipes[recipeIndex] = action.recipe;
      } else {
        newRecipes.push(action.recipe);
      }
      return {...state, recipes: newRecipes};
    case recipesActionTypes.CLEAR:
      return initialState;
    default:
      return state;
  }
};
