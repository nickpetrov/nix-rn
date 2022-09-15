import autoCompleteService from 'api/autoCompleteService';
import {Dispatch} from 'redux';
import {autoCompleteActionTypes} from './autoComplete.types';

export const updateSearchResults = (query: string) => {
  return async (dispatch: Dispatch) => {
    const result = await autoCompleteService.getInstant(query);

    const searchResult = result.data;

    dispatch({
      type: autoCompleteActionTypes.UPDATE_SEARCH_RESULTS,
      searchResult,
    });
  };
};

export const clear = () => {
  return {type: autoCompleteActionTypes.CLEAR};
};

export const showSuggestedFoods = (mealType: number) => {
  return async (dispatch: Dispatch) => {
    const result = await autoCompleteService.getSuggestedFoods(mealType);

    const response = result.data;

    const suggestedFoods = response.foods;

    dispatch({
      type: autoCompleteActionTypes.SHOW_SUGGESTED_FOODS,
      suggestedFoods,
    });
  };
};
