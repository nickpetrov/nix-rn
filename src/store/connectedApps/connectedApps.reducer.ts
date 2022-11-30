//types
import {
  ConnectedAppsActions,
  connectedAppsActionTypes,
  ConnectionAppsState,
} from './connectedApps.types';

const initialState: ConnectionAppsState = {
  fitbitSync: null,
  hkSyncOptions: {
    nutrition: 'off',
    weight: 'off',
    exercise: 'off',
  },
};

export default (
  state: ConnectionAppsState = initialState,
  action: ConnectedAppsActions,
) => {
  switch (action.type) {
    case connectedAppsActionTypes.FITBIT_SIGN:
      return {...state, fitbitSync: action.payload};
    case connectedAppsActionTypes.FITBIT_UNLINK:
      return {...state, fitbitSync: null};
    case connectedAppsActionTypes.MERGE_HK_SYNC_OPTIONS:
      return {
        ...state,
        hkSyncOptions: {...state.hkSyncOptions, ...action.payload},
      };
    case connectedAppsActionTypes.CONNECTED_APPS_CLEAR:
      return initialState;
    default:
      return state;
  }
};
