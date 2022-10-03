import userLogService from 'api/userLogService';
import {Dispatch} from 'redux';
import {statsActionTypes} from './stats.types';
import {RootState} from '../index';

export const getDayTotals = (beginDate: string, endDate: string) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const timezone = useState().auth.userData.timezone;

    const response = await userLogService.getTotals({
      beginDate,
      endDate,
      timezone,
    });

    const totals = response.data;
    // if (__DEV__) {
    //   console.log('totals', totals);
    // }
    if (totals.dates) {
      dispatch({
        type: statsActionTypes.STATS_GET_DAY_TOTALS,
        dates: totals.dates || [],
      });
    }
  };
};

export const getStatsWeight = () => {
  return async (dispatch: Dispatch) => {
    const response = await userLogService.getUserWeightlog({});

    const result = response.data;
    // if (__DEV__) {
    //   console.log('weightsLog', result.weights);
    // }
    if (result.weights) {
      dispatch({
        type: statsActionTypes.STATS_GET_WEIGHTS,
        weights: result.weights,
      });
    }
  };
};
