//types
import {CoachActions, coachActionTypes, CoachsState} from './coach.types';

const initialState: CoachsState = {
  clientTotals: [],
};

export default (state: CoachsState = initialState, action: CoachActions) => {
  switch (action.type) {
    case coachActionTypes.GET_CLIENT_TOTTALS:
      return {...state, clientTotals: action.payload};

    case coachActionTypes.COACH_CLEAR:
      return initialState;
    default:
      return state;
  }
};
