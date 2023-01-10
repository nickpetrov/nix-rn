// utils
import {Dispatch} from 'redux';
import _ from 'lodash';
import moment from 'moment-timezone';

// services
import coachService from 'api/coachService';

// actions
import {getUserDataFromAPI} from 'store/auth/auth.actions';

// types
import {coachActionTypes, getClientTotalsAction} from './coach.types';
import {OptionsProps} from 'api/coachService/types';

export const getClientTotals = (options: Partial<OptionsProps>) => {
  return async (dispatch: Dispatch<getClientTotalsAction>) => {
    let newOptions = {...options};
    if (_.isEmpty(newOptions)) {
      newOptions = {};
    }

    if (!newOptions.begin) {
      newOptions.begin = moment().startOf('month').format('YYYY-MM-DD');
    }
    if (!newOptions.end) {
      newOptions.end = moment().endOf('month').format('YYYY-MM-DD');
    }
    if (!newOptions.timezone) {
      newOptions.timezone = 'US/Eastern';
    }
    try {
      const response = await coachService.getClientTotals(
        newOptions as OptionsProps,
      );

      const result = response.data;
      if (__DEV__) {
        console.log('client totals', result);
      }
      if (result.dates) {
        dispatch({
          type: coachActionTypes.GET_CLIENT_TOTTALS,
          payload: result.dates,
        });
      }
    } catch (err) {
      throw err;
    }
  };
};

export const becomeCoach = () => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await coachService.becomeCoach();
      if (!!res && !!res.data && !!res.data.code) {
        dispatch<any>(getUserDataFromAPI());
      }
    } catch (error) {
      console.log('error become coach', error);
    }
  };
};

export const addCoach = (coachCode: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await coachService.addCoach(coachCode);
      dispatch({
        type: coachActionTypes.ADD_COACH,
        payload: res.data,
      });
    } catch (err) {
      throw err;
    }
  };
};
export const removeCoach = (coachCode: string) => {
  return async (dispatch: Dispatch) => {
    try {
      await coachService.removeCoach(coachCode);
      dispatch({
        type: coachActionTypes.REMOVE_COACH,
        payload: coachCode,
      });
    } catch (err) {
      console.log('error remove coach', err);
    }
  };
};
