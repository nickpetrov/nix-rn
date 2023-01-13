//types
import {CoachActions, coachActionTypes, CoachsState} from './coach.types';

const initialState: CoachsState = {
  clientTotals: [],
  coachesList: [],
  clientList: [],
};

export default (state: CoachsState = initialState, action: CoachActions) => {
  switch (action.type) {
    case coachActionTypes.GET_CLIENT_TOTTALS:
      return {...state, clientTotals: action.payload};
    case coachActionTypes.GET_COACHES:
      return {...state, coachesList: action.payload};
    case coachActionTypes.GET_CLIENTS:
      return {...state, clientList: action.payload};
    case coachActionTypes.ADD_COACH:
      return {...state, coachesList: [...state.coachesList, action.payload]};
    case coachActionTypes.REMOVE_COACH: {
      const newCoachList = state.coachesList.filter(
        item => item.code !== action.payload,
      );
      return {...state, coachesList: newCoachList};
    }
    case coachActionTypes.COACH_CLEAR:
      return initialState;
    default:
      return state;
  }
};
