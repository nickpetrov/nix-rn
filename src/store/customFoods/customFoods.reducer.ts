//types
import {customFoodsActionTypes, CustomFoodsState} from './customFoods.types';
import {AnyAction} from 'redux';

const initialState: CustomFoodsState = {
  foods: [],
};

export default (state: CustomFoodsState = initialState, action: AnyAction) => {
  switch (action.type) {
    case customFoodsActionTypes.GET_ALL_CUSTOM_FOOD:
      const stateWithTotals = {...state, foods: action.foods};
      return stateWithTotals;
    case customFoodsActionTypes.CLEAR:
      return initialState;
    default:
      return state;
  }
};
