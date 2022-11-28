//types
import {
  AutoCompleteActions,
  autoCompleteActionTypes,
  AutoCompleteState,
} from './autoComplete.types';

const initialState: AutoCompleteState = {
  searchValue: '',
  self: [],
  common: [],
  branded: [],
  suggested: [],
};

export default (
  state: AutoCompleteState = initialState,
  action: AutoCompleteActions,
): AutoCompleteState => {
  switch (action.type) {
    case autoCompleteActionTypes.UPDATE_SEARCH_RESULTS:
      return {...state, ...action.payload};
    case autoCompleteActionTypes.SHOW_SUGGESTED_FOODS:
      return {...state, suggested: [...action.payload]};
    case autoCompleteActionTypes.SET_SEARCH_VALUE:
      return {...state, searchValue: action.payload};
    case autoCompleteActionTypes.AUTOCOMPLETE_CLEAR:
      return initialState;
    default:
      return state;
  }
};
