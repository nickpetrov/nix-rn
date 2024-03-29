import {BasketActions, basketActionTypes, BasketState} from './basket.types';

const initialState: BasketState = {
  foods: [],
  isSingleFood: false,
  recipeName: '',
  servings: '1',
  consumed_at: '',
  meal_type: 1,
  recipeBrand: '',
  customPhoto: null,
};

export default (
  state: BasketState = initialState,
  action: BasketActions,
): BasketState => {
  switch (action.type) {
    case basketActionTypes.ADD_FOOD_TO_BASKET: {
      let newFoods = [...state.foods];
      if (Array.isArray(action.foods)) {
        newFoods = newFoods.concat(action.foods);
      } else {
        newFoods.push(action.foods);
      }
      return {...state, foods: newFoods};
    }
    case basketActionTypes.UPDATE_BASKET_FOODS:
      return {...state, foods: action.foods};
    case basketActionTypes.DELETE_FOOD_FROM_BASKET: {
      let newFoods = [...state.foods];
      newFoods = newFoods.filter(item => item.basketId !== action.id);
      if (newFoods.length > 0) {
        return {...state, foods: newFoods};
      } else {
        return initialState;
      }
    }
    case basketActionTypes.MERGE_BASKET: {
      return {
        ...state,
        ...action.payload,
        meal_type: action.payload.meal_type || state.meal_type,
      };
    }
    case basketActionTypes.BASKET_RESET:
      return initialState;
    default:
      return state;
  }
};
