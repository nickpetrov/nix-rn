import {TotalProps} from 'store/userLog/userLog.types';

export enum coachActionTypes {
  GET_CLIENT_TOTTALS = 'GET_CLIENT_TOTTALS',
  CLEAR = 'CLEAR',
}

export interface CoachsState {
  clientTotals: Array<TotalProps>;
}
