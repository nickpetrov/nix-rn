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
    case recipesActionTypes.UPDATE_RECIPE:
      return {...state, recipes: action.recipes};
    case recipesActionTypes.CLEAR:
      return initialState;
    default:
      return state;
  }
};
