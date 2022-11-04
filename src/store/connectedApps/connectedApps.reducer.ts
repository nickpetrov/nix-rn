//types
import {
  connectedAppsActionTypes,
  ConnectionAppsState,
} from './connectedApps.types';
import {AnyAction} from 'redux';

const initialState: ConnectionAppsState = {
  fitbitSync: null,
};

export default (
  state: ConnectionAppsState = initialState,
  action: AnyAction,
) => {
  switch (action.type) {
    case connectedAppsActionTypes.FITBIT_SIGN:
      return {...state, fitbitSync: action.payload};
    case connectedAppsActionTypes.FITBIT_UNLINK:
      return {...state, fitbitSync: null};
    case connectedAppsActionTypes.CLEAR:
      return initialState;
    default:
      return state;
  }
};
