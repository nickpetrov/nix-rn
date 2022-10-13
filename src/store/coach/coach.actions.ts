import {Dispatch} from 'redux';
import coachService from 'api/coachService';
import {coachActionTypes} from './coach.types';
import {OptionsProps} from 'api/coachService/types';
import _ from 'lodash';
import moment from 'moment-timezone';

export const getClientTotals = (options: Partial<OptionsProps>) => {
  return async (dispatch: Dispatch) => {
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
        paylaod: result.dates,
      });
    }
  };
};
