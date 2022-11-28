import {TotalProps} from 'store/userLog/userLog.types';

export enum coachActionTypes {
  GET_CLIENT_TOTTALS = 'GET_CLIENT_TOTTALS',
  CLEAR = 'CLEAR',
}

export interface CoachsState {
  clientTotals: Array<TotalProps>;
}

export type getClientTotalsAction = {
  type: coachActionTypes.GET_CLIENT_TOTTALS;
  payload: Array<TotalProps>;
};
export type clearCoachAction = {
  type: coachActionTypes.CLEAR;
};

export type CoachActions = getClientTotalsAction | clearCoachAction;
