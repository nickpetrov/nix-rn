import {TotalProps, WeightProps} from 'store/userLog/userLog.types';

export enum statsActionTypes {
  STATS_GET_DAY_TOTALS = 'STATS_GET_DAY_TOTALS',
  STATS_GET_WEIGHTS = 'STATS_GET_WEIGHTS',
  CLEAR = 'CLEAR',
}

export interface StatsState {
  dates: Array<TotalProps>;
  weights: Array<WeightProps>;
}

export type getWeightParams = {
  begin?: string;
  end?: string;
  timezone?: string;
  offset?: number;
  limit?: number;
};
