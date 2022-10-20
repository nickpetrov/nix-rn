import autoCompleteService from 'api/autoCompleteService';
import {Dispatch} from 'redux';
import {autoCompleteActionTypes} from './autoComplete.types';
import _ from 'lodash';
import {FoodProps} from 'store/userLog/userLog.types';

export const updateSearchResults = (query: string) => {
  return async (dispatch: Dispatch) => {
    const response = await autoCompleteService.getInstant(query);

    const data = response.data;

    const selfResults = _.filter(data.self, res => {
      return res.serving_qty;
    });

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
      searchResult,
    });
  };
};

export const setSearchValue = (text: string) => {
  return {type: autoCompleteActionTypes.SET_SEARCH_VALUE, paylaod: text};
};

export const clear = () => {
  return {type: autoCompleteActionTypes.CLEAR};
};

export const showSuggestedFoods = (mealType: number) => {
  return async (dispatch: Dispatch) => {
    const result = await autoCompleteService.getSuggestedFoods(mealType);

    const response = result.data;

    const suggestedFoods = _.remove(
      response.foods,
      (el: FoodProps) => el.food_name,
    );

    dispatch({
      type: autoCompleteActionTypes.SHOW_SUGGESTED_FOODS,
      suggestedFoods,
    });
  };
};
