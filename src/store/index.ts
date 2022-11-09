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
import {setDB} from './base/base.actions';
import SQLite from 'react-native-sqlite-storage';
import {Platform} from 'react-native';

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
  whitelist: [
    'agreedToUsePhoto',
    'groceryAgentPreferences',
    'db',
    'hideVoiceRecognitionDisclaimer',
  ],
};
const connectedAppsPersist = {
  key: 'connectedApps',
  storage: AsyncStorage,
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
  connectedApps: persistReducer(connectedAppsPersist, connectedAppsReducer),
  coach: coachReducer,
  base: persistReducer(basePersist, baseReducer),
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
export const persistor = persistStore(store, null, () => {
  console.log('restored state from local storage', store.getState());
  const newUserJwt = store.getState().auth.userJWT;
  apiClient.defaults.headers.common['x-user-jwt'] = newUserJwt;
  const db = store.getState().base.db;
  if (!db?.transaction) {
    store.dispatch(
      setDB(
        SQLite.openDatabase(
          {
            name: 'track_db',
            // createFromLocation: 1,
            location: Platform.OS === 'ios' ? 'default' : 'Shared',
          },
          () => {
            console.log('Re-open connection success!');
          },
          error => {
            console.log('error open db', error);
          },
        ),
      ),
    );
  }
});
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;
