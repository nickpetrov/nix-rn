//types
import {autoCompleteActionTypes, AutoCompleteState} from './autoComplete.types';
import {AnyAction} from 'redux';

const initialState: AutoCompleteState = {
  searchValue: '',
  self: [],
  common: [],
  branded: [],
  suggested: [],
};

export default (
  state: AutoCompleteState = initialState,
  action: AnyAction,
): AutoCompleteState => {
  switch (action.type) {
    case autoCompleteActionTypes.UPDATE_SEARCH_RESULTS:
      return {...state, ...action.searchResult};
    case autoCompleteActionTypes.SHOW_SUGGESTED_FOODS:
      return {...state, suggested: [...action.suggestedFoods]};
    case autoCompleteActionTypes.SET_SEARCH_VALUE:
      return {...state, searchValue: action.paylaod};
    case autoCompleteActionTypes.CLEAR:
      return initialState;
    default:
      return state;
  }
};
