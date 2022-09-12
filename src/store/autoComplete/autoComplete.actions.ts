import {Dispatch} from 'redux';

export const UPDATE_SEARCH_RESULTS = 'UPDATE_SEARCH_RESULTS';
export const CLEAR = 'CLEAR';
export const SHOW_SUGGESTED_FOODS = 'SHOW_SUGGESTED_FOODS';

export const updateSearchResults = (query: string) => {
  return async (dispatch: Dispatch, useState: any) => {
    const jwt = useState().auth.userJWT;
    const result = await fetch(
      `https://trackapi.nutritionix.com/v2/search/instant?query=${query}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-user-jwt': jwt,
        },
        method: 'GET',
      },
    );

    const searchResult = await result.json();

    dispatch({type: UPDATE_SEARCH_RESULTS, searchResult});
  };
};

export const clear = () => {
  return {type: CLEAR};
};

export const showSuggestedFoods = (mealType: number) => {
  // mealType = 2;
  return async (dispatch: Dispatch, useState: any) => {
    const jwt = useState().auth.userJWT;
    const result = await fetch(
      `https://trackapi.nutritionix.com/v2/reports/suggested${
        mealType !== undefined && mealType !== -1
          ? `?meal_types=[${mealType}]`
          : ''
      }`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-user-jwt': jwt,
        },
        method: 'GET',
      },
    );

    const response = await result.json();
    console.log(response.foods);

    console.log(response);
    const suggestedFoods = response.foods;

    dispatch({type: SHOW_SUGGESTED_FOODS, suggestedFoods});
  };
};
