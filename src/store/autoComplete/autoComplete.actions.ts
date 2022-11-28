import autoCompleteService from 'api/autoCompleteService';
import {Dispatch} from 'redux';
import {
  autoCompleteActionTypes,
  showSuggestedFoodsActionType,
  updateSearchResultsActionType,
} from './autoComplete.types';
import _ from 'lodash';
import {FoodProps} from 'store/userLog/userLog.types';

export const updateSearchResults = (query: string) => {
  return async (dispatch: Dispatch<updateSearchResultsActionType>) => {
    try {
      const response = await autoCompleteService.getInstant(query);

      const data = response.data;

      const selfResults = _.filter(data.self, res => {
        return res.serving_qty;
      }) as FoodProps[];

      const uniqCommon = _.uniqBy(data.common, (food: FoodProps) => {
        return food.tag_id;
      });

      const searchResult = {
        ...data,
        self: selfResults,
        common: uniqCommon.length <= 3 ? data.common : uniqCommon,
      };

      dispatch({
        type: autoCompleteActionTypes.UPDATE_SEARCH_RESULTS,
        payload: searchResult,
      });
    } catch (err: any) {
      throw new Error(err.message || 'Oops, something go wrong');
    }
  };
};

export const setSearchValue = (text: string) => {
  return {type: autoCompleteActionTypes.SET_SEARCH_VALUE, payload: text};
};

export const clear = () => {
  return {type: autoCompleteActionTypes.CLEAR};
};

export const showSuggestedFoods = (mealType: number) => {
  return async (dispatch: Dispatch<showSuggestedFoodsActionType>) => {
    try {
      const result = await autoCompleteService.getSuggestedFoods(mealType);

      const response = result.data;

      const suggestedFoods = _.remove(
        response.foods,
        (el: FoodProps) => el.food_name,
      );

      dispatch({
        type: autoCompleteActionTypes.SHOW_SUGGESTED_FOODS,
        payload: suggestedFoods,
      });
    } catch (err: any) {
      throw new Error(err.message || 'Oops, something go wrong');
    }
  };
};
