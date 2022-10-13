import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
  AnyAction,
} from 'redux';
import thunk, {ThunkDispatch} from 'redux-thunk';

import authReducer from './auth/auth.reducer';
import autoCompleteReducer from './autoComplete/autoComplete.reducer';
import basketReducer from './basket/basket.reducer';
import userLogReducer from './userLog/userLog.reducer';
import statsReducer from './stats/stats.reducer';
import foodsReducer from './foods/foods.reducer';
import recipesReducer from './recipes/recipes.reducer';
import customFoodsReducer from './customFoods/customFoods.reducer';
import connectedAppsReducer from './connectedApps/connectedApps.reducer';
import coachReducer from './coach/coach.reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  autoComplete: autoCompleteReducer,
  basket: basketReducer,
  userLog: userLogReducer,
  stats: statsReducer,
  foods: foodsReducer,
  recipes: recipesReducer,
  customFoods: customFoodsReducer,
  connectedApps: connectedAppsReducer,
  coach: coachReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;
