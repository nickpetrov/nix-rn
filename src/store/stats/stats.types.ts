import {TotalProps, WeightProps} from 'store/userLog/userLog.types';

export enum statsActionTypes {
  STATS_GET_DAY_TOTALS = 'STATS_GET_DAY_TOTALS',
  STATS_GET_WEIGHTS = 'STATS_GET_WEIGHTS',
  STATS_CLEAR = 'STATS_CLEAR',
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

export type statsGetDayTotals = {
  type: statsActionTypes.STATS_GET_DAY_TOTALS;
  dates: Array<TotalProps>;
};
export type statsGetWeights = {
  type: statsActionTypes.STATS_GET_WEIGHTS;
  weights: Array<WeightProps>;
  add: boolean;
};
export type clearStatsAction = {
  type: statsActionTypes.STATS_CLEAR;
};

export type StatsActions =
  | statsGetDayTotals
  | statsGetWeights
  | clearStatsAction;
