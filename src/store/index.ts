import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
  AnyAction,
} from 'redux';
import thunk, {ThunkDispatch} from 'redux-thunk';
import {persistReducer, persistStore} from 'redux-persist';

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
import baseReducer from './base/base.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from 'api/index';

const authPersist = {
  key: 'auth',
  storage: AsyncStorage,
};
const baskePersist = {
  key: 'basket',
  storage: AsyncStorage,
};
const basePersist = {
  key: 'base',
  storage: AsyncStorage,
  whitelist: ['agreedToUsePhoto', 'groceryAgentPreferences'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersist, authReducer),
  autoComplete: autoCompleteReducer,
  basket: persistReducer(baskePersist, basketReducer),
  userLog: userLogReducer,
  stats: statsReducer,
  foods: foodsReducer,
  recipes: recipesReducer,
  customFoods: customFoodsReducer,
  connectedApps: connectedAppsReducer,
  coach: coachReducer,
  base: persistReducer(basePersist, baseReducer),
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
export const persistor = persistStore(store, null, () => {
  console.log('restored state from local storage', store.getState());
  const newUserJwt = store.getState().auth.userJWT;
  apiClient.defaults.headers.common['x-user-jwt'] = newUserJwt;
});
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;
