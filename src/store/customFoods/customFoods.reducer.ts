//types
import {customFoodsActionTypes, CustomFoodsState} from './customFoods.types';
import {AnyAction} from 'redux';

const initialState: CustomFoodsState = {
  foods: [],
};

export default (
  state: CustomFoodsState = initialState,
  action: AnyAction,
): CustomFoodsState => {
  switch (action.type) {
    case customFoodsActionTypes.GET_ALL_CUSTOM_FOOD:
      const stateWithTotals = {...state, foods: action.foods};
      return stateWithTotals;
    case customFoodsActionTypes.UPDATE_OR_CREATE_CUSTOM_FOOD: {
      const newFoods = [...state.foods];
      const foodIndex = newFoods.findIndex(item => item.id === action.food.id);
      if (foodIndex !== -1) {
        newFoods[foodIndex] = action.food;
      } else {
        newFoods.unshift(action.food);
      }
      return {...state, foods: newFoods};
    }
    case customFoodsActionTypes.DELETE_CUSTOM_FOOD: {
      const newFoods = state.foods.filter(item => item.id !== action.payload);
      return {...state, foods: newFoods};
    }
    case customFoodsActionTypes.CLEAR:
      return initialState;
    default:
      return state;
  }
};
