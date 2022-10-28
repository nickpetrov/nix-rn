//types
import {recipesActionTypes, RecipesState} from './recipes.types';
import {AnyAction} from 'redux';

const initialState: RecipesState = {
  recipes: [],
  limit: 25,
  offset: 0,
  showMore: true,
};

export default (
  state: RecipesState = initialState,
  action: AnyAction,
): RecipesState => {
  switch (action.type) {
    case recipesActionTypes.GET_RECIPES: {
      const newRecipes = action.payload.offset
        ? state.recipes.concat(action.payload.recipes)
        : action.payload.recipes;
      return {
        ...state,
        recipes: newRecipes,
        offset: action.payload.offset || state.offset,
        showMore: action.payload.length === state.limit,
      };
    }
    case recipesActionTypes.UPDATE_OR_CREATE_RECIPE: {
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
    }
    case recipesActionTypes.COPY_RECIPE: {
      const newRecipes = [...state.recipes];

      newRecipes.splice(action.clonedRecipeIndex + 1, 0, action.payload);
      return {...state, recipes: newRecipes};
    }
    case recipesActionTypes.CREATE_RECIPE: {
      return {...state, recipes: [action.payload, ...state.recipes]};
    }
    case recipesActionTypes.DELETE_RECIPE: {
      const newRecipes = state.recipes.filter(
        item => item.id !== action.payload,
      );
      return {...state, recipes: newRecipes};
    }
    case recipesActionTypes.CLEAR:
      return initialState;
    default:
      return state;
  }
};
