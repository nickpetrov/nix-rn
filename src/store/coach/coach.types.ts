import {
  ExerciseProps,
  FoodProps,
  TotalProps,
} from 'store/userLog/userLog.types';
import {PhotoProps} from '../autoComplete/autoComplete.types';
import {User} from 'store/auth/auth.types';

export enum coachActionTypes {
  GET_CLIENT_TOTTALS = 'GET_CLIENT_TOTTALS',
  COACH_CLEAR = 'COACH_CLEAR',
  BECOME_COACH = 'BECOME_COACH',
  ADD_COACH = 'ADD_COACH',
  REMOVE_COACH = 'REMOVE_COACH',
  GET_COACHES = 'GET_COACHES',
  GET_CLIENTS = 'GET_CLIENTS',
  GET_CLIENT_FOODLOG = 'GET_CLIENT_FOODLOG',
  CLEAR_CLIENT_TOTALS_AND_FOODS = 'CLEAR_CLIENT_TOTALS_AND_FOODS',
  CHANGE_CLIENT_SELECTED_DATE = 'CHANGE_CLIENT_SELECTED_DATE',
  GET_CLIENT_EXERCISES_LOG = 'GET_CLIENT_EXERCISES_LOG',
  CHANGE_CLIENT_LOG_DATE_RANGE = 'CHANGE_CLIENT_LOG_DATE_RANGE',
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
  clientList: Array<User>;
  clientFoods: Array<FoodProps>;
  clientExercises: Array<ExerciseProps>;
  clientSelectedDate: string;
  clientDateRange: [string, string] | null;
}

export type getClientTotalsAction = {
  type: coachActionTypes.GET_CLIENT_TOTTALS;
  payload: Array<TotalProps>;
};
export type getClientFoogLogAction = {
  type: coachActionTypes.GET_CLIENT_FOODLOG;
  payload: Array<FoodProps>;
};
export type becomeCoachAction = {
  type: coachActionTypes.BECOME_COACH;
};
export type clearClientTotalsAndFoodsAction = {
  type: coachActionTypes.CLEAR_CLIENT_TOTALS_AND_FOODS;
};
export type addCoachAction = {
  type: coachActionTypes.ADD_COACH;
  payload: Coach;
};
export type getCoachesAction = {
  type: coachActionTypes.GET_COACHES;
  payload: Coach[];
};
export type getClientsAction = {
  type: coachActionTypes.GET_CLIENTS;
  payload: User[];
};
export type removeCoachAction = {
  type: coachActionTypes.REMOVE_COACH;
  payload: string;
};
export type getClientExercisesAction = {
  type: coachActionTypes.GET_CLIENT_EXERCISES_LOG;
  payload: Array<ExerciseProps>;
};
export type clearCoachAction = {
  type: coachActionTypes.COACH_CLEAR;
};
export type changeClientSelectedDateAction = {
  type: coachActionTypes.CHANGE_CLIENT_SELECTED_DATE;
  newDate: string;
};

export type changeClientLogDateRangeLogAction = {
  type: coachActionTypes.CHANGE_CLIENT_LOG_DATE_RANGE;
  payload: [string, string];
};

export type CoachActions =
  | getClientTotalsAction
  | becomeCoachAction
  | addCoachAction
  | removeCoachAction
  | getCoachesAction
  | getClientsAction
  | clearClientTotalsAndFoodsAction
  | getClientFoogLogAction
  | changeClientSelectedDateAction
  | getClientExercisesAction
  | clearCoachAction
  | changeClientLogDateRangeLogAction;
