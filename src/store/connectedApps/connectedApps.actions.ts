import {Dispatch} from 'redux';
import connectedAppsService from 'api/connectedAppsService';
import {connectedAppsActionTypes} from './connectedApps.types';

export const fitbitSign = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await connectedAppsService.fitbitSign();

      const result = response.data;
      if (__DEV__) {
        console.log('fitbitSign', result.state);
      }
      if (result.state) {
        dispatch({
          type: connectedAppsActionTypes.FITBIT_SIGN,
          payload: result.state,
        });
        return result.state;
      }
    } catch (err: any) {
      throw err;
    }
  };
};

export const fitbitUnlink = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await connectedAppsService.fitbitUnlink();

      if (__DEV__) {
        console.log('fitbitUnlink', response);
      }
      if (response.status === 200) {
        dispatch({
          type: connectedAppsActionTypes.FITBIT_UNLINK,
        });
      }
    } catch (err) {
      throw err;
    }
  };
};
