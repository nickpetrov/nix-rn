import userLogService from 'api/userLogService';
import {Dispatch} from 'redux';
import {captureException} from '@sentry/react-native';
import {
  clearStatsAction,
  getWeightParams,
  statsActionTypes,
  statsGetDayTotals,
  statsGetWeights,
} from './stats.types';
import {RootState} from '../index';

export const getDayTotals = (beginDate: string, endDate: string) => {
  return async (
    dispatch: Dispatch<statsGetDayTotals>,
    useState: () => RootState,
  ) => {
    const timezone = useState().auth.userData.timezone;
    const alreadyLoaded = useState().stats.dates[beginDate];
    if (alreadyLoaded) {
      return;
    }
    try {
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
          day: beginDate,
        });
      }
    } catch (err: any) {
      console.log('error getDayTotals stats reducer', err);
      if (err?.status !== 0) {
        captureException(err);
      }
    }
  };
};

export const getStatsWeight = (params?: getWeightParams) => {
  return async (dispatch: Dispatch<statsGetWeights>) => {
    try {
      const response = await userLogService.getUserWeightlog(
        params ? params : {},
      );

      const result = response.data;
      // if (__DEV__) {
      //   console.log('weightsLog', result.weights);
      // }
      if (result.weights) {
        dispatch({
          type: statsActionTypes.STATS_GET_WEIGHTS,
          weights: result.weights,
          add: !!params?.offset && params?.offset > 0,
        });
        return result.weights;
      }
    } catch (err: any) {
      console.log(err);
      if (err?.status !== 0) {
        captureException(err);
      }
    }
  };
};

export const clearStats = (): clearStatsAction => {
  return {type: statsActionTypes.STATS_CLEAR};
};
