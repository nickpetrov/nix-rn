//types
import {
  FoodsActions,
  foodsActionTypes,
  FoodsState,
  TrackTabs,
} from './foods.types';

const initialState: FoodsState = {
  //QRcodeScreen
  foodFindByQRcode: null,
  //SuggestedScreen
  suggested_foods: [],
  //TrackScreen
  groceries: [],
  historyFoods: [],
  restaurants: [],
  restaurantsWithCalc: [],
  restaurantFoods: [],
  currentTrackTab: TrackTabs.FREEFORM,
  nixRestaurantFoodsTotal: 0,
  selectedRestaurant: null,
  searchQueryRestaurantFoods: '',
};

export default (
  state: FoodsState = initialState,
  action: FoodsActions,
): FoodsState => {
  switch (action.type) {
    case foodsActionTypes.GET_FOOD_BY_QR_CODE:
      return {...state, foodFindByQRcode: action.foodFindByQRcode};
    case foodsActionTypes.CLEAR_SCANED_FOOD:
      return {...state, foodFindByQRcode: null};
    case foodsActionTypes.GET_ALL_SUGGESTED_FOOD:
      return {...state, suggested_foods: action.suggested_foods};
    case foodsActionTypes.GET_GROCERIES:
      return {
        ...state,
        groceries: action.addValues
          ? state.groceries.concat(action.groceries)
          : action.groceries,
      };
    case foodsActionTypes.GET_HISTORY_FOODS:
      return {...state, historyFoods: action.historyFoods};
    case foodsActionTypes.CLEAR_HISTORY_FOODS:
      return {...state, historyFoods: []};
    case foodsActionTypes.GET_RESTORANTS:
      return {...state, restaurants: action.restaurants};
    case foodsActionTypes.GET_RESTORANTS_WITH_CALC:
      return {...state, restaurantsWithCalc: action.restaurantsWithCalc};
    case foodsActionTypes.GET_RESTORANTS_FOODS:
      return {...state, restaurantFoods: action.restaurantFoods};
    case foodsActionTypes.GET_NIX_RESTORANTS_FOODS:
      return {
        ...state,
        restaurantFoods: state.restaurantFoods.concat(action.restaurantFoods),
        nixRestaurantFoodsTotal: action.nixRestaurantFoodsTotal,
      };
    case foodsActionTypes.SET_TRACK_TAB:
      return {...state, currentTrackTab: action.payload};
    case foodsActionTypes.CLEAR_RESTORANTS_FOODS:
      return {...state, restaurantFoods: [], nixRestaurantFoodsTotal: 0};
    case foodsActionTypes.CLEAR_GROCERY_FOODS:
      return {...state, groceries: []};
    case foodsActionTypes.SET_SELECTED_RESTAURANT:
      return {...state, selectedRestaurant: action.payload};
    case foodsActionTypes.SET_SEARCH_QUERY_RESTAURANT_FOODS:
      return {...state, searchQueryRestaurantFoods: action.payload};
    case foodsActionTypes.CLEAR:
      return initialState;
    default:
      return state;
  }
};
