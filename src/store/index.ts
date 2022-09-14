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

const rootReducer = combineReducers({
  auth: authReducer,
  autoComplete: autoCompleteReducer,
  basket: basketReducer,
  userLog: userLogReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;
