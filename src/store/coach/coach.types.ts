import {TotalProps} from 'store/userLog/userLog.types';
import {PhotoProps} from '../autoComplete/autoComplete.types';

export enum coachActionTypes {
  GET_CLIENT_TOTTALS = 'GET_CLIENT_TOTTALS',
  COACH_CLEAR = 'COACH_CLEAR',
  BECOME_COACH = 'BECOME_COACH',
  ADD_COACH = 'ADD_COACH',
  REMOVE_COACH = 'REMOVE_COACH',
  GET_COACHES = 'GET_COACHES',
}

export interface Coach {
  first_name: string;
  last_name: string;
  photo?: PhotoProps;
  code: string;
}

export interface CoachsState {
  clientTotals: Array<TotalProps>;
  coachesList: Array<Coach>;
}

export type getClientTotalsAction = {
  type: coachActionTypes.GET_CLIENT_TOTTALS;
  payload: Array<TotalProps>;
};
export type becomeCoachAction = {
  type: coachActionTypes.BECOME_COACH;
};
export type addCoachAction = {
  type: coachActionTypes.ADD_COACH;
  payload: Coach;
};
export type getCoachesAction = {
  type: coachActionTypes.GET_COACHES;
  payload: Coach[];
};
export type removeCoachAction = {
  type: coachActionTypes.REMOVE_COACH;
  payload: string;
};
export type clearCoachAction = {
  type: coachActionTypes.COACH_CLEAR;
};

export type CoachActions =
  | getClientTotalsAction
  | becomeCoachAction
  | addCoachAction
  | removeCoachAction
  | getCoachesAction
  | clearCoachAction;
