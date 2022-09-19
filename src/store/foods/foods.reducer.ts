//types
import {foodsActionTypes, FoodsState} from './foods.types';
import {AnyAction} from 'redux';

const initialState: FoodsState = {
  foodInfo: null,
  custom_foods: [],
};

export default (state: FoodsState = initialState, action: AnyAction) => {
  switch (action.type) {
    case foodsActionTypes.GET_FOOD_INFO:
      const stateWithTotals = {...state, foodInfo: action.foodInfo};
      return stateWithTotals;
    case foodsActionTypes.GET_ALL_CUSTOM_FOOD:
      return {...state, custom_foods: action.custom_foods};
    case foodsActionTypes.CLEAR:
      return initialState;
    default:
      return state;
  }
};
