import {AnyAction} from 'redux';
import {basketActionTypes, BasketState} from './basket.types';

const initialState = {
  foods: [],
  isSingleFood: false,
  recipeName: '',
  servings: '1',
  consumed_at: '',
  meal_type: 1,
};

export default (state: BasketState = initialState, action: AnyAction) => {
  switch (action.type) {
    case basketActionTypes.ADD_FOOD_TO_BASKET:
      let newFoods = [...state.foods];
      if (typeof action.foods == 'object') {
        newFoods = newFoods.concat(action.foods);
      } else {
        newFoods.push(action.foods);
      }
      return {...state, foods: newFoods};
    case basketActionTypes.UPDATE_BASKET_FOODS:
      return {...state, foods: action.foods};
    case basketActionTypes.CHANGE_LOGGING_TYPE:
      return {...state, isSingleFood: action.isSingleFood};
    case basketActionTypes.CHANGE_RECIPE_SERVINGS:
      return {...state, servings: action.servings};
    case basketActionTypes.CHANGE_RECIPE_NAME:
      return {...state, recipeName: action.newName};
    case basketActionTypes.CHANGE_CONSUMED_AT:
      return {...state, consumed_at: action.consumed_at};
    case basketActionTypes.CHANGE_MEAL_TYPE:
      return {...state, meal_type: action.newMealType};
    case basketActionTypes.MERGE_BASKET:
      let newFoodsAtBasket = [...state.foods];
      if (action.basket?.foods?.length) {
        newFoodsAtBasket = newFoodsAtBasket.concat(action.basket.foods);
      } else if (action.basket?.foods) {
        newFoodsAtBasket.push(action.basket.foods);
      }
      return {...state, ...action.basket, foods: newFoodsAtBasket};
    case basketActionTypes.RESET:
      return initialState;
    default:
      return state;
  }
};
